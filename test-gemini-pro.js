const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const apiKey = "AIzaSyCLZ083h3vXdIr50DFUoPApPTn-yM94LXQ";
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    console.log(`Trying model: gemini-pro...`);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Say 'OK'");
    console.log(`SUCCESS! Response: ${result.response.text()}`);
  } catch (e) {
    console.log(`FAILED: ${e.message}`);
  }
}

listModels();
