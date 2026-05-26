import { useState } from "react";

import axios from "axios";

function App() {

  const [message, setMessage] = useState("");

  const [reply, setReply] = useState("");

  const [videoUrl, setVideoUrl] = useState("");

  const [videoError, setVideoError] = useState("");

  const [requestError, setRequestError] = useState("");

  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {

    if (!message.trim()) return;

    try {

      setLoading(true);

      setReply("");

      setVideoUrl("");

      setVideoError("");

      setRequestError("");

      const response = await axios.post(
        "http://localhost:5000/api/chat",
        {
          message,
        }
      );

      if (!response.data?.success) {
        throw new Error(response.data?.error || "Request failed");
      }

      setReply(response.data.reply || "");

      setVideoUrl(response.data.videoUrl || "");

      setVideoError(response.data.videoError || "");

    } catch (error) {

      console.error(error);

      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Something went wrong. Make sure the backend is running on port 5000.";

      setRequestError(errorMessage);

    } finally {

      setLoading(false);
    }
  };

  return (

    <div style={styles.container}>

      {/* HEADER */}

      <div style={styles.header}>

        {/* PERSONA CIRCLE */}

        <div style={styles.avatar}>
          U
        </div>

        <div>

          <h1 style={styles.title}>
            AI Uday
          </h1>

          <p style={styles.subtitle}>
            Gemini + HeyGen AI Persona
          </p>

        </div>

      </div>

      {/* CHAT BOX */}

      <div style={styles.chatBox}>

        <textarea
          placeholder="Ask AI Uday anything..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          style={styles.textarea}
        />

        <button
          style={styles.button}
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "Generating..." : "Ask AI Uday"}
        </button>

      </div>

      {/* REQUEST ERROR */}

      {
        requestError && (
          <div style={styles.errorBox}>
            <h2 style={styles.errorTitle}>
              Request Failed
            </h2>
            <p style={styles.errorText}>
              {requestError}
            </p>
          </div>
        )
      }

      {/* RESPONSE */}

      {
        reply && (
          <div style={styles.replyBox}>

            <h2 style={styles.sectionTitle}>
              AI Reply
            </h2>

            <p style={styles.reply}>
              {reply}
            </p>

          </div>
        )
      }

      {/* VIDEO WARNING */}

      {
        videoError && (
          <div style={styles.warningBox}>
            <h2 style={styles.warningTitle}>
              Avatar Video Unavailable
            </h2>
            <p style={styles.warningText}>
              {videoError}
            </p>
            <p style={styles.warningHint}>
              The AI reply above still works. Add HeyGen API credits to enable avatar videos.
            </p>
          </div>
        )
      }

      {/* VIDEO */}

      {
        videoUrl && (
          <div style={styles.videoSection}>

            <h2 style={styles.sectionTitle}>
              AI Uday Avatar
            </h2>

            <video
              src={videoUrl}
              controls
              autoPlay
              style={styles.video}
            />

          </div>
        )
      }

    </div>
  );
}

const styles = {

  container: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    padding: "40px",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "40px",
  },

  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#2563eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "36px",
    fontWeight: "bold",
  },

  title: {
    fontSize: "36px",
    marginBottom: "5px",
  },

  subtitle: {
    color: "#94a3b8",
  },

  chatBox: {
    background: "#1e293b",
    padding: "25px",
    borderRadius: "16px",
    marginBottom: "30px",
  },

  textarea: {
    width: "100%",
    height: "120px",
    borderRadius: "10px",
    border: "none",
    padding: "15px",
    fontSize: "16px",
    resize: "none",
    marginBottom: "20px",
    outline: "none",
  },

  button: {
    background: "#2563eb",
    border: "none",
    padding: "14px 24px",
    borderRadius: "10px",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  replyBox: {
    background: "#1e293b",
    padding: "25px",
    borderRadius: "16px",
    marginBottom: "30px",
  },

  sectionTitle: {
    marginBottom: "15px",
    color: "#60a5fa",
  },

  reply: {
    lineHeight: "1.8",
    color: "#e2e8f0",
  },

  warningBox: {
    background: "#422006",
    border: "1px solid #f59e0b",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "30px",
  },

  warningTitle: {
    marginBottom: "10px",
    color: "#fbbf24",
  },

  warningText: {
    color: "#fde68a",
    marginBottom: "10px",
    lineHeight: "1.6",
  },

  warningHint: {
    color: "#fcd34d",
    fontSize: "14px",
  },

  errorBox: {
    background: "#450a0a",
    border: "1px solid #ef4444",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "30px",
  },

  errorTitle: {
    marginBottom: "10px",
    color: "#fca5a5",
  },

  errorText: {
    color: "#fecaca",
    lineHeight: "1.6",
  },

  videoSection: {
    background: "#1e293b",
    padding: "25px",
    borderRadius: "16px",
  },

  video: {
    width: "100%",
    borderRadius: "12px",
  },
};

export default App;
