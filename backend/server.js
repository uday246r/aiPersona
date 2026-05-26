require("dotenv").config();

const express = require("express");

const cors = require("cors");

let chatRoute;
try {
  chatRoute = require("./routes/chatRoute");
} catch (error) {
  console.error("Error loading chatRoute:", error);
  process.exit(1);
}

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", chatRoute);

const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

if (process.env.DB_URI) {
  mongoose.connect(process.env.DB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));
} else {
  console.log("No DB_URI found in .env, skipping MongoDB connection.");
}

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});