require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
app.use(
  cors({
    origin: "*", // allow all origins - later restrict if needed
  })
);
app.use(express.json());

// Detect DB path based on deployment environment
let dbPath;

// If Railway/Render path exists, use persistent volume path
const persistentPath = "/app/backend/data/quiz.db";

if (process.env.RAILWAY_ENVIRONMENT || process.env.RENDER) {
  dbPath = persistentPath;
  console.log("⚡ Using persistent volume DB:", dbPath);
} else {
  // Local development path
  dbPath = path.join(__dirname, "data", "quiz.db");
  console.log("🛑 Using local DB:", dbPath);
}

// Create / connect SQLite DB
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ DB connection error:", err);
  } else {
    console.log("✅ SQLite database connected at", dbPath);
  }
});

// Initialize tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      time_per_question INTEGER DEFAULT 30,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER,
      question_text TEXT NOT NULL,
      options TEXT NOT NULL,
      correct_option INTEGER NOT NULL,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER,
      user_id INTEGER,
      answers TEXT NOT NULL,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
});

// Attach db to routes
app.locals.db = db;

// Health check (important for Railway / Render)
app.get("/", (req, res) => {
  res.json({
    status: "Backend Running",
    database: "SQLite OK",
  });
});

// Routes
const authRoutes = require("./routes/auth");
const quizzesRoutes = require("./routes/quizzes");
const questionsRoutes = require("./routes/questions");
const studentResponsesRoutes = require("./routes/studentResponses");
const responsesRoutes = require("./routes/responses");

app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizzesRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/studentResponses", studentResponsesRoutes);
app.use("/api/responses", responsesRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
