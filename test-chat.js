const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testChat() {
  const apiKey = "AIzaSyCLZ083h3vXdIr50DFUoPApPTn-yM94LXQ";
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });
    const result = await model.generateContent("Hello");
    console.log("Chat Success:", result.response.text());
  } catch (e) {
    console.log("Chat Error:", e.message);
  }
}

testChat();
