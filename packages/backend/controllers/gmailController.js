import gmailService from "../services/gmailService.js";

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
      const { query = "", maxResults = 10 } = req.query;

      const emails = await gmailService.getEmails(
        user,
        query,
        parseInt(maxResults),
      );

      res.status(200).json({
        success: true,
        data: emails,
        count: emails.length,
        message:
          emails.length > 0
            ? "Emails retrieved successfully"
            : "No emails found",
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
      const { emailId } = req.params;
      const user = req.user;

      if (!emailId) {
        return res.status(400).json({
          success: false,
          error: "Email ID is required",
          message: "Please provide a valid email ID",
        });
      }

      const email = await gmailService.getEmailById(user, emailId);

      res.status(200).json({
        success: true,
        data: email,
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
}

export default new GmailController();
