import { GoogleGenAI, Type } from "@google/genai";
import { generateCategoryPrompt } from "../utils/prompt.js";

class GenAIService {
  constructor() {
    const apk = process.env.GEMINI_API_KEY;
    if (!apk) {
      throw new Error("API key is not provided");
    }
    this.ai = new GoogleGenAI({ apiKey: apk });
    this.model = "gemini-2.0-flash-lite";
  }

  async generateCategorizeContent(mail) {
    try {
      const config = {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["type", "reason"],
          properties: {
            type: {
              type: Type.STRING,
              description:
                "Type of the mail. MUST be one of the provided five categories",
              enum: [
                "newsletter",
                "job_alert",
                "personal",
                "transactional",
                "promotional",
              ],
            },
            reason: {
              type: Type.STRING,
              description:
                "Short, concise explanation (5-10 words) for why this category was chosen",
            },
          },
        },
      };

      const prompt = generateCategoryPrompt(
        mail.subject,
        mail.from,
        mail.snippet
      );
      const contents = [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ];

      const response = await this.ai.models.generateContentStream({
        model: this.model,
        config,
        contents,
      });
      let resultText = "";
      for await (const chunk of response) {
        resultText += chunk.text ?? "";
      }
      const resultJson = JSON.parse(resultText);
      return resultJson;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new GenAIService();
