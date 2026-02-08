import { StatusCode } from "status-code-enum";
import { getEmailById } from "../services/gmailService.js";
import {
  generateCategorizeContent,
  extractSummaryContentFromBody,
  generateSummaryContent,
} from "../services/genAIService.js";

export const categorizeEmail = async (req, res) => {
  try {
    const { emailId } = req.params;
    if (!emailId) {
      res
        .status(StatusCode.ClientErrorBadRequest)
        .json({ message: "Mail id is required." });
    }
    const mail = await getEmailById(emailId);
    if (!mail) {
      res
        .status(StatusCode.ClientErrorNotFound)
        .json({ message: "Unable to find the mail." });
    }
    let category;
    if (!mail.category) {
      category = await generateCategorizeContent(mail);
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
};

export const generateMailSummary = async (req, res) => {
  try {
    const { emailId } = req.params;
    if (!emailId) {
      return res
        .status(StatusCode.ClientErrorBadRequest)
        .json({ message: "Mail id is required." });
    }
    const mail = await getEmailById(emailId);
    if (!mail) {
      return res
        .status(StatusCode.ClientErrorNotFound)
        .json({ message: "Unable to find the mail." });
    }
    const body = await extractSummaryContentFromBody(mail.body);
    const stream = await generateSummaryContent(body);

    res.setHeader("Content-Type", "text/plain; charset=utf-8");

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        res.write(text);
      }
    }
    res.end();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      return res.status(StatusCode.ServerErrorInternal).json({
        success: false,
        error: error.message,
        message: "Failed to generate mail summary",
      });
    }
    res.end();
  }
};
