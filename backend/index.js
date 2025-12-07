require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Correct LowDB imports for v7+
const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");
const { nanoid } = require("nanoid");

const app = express();

// CORS
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// Database file location
const dbPath = path.join(__dirname, "data", "db.json");
const adapter = new JSONFile(dbPath);

// Create LowDB with default structure (Fix for Render crash)
const db = new Low(adapter, {
  users: [],
  quizzes: [],
  questions: [],
  responses: []
});

async function initDB() {
  await db.read();   // Read existing file (if exists)
  await db.write();  // Ensures db.json exists when deploying
  console.log("🔥 JSON Database loaded:", dbPath);
}
initDB();

// Make DB + ID generator available to routes
app.locals.db = db;
app.locals.nanoid = nanoid;

// Health check route
app.get("/", (req, res) => {
  res.json({
    status: "Backend Running",
    database: "JSON OK",
  });
});

// Import Routes
const authRoutes = require("./routes/auth");
const quizzesRoutes = require("./routes/quizzes");
const questionsRoutes = require("./routes/questions");
const studentResponsesRoutes = require("./routes/studentResponses");
const responsesRoutes = require("./routes/responses");

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizzesRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/studentResponses", studentResponsesRoutes);
app.use("/api/responses", responsesRoutes);

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
