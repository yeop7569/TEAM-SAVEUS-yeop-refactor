import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // 메시지 길이 제한: 100자로 확장
  const MAX_MESSAGE_LENGTH = 100;

  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return res.status(200).json({
      response: `메시지 길이는 ${MAX_MESSAGE_LENGTH}자 이내로 보내주세요.`,
    });
  }

  if (!apiKey) {
    return res.status(500).json({ response: "API Key is missing" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-2.5-flash";

    const prompt = `You are an expert Security Auditor. Respond in Korean.
    User Question: ${message}`;

    const result = await ai.models.generateContent({ model, contents: prompt });
    const aiResponse = result.text || "추후 검토 후 다시 연락드리겠습니다.";

    res.status(200).json({ response: aiResponse });
  } catch (error: any) {
    console.error("Chat Error:", error);
    return res.status(500).json({
      response: "서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.",
      detail: error.message
    });
  }
}
