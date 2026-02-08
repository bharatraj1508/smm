import { GoogleGenAI, Type } from "@google/genai";
import {
  generateCategoryPrompt,
  generateSummaryPrompt,
} from "../utils/prompt.js";
import Mail from "../models/mail.js";

// Module-scoped configuration
const apk = process.env.GEMINI_API_KEY;
if (!apk && process.env.NODE_ENV === "production") {
  console.warn("GEMINI_API_KEY is not provided");
}
const ai = apk ? new GoogleGenAI({ apiKey: apk }) : null;
const model = "gemini-2.0-flash-lite";

// Internal helper function to check configuration
const checkConfig = () => {
  if (!ai) {
    throw new Error(
      "GenAIService not initialized: GEMINI_API_KEY is missing",
    );
  }
};

export const generateCategorizeContent = async (mail) => {
  try {
    checkConfig();
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
      mail.snippet,
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

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });
    let resultText = "";
    for await (const chunk of response) {
      resultText += chunk.text ?? "";
    }
    const resultJson = JSON.parse(resultText);
    await Mail.findByIdAndUpdate(mail._id, {
      $set: { category: resultJson },
    });
    return resultJson;
  } catch (error) {
    throw error;
  }
};

export const extractSummaryContentFromBody = async (body) => {
  try {
    const plainText = body
      .replace(/<style[^>]*>.*?<\/style>/gis, "")
      .replace(/<script[^>]*>.*?<\/script>/gis, "")
      .replace(/<a[^>]*>.*?<\/a>/gis, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();
    return plainText;
  } catch (error) {
    throw error;
  }
};

export const generateSummaryContent = async (body) => {
  try {
    checkConfig();
    const prompt = generateSummaryPrompt(body);

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
    const result = await ai.models.generateContentStream({
      model,
      contents,
    });

    return result;
  } catch (error) {
    throw error;
  }
};
