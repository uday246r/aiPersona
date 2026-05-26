const express = require("express");

const router = express.Router();

const askGemini = require("../services/geminiService");
const generateAvatarVideo = require("../services/videoGeneration");
const Chat = require("../models/chatModel");

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !String(message).trim()) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    const aiReply = await askGemini(message);
    const { videoUrl, videoError } = await generateAvatarVideo(aiReply);

    try {
      const chatEntry = new Chat({
        userMessage: message,
        aiReply,
      });
      await chatEntry.save();
    } catch (dbError) {
      console.error("Error saving chat to database:", dbError.message);
    }

    res.json({
      success: true,
      reply: aiReply,
      videoUrl: videoUrl || null,
      videoError: videoError || null,
    });
  } catch (error) {
    console.error("Chat route error:", error.message);

    let userMessage = error.message || "Failed to generate AI response";

    if (userMessage.includes("RESOURCE_EXHAUSTED") || userMessage.includes("429")) {
      userMessage =
        "AI quota exceeded. Wait a minute and try again, or update your Gemini/OpenAI API keys in backend/.env.";
    }

    res.status(500).json({
      success: false,
      error: userMessage,
    });
  }
});

module.exports = router;
