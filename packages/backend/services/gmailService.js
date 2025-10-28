import authService from "./authService.js";
import Mail from "../models/mail.js";
import User from "../models/user.js";

class GmailService {
  constructor() {
    this.gmail = null;
  }

  async authenticate(user) {
    try {
      if (!user) {
        throw new Error("User authentication required");
      }

      // Get authenticated Gmail client for the user
      this.gmail = await authService.getAuthenticatedGmailClient(user);
      return this.gmail;
    } catch (error) {
      console.error("Gmail authentication failed:", error);
      throw new Error(`Gmail authentication failed: ${error.message}`);
    }
  }

  async listLabels(user) {
    try {
      const gmail = await this.authenticate(user);

      // Get the list of labels.
      const result = await gmail.users.labels.list({
        userId: "me",
      });

      const labels = result.data.labels;
      if (!labels || labels.length === 0) {
        return [];
      }

      return labels;
    } catch (error) {
      console.error("Error listing labels:", error);
      throw new Error(`Failed to list labels: ${error.message}`);
    }
  }

  async getLabel(user, labelId) {
    try {
      const gmail = await this.authenticate(user);

      const result = await gmail.users.labels.get({
        userId: "me",
        id: labelId,
      });

      return result.data;
    } catch (error) {
      console.error("Error getting label:", error);
      throw new Error(`Failed to get label: ${error.message}`);
    }
  }

  async fetchNewEmails(user, maxResults = 10) {
    try {
      const gmail = await this.authenticate(user);

      const lastHistoryId = user.lastHistoryId;

      let messageIds = [];

      if (lastHistoryId) {
        // Incremental sync — only get new emails since last sync
        const historyRes = await gmail.users.history.list({
          userId: "me",
          startHistoryId: lastHistoryId,
          historyTypes: ["messageAdded"], // only new messages
        });

        const history = historyRes.data.history || [];

        history.forEach((h) => {
          if (h.messagesAdded) {
            h.messagesAdded.forEach((m) => {
              messageIds.push(m.message.id);
            });
          }
        });
      }

      // If no history yet (first-time sync), do a full fetch
      if (!lastHistoryId || messageIds.length === 0) {
        const listRes = await gmail.users.messages.list({
          userId: "me",
          labelIds: ["INBOX"],
          maxResults,
        });
        messageIds = listRes.data.messages?.map((m) => m.id) || [];
      }

      // Fetch full message details
      const emailPromises = messageIds.map(async (id) => {
        const email = await gmail.users.messages.get({
          userId: "me",
          id,
          format: "full",
        });

        const payload = email.data.payload;
        const headers = payload.headers;

        const subject = headers.find((h) => h.name === "Subject")?.value || "";
        const from = headers.find((h) => h.name === "From")?.value || "";
        const toHeader = headers.find((h) => h.name === "To")?.value || "";
        const to = toHeader ? toHeader.split(",").map((a) => a.trim()) : [];
        const dateHeader = headers.find((h) => h.name === "Date")?.value;
        const date = dateHeader ? new Date(dateHeader) : null;

        const decodeBase64 = (str) =>
          Buffer.from(
            str.replace(/-/g, "+").replace(/_/g, "/"),
            "base64"
          ).toString("utf-8");

        const getBody = (payload) => {
          if (payload.body?.data) return decodeBase64(payload.body.data);
          if (payload.parts?.length)
            return payload.parts.map(getBody).join("\n");
          return "";
        };

        const body = getBody(payload);
        const labels = email.data.labelIds || [];

        const mailDoc = {
          user: user._id,
          mailId: email.data.id,
          threadId: email.data.threadId,
          subject,
          from,
          to,
          snippet: email.data.snippet,
          body,
          labels,
          date,
          lastSyncedAt: new Date(),
        };

        // Upsert into DB
        await Mail.findOneAndUpdate(
          { mailId: mailDoc.mailId },
          { $set: mailDoc },
          { upsert: true }
        );

        return mailDoc;
      });

      const emails = await Promise.all(emailPromises);
      emails.sort((a, b) => b.date - a.date);

      const profileRes = await gmail.users.getProfile({ userId: "me" });
      const currentHistoryId = profileRes.data.historyId;

      if (currentHistoryId) {
        await User.findByIdAndUpdate(user._id, {
          lastHistoryId: currentHistoryId,
        });
      }

      return emails;
    } catch (error) {
      console.error("Error getting emails:", error);
      throw new Error(`Failed to get emails: ${error.message}`);
    }
  }

  async getEmails(user, maxResults, page) {
    try {
      const pageNumber = page;
      const pageSize = maxResults;

      const count = await Mail.countDocuments({ user });

      const mails = await Mail.find({ user })
        .sort({ date: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .populate("user", "name email _id");

      return { mails, count };
    } catch (error) {
      console.error("Error getting emails:", error);
      throw new Error(`Failed to get emails: ${error.message}`);
    }
  }

  // New method to get email by ID
  async getEmailById(user, emailId) {
    try {
      const gmail = await this.authenticate(user);

      const result = await gmail.users.messages.get({
        userId: "me",
        id: emailId,
        format: "full",
      });

      return result.data;
    } catch (error) {
      console.error("Error getting email by ID:", error);
      throw new Error(`Failed to get email: ${error.message}`);
    }
  }

  async getEmailSyncCount(user) {
    try {
      // Get the count of synced emails for this user
      const countPromise = Mail.countDocuments({ user });

      // Get the most recent lastSyncedAt date for this user
      const latestSyncedMailPromise = Mail.findOne({ user })
        .sort({ lastSyncedAt: -1 }) // Descending order, so first result is latest
        .select("lastSyncedAt")
        .lean();

      const [count, latestSyncedMail] = await Promise.all([
        countPromise,
        latestSyncedMailPromise,
      ]);
      const latestSyncedAt = latestSyncedMail
        ? latestSyncedMail.lastSyncedAt
        : null;

      return { count, latestSyncedAt };
    } catch (error) {
      console.error(
        "Error getting email sync count and latest lastSyncedAt:",
        error
      );
      throw new Error(`Failed to get email sync info: ${error.message}`);
    }
  }

  async getLastSyncAt(userId) {
    try {
      const latestSyncedAt = await Mail.findOne({ user: userId })
        .sort({ lastSyncedAt: -1 })
        .select("lastSyncedAt")
        .lean();
      return latestSyncedAt;
    } catch (error) {
      console.error(
        "Error getting email sync count and latest lastSyncedAt:",
        error
      );
      throw new Error(`Failed to get email sync info: ${error.message}`);
    }
  }
}

export default new GmailService();
