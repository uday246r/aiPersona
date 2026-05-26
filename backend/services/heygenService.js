const axios = require("axios");

const MAX_SCRIPT_LENGTH = 1500;

function truncateScript(script) {
  const text = String(script || "").trim();
  if (text.length <= MAX_SCRIPT_LENGTH) {
    return text;
  }

  return `${text.slice(0, MAX_SCRIPT_LENGTH - 3)}...`;
}

async function createAvatarVideo(script) {
  const inputText = truncateScript(script);

  if (!inputText) {
    throw new Error("Video script is empty");
  }

  if (!process.env.HEYGEN_API_KEY) {
    throw new Error("HEYGEN_API_KEY is not configured");
  }

  if (!process.env.HEYGEN_AVATAR_ID || !process.env.HEYGEN_VOICE_ID) {
    throw new Error("HeyGen avatar or voice ID is not configured");
  }

  const response = await axios.post(
    "https://api.heygen.com/v2/video/generate",
    {
      video_inputs: [
        {
          character: {
            type: "avatar",
            avatar_id: process.env.HEYGEN_AVATAR_ID,
          },
          voice: {
            type: "text",
            input_text: inputText,
            voice_id: process.env.HEYGEN_VOICE_ID,
          },
          background: {
            type: "color",
            value: "#f6f6f6",
          },
        },
      ],
      dimension: {
        width: 1280,
        height: 720,
      },
    },
    {
      headers: {
        "X-Api-Key": process.env.HEYGEN_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  const videoId = response.data?.data?.video_id;

  if (!videoId) {
    throw new Error("HeyGen did not return a video ID");
  }

  return videoId;
}

module.exports = createAvatarVideo;
