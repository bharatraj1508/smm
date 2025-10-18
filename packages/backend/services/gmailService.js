import authService from "./authService.js";

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

  // New method to get user's emails
  async getEmails(user, query = "", maxResults = 10) {
    try {
      const gmail = await this.authenticate(user);

      const result = await gmail.users.messages.list({
        userId: "me",
        q: query,
        maxResults: maxResults,
      });

      const messages = result.data.messages || [];

      // Get full message details for each message
      const emailPromises = messages.map(async (message) => {
        const email = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
          format: "full",
        });
        return email.data;
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
}

export default new GmailService();
