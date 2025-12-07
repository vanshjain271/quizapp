require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Low, JSONFile } = require("lowdb");
const { nanoid } = require("nanoid");
const path = require("path");

const app = express();
app.use(
  cors({
    origin: "*", // allow all origins - later restrict if needed
  })
);
app.use(express.json());

const dbFile = new JSONFile(path.join(__dirname, "data", "db.json"));
const db = new Low(dbFile);

async function initDB() {
  await db.read();
  db.data ||= {
    users: [],
    quizzes: [],
    questions: [],
    responses: []
  };
  await db.write();
  console.log("🔥 JSON Database loaded");
}
initDB();

app.locals.db = db;
app.locals.nanoid = nanoid;

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
