const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testGemini() {
    console.log("Testing Google AI API connection...");

    const key = process.env.REACT_APP_GOOGLE_AI_KEY;
    if (!key) {
        console.error("Error: REACT_APP_GOOGLE_AI_KEY not found in environment.");
        return;
    }
    console.log(`Using API Key: ${key.substring(0, 5)}...`);

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Hello, are you working?";
        console.log(`Sending prompt: "${prompt}"`);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Success! Response received:");
        console.log(text);
    } catch (error) {
        console.error("API Test Failed!");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        if (error.response) {
            console.error("Response Status:", error.response.status);
            console.error("Response Body:", JSON.stringify(error.response, null, 2));
        }
    }
}

testGemini();
