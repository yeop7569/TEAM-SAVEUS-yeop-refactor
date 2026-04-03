const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY not found in process.env");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro"];
  for (const m of models) {
    try {
      console.log(`Trying model: ${m}...`);
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("Say 'OK'");
      if (result.response.text()) {
        console.log(`Model ${m} is WORKING! Response: ${result.response.text()}`);
      }
    } catch (e) {
      console.log(`Model ${m} FAILED: ${e.message}`);
    }
  }
}

listModels();
