const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const apiKey = "AIzaSyCLZ083h3vXdIr50DFUoPApPTn-yM94LXQ";
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
  const models = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
  ];

  const lines = [];

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say OK");
      lines.push("SUCCESS: " + modelName + " => " + result.response.text().trim());
    } catch (e) {
      lines.push("FAILED: " + modelName + " | status=" + e.status + " | " + String(e.message).substring(0, 100));
    }
  }

  fs.writeFileSync("model-test-result.txt", lines.join("\n") + "\n", "utf8");
  console.log("Done! Check model-test-result.txt");
}

test();
