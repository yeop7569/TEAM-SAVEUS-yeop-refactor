const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");

const apiKey = "AIzaSyCLZ083h3vXdIr50DFUoPApPTn-yM94LXQ";
const ai = new GoogleGenAI({ apiKey });

// 최신 안정 모델 순서로 시도
const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"];

async function testWithRetry() {
  fs.writeFileSync("final-test-result.txt", "", "utf8");
  for (const modelName of MODELS) {
    try {
      const result = await ai.models.generateContent({
        model: modelName,
        contents: "Say OK in Korean",
      });
      const msg = "SUCCESS with " + modelName + ": " + result.text;
      fs.appendFileSync("final-test-result.txt", msg + "\n", "utf8");
      console.log(msg);
      return;
    } catch (e) {
      const msg = "FAILED " + modelName + " | " + e.message.substring(0, 120);
      fs.appendFileSync("final-test-result.txt", msg + "\n", "utf8");
      console.log(msg);
    }
  }
}

testWithRetry();
