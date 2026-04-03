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
  const userToken = req.cookies.user_token;

  if (!userToken) {
    return res.status(401).json({ error: "Unauthorized. 로그인이 필요합니다." });
  }

  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY is missing from environment" });
  }


  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-2.5-flash";

    const prompt = `분석할 코드:\n\n${code}`;

    const result = await ai.models.generateContent({ 
      model, 
      contents: prompt,
      config: {
        systemInstruction: "You are a strict Security Auditor. Analyzes code for critical vulnerabilities (OWASP, CWE). Respond in KOREAN. Explanation should be concise, but you MUST provide the full '3. 수정된 코드:' (Modified Code) block unconditionally.",
        temperature: 0.3,
      }
    });
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
