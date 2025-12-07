require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Correct LowDB imports
const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");

const { nanoid } = require("nanoid");

const app = express();
app.use(
  cors({
    origin: "*", // allow all origins - later restrict if needed
  })
);
app.use(express.json());

// LowDB Database File Path
const dbPath = path.join(__dirname, "data", "db.json");
const adapter = new JSONFile(dbPath);
const db = new Low(adapter);

async function initDB() {
  await db.read();
  db.data ||= {
    users: [],
    quizzes: [],
    questions: [],
    responses: []
  };
  await db.write();
  console.log("🔥 JSON Database loaded at", dbPath);
}
initDB();

// Attach DB and nanoid to routes
app.locals.db = db;
app.locals.nanoid = nanoid;

// Health check route (important for Render)
app.get("/", (req, res) => {
  res.json({
    status: "Backend Running",
    database: "JSON OK",
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
