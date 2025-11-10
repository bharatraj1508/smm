import { StatusCode } from "status-code-enum";
import gmailService from "../services/gmailService.js";
import geniAIService from "../services/genAIService.js";

class GenAIController {
  async categorizeEmail(req, res) {
    try {
      const { emailId } = req.params;
      if (!emailId) {
        res
          .status(StatusCode.ClientErrorBadRequest)
          .json({ message: "Mail id is required." });
      }
      const mail = await gmailService.getEmailById(emailId);
      if (!mail) {
        res
          .status(StatusCode.ClientErrorNotFound)
          .json({ message: "Unable to find the mail." });
      }
      let category;
      if (!mail.category) {
        category = await geniAIService.generateCategorizeContent(mail);
      } else if (mail.category) {
        category = mail.category;
      }
      return res.status(StatusCode.SuccessOK).send(category);
    } catch (error) {
      res.status(StatusCode.ServerErrorInternal).json({
        success: false,
        error: error.message,
        message: "Failed to categorize email",
      });
    }
  }
}

export default new GenAIController();
