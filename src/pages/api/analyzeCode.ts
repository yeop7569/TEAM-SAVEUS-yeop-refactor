import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenAI } from "@google/genai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { code } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY is missing from environment" });
  }

  console.log("Analyzing Code Sample (Auto Detection):", code ? code.substring(0, 50) + "..." : "EMPTY");

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-2.5-flash";

    const prompt = `You are a strict Security Auditor. 
Analyze the code for critical vulnerabilities (OWASP, CWE).
Respond in KOREAN. 
Sections:
1. 주요 취약점:
2. 수정 제안:
3. 수정된 코드:

Analyze this:
\n\n${code}`;

    const result = await ai.models.generateContent({ model, contents: prompt });
    const responseText = result.text;

    if (!responseText) {
        throw new Error("AI returned empty response");
    }

    res.status(200).json({ result: responseText });
  } catch (error: any) {
    console.error("Gemini Analysis Failed Details:", error.message || error);
    
    // 에러 메시지에 모델명을 포함하여 구체적인 원인을 알려줍니다.
    res.status(500).json({
      error: "Gemini Analysis Failed",
      message: error.message,
      tip: "Please check if your API key has 'Generative Language API' enabled in Google AI Studio."
    });
  }
}
