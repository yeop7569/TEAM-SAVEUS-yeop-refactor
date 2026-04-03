const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const apiKey = "AIzaSyCLZ083h3vXdIr50DFUoPApPTn-yM94LXQ";
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
  // gemini-2.0-flash만 테스트 (가장 최신)
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Say OK");
    const line = "SUCCESS: " + result.response.text().trim();
    fs.appendFileSync("result2.txt", line + "\n", "utf8");
  } catch (e) {
    // 에러 전체 저장
    const errObj = {
      status: e.status,
      statusText: e.statusText,
      message: e.message,
      errorDetails: e.errorDetails,
    };
    fs.appendFileSync("result2.txt", "ERROR:\n" + JSON.stringify(errObj, null, 2) + "\n", "utf8");
  }
}

test().then(() => console.log("done"));
