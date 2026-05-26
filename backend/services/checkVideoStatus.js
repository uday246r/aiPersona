const axios = require("axios");

async function checkVideo(videoId) {
  const response = await axios.get(
    `https://api.heygen.com/v1/video_status.get?video_id=${videoId}`,
    {
      headers: {
        "X-Api-Key": process.env.HEYGEN_API_KEY,
      },
    }
  );

  const data = response.data?.data;

  if (!data) {
    throw new Error("HeyGen returned an invalid video status response");
  }

  return data;
}

module.exports = checkVideo;
