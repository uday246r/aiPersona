const createAvatarVideo = require("./heygenService");
const checkVideo = require("./checkVideoStatus");

const POLL_INTERVAL_MS = 5000;
const MAX_POLL_ATTEMPTS = 36;

function getVideoFailureMessage(videoData) {
  return (
    videoData?.error?.message ||
    videoData?.error?.detail ||
    "Video generation failed"
  );
}

async function waitForVideo(videoId) {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    const videoData = await checkVideo(videoId);

    if (videoData.status === "completed") {
      return {
        videoUrl: videoData.video_url,
      };
    }

    if (videoData.status === "failed") {
      return {
        videoError: getVideoFailureMessage(videoData),
      };
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  return {
    videoError: "Video generation timed out. Please try again.",
  };
}

async function generateAvatarVideo(script) {
  try {
    const videoId = await createAvatarVideo(script);
    return await waitForVideo(videoId);
  } catch (error) {
    const apiMessage =
      error.response?.data?.error?.message ||
      error.response?.data?.message;

    return {
      videoError: apiMessage || error.message || "Video generation failed",
    };
  }
}

module.exports = generateAvatarVideo;
