const { GoogleGenAI } = require("@google/genai");

const askOpenAI = require("./openaiService");
const udayPersona = require("../prompts/udayPersona");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function askGemini(message) {
  const prompt = `
${udayPersona}

User:
${message}

Respond exactly like Uday.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response?.text?.trim();

    if (text) {
      return text;
    }

    throw new Error("Gemini returned an empty response");
  } catch (error) {
    console.log("Gemini Failed → Switching to OpenAI");
    console.log(error.message);

    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        `Gemini failed (${error.message}) and OpenAI fallback is not configured`
      );
    }

    try {
      return await askOpenAI(message);
    } catch (fallbackError) {
      throw new Error(
        `Gemini failed (${error.message}). OpenAI fallback also failed (${fallbackError.message}).`
      );
    }
  }
}

module.exports = askGemini;
