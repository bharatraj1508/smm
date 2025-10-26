import authService from "./authService.js";
import Mail from "../models/mail.js";

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

  async getEmails(user, query = "", maxResults = 10) {
    try {
      const gmail = await this.authenticate(user);

      // 1. Get list of message IDs
      const result = await gmail.users.messages.list({
        userId: "me",
        q: query,
        maxResults,
      });

      const messages = result.data.messages || [];

      // 2. For each message, fetch full email details
      const emailPromises = messages.map(async (message) => {
        const email = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
          format: "full",
        });

        const payload = email.data.payload;
        const headers = payload.headers;

        // Extract useful metadata
        const subject = headers.find((h) => h.name === "Subject")?.value || "";
        const from = headers.find((h) => h.name === "From")?.value || "";
        const toHeader = headers.find((h) => h.name === "To")?.value || "";
        const to = toHeader ? toHeader.split(",").map((a) => a.trim()) : [];

        const dateHeader = headers.find((h) => h.name === "Date")?.value;
        const date = dateHeader ? new Date(dateHeader) : null;

        // Decode base64 body recursively
        const decodeBase64 = (str) =>
          Buffer.from(
            str.replace(/-/g, "+").replace(/_/g, "/"),
            "base64"
          ).toString("utf-8");

        const getBody = (payload) => {
          if (payload.body?.data) {
            return decodeBase64(payload.body.data);
          } else if (payload.parts?.length) {
            return payload.parts.map((part) => getBody(part)).join("\n");
          }
          return "";
        };

        const body = getBody(payload);
        const labels = email.data.labelIds || [];

        // 3. Upsert (insert or update if exists)
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

        // Upsert: If mailId exists, update; otherwise create new
        await Mail.findOneAndUpdate(
          { mailId: mailDoc.mailId },
          { $set: mailDoc },
          { upsert: true, new: true }
        );

        return mailDoc;
      });

      const emails = await Promise.all(emailPromises);
      return emails;
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
}

export default new GmailService();
