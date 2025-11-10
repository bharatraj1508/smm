import { StatusCode } from "status-code-enum";
import gmailService from "../services/gmailService.js";
import genAIService from "../services/genAIService.js";

class GmailController {
  async getLabels(req, res) {
    try {
      const user = req.user;
      const labels = await gmailService.listLabels(user);

      res.status(200).json({
        success: true,
        data: labels,
        count: labels.length,
        message:
          labels.length > 0
            ? "Labels retrieved successfully"
            : "No labels found",
      });
    } catch (error) {
      console.error("Error in getLabels controller:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Failed to retrieve labels",
      });
    }
  }

  async getLabelById(req, res) {
    try {
      const { labelId } = req.params;
      const user = req.user;

      if (!labelId) {
        return res.status(400).json({
          success: false,
          error: "Label ID is required",
          message: "Please provide a valid label ID",
        });
      }

      const label = await gmailService.getLabel(user, labelId);

      res.status(200).json({
        success: true,
        data: label,
        message: "Label retrieved successfully",
      });
    } catch (error) {
      console.error("Error in getLabelById controller:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Failed to retrieve label",
      });
    }
  }

  async healthCheck(req, res) {
    res.status(200).json({
      success: true,
      message: "Gmail API service is running",
      timestamp: new Date().toISOString(),
    });
  }

  async testEndpoint(req, res) {
    res.status(200).json({
      success: true,
      message: "Test endpoint working",
      data: {
        server: "Express",
        cors: "Enabled",
        timestamp: new Date().toISOString(),
      },
    });
  }

  async getEmails(req, res) {
    try {
      const user = req.user;
      const { maxResults = 10, page = 1 } = req.query;

      const { mails, count } = await gmailService.getEmails(
        user,
        parseInt(maxResults),
        parseInt(page)
      );

      res.status(200).json({
        success: true,
        data: mails,
        count,
        page: parseInt(page),
        message:
          count > 0 ? "Emails retrieved successfully" : "No emails found",
      });
    } catch (error) {
      console.error("Error in getEmails controller:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Failed to retrieve emails",
      });
    }
  }

  async getEmailById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "ID is required",
          message: "Please provide a valid ID",
        });
      }

      const email = await gmailService.getEmailById(id);
      if (!email) {
        return res.status(StatusCode.ClientErrorNotFound).json({
          success: false,
          message: "Mail not found",
        });
      }
      await genAIService.generateCategorizeContent(email);

      const mailWithCategory = await gmailService.getEmailById(id);
      res.status(200).json({
        success: true,
        data: mailWithCategory,
        message: "Email retrieved successfully",
      });
    } catch (error) {
      console.error("Error in getEmailById controller:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Failed to retrieve email",
      });
    }
  }

  async getEmailSyncCount(req, res) {
    try {
      const user = req.user;
      const { count, latestSyncedAt } = await gmailService.getEmailSyncCount(
        user._id
      );
      res.status(StatusCode.SuccessOK).send({ count, latestSyncedAt });
    } catch (error) {
      console.error("Error in getEmailById controller:", error);
      res.status(StatusCode.ServerErrorInternal).json({
        success: false,
        error: error.message,
        message: "Failed to retrieve email",
      });
    }
  }

  async syncMails(req, res) {
    try {
      const user = req.user;
      const { maxResults = 10 } = req.body;

      const emails = await gmailService.fetchNewEmails(
        user,
        parseInt(maxResults)
      );

      res.status(200).json({
        success: true,
        count: emails.length,
        message:
          emails.length > 0
            ? "Emails retrieved successfully"
            : "No emails found",
      });
    } catch (error) {
      console.error("Error in getEmailById controller:", error);
      res.status(StatusCode.ServerErrorInternal).json({
        success: false,
        error: error.message,
        message: "Failed to retrieve email",
      });
    }
  }
}

export default new GmailController();
