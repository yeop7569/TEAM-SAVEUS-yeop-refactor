const { GoogleGenerativeAI } = require("@google/generative-ai");

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

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say OK");
      process.stdout.write("SUCCESS with: " + modelName + " => " + result.response.text() + "\n");
    } catch (e) {
      process.stdout.write("FAILED " + modelName + " | status: " + e.status + " | " + (e.message || "").substring(0, 80) + "\n");
    }
  }
}

test().then(() => process.stdout.write("DONE\n"));
