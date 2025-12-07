const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { authenticate, requireTeacher } = require("../middleware/auth");

// Validation schema
const responseSchema = Joi.object({
  quiz_id: Joi.number().required(),
  answers: Joi.array().items(Joi.number().integer()).required(),
});

// Helpers
function runAsync(db, sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.run(...params);
}

function getAsync(db, sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.get(...params);
}

function allAsync(db, sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.all(...params);
}

// Submit quiz response
router.post("/", authenticate, async (req, res) => {
  const db = req.app.locals.db;

  const { error } = responseSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { quiz_id, answers } = req.body;
  const user_id = req.user.id;

  try {
    const info = await runAsync(
      db,
      "INSERT INTO responses (quiz_id, user_id, answers) VALUES (?, ?, ?)",
      [quiz_id, user_id, JSON.stringify(answers)]
    );

    const response = await getAsync(
      db,
      "SELECT * FROM responses WHERE id = ?",
      [info.lastID]
    );

    response.answers = JSON.parse(response.answers);

    res.json(response);
  } catch (err) {
    console.error("Submit response error:", err);
    res.status(500).json({ error: "Failed to submit response" });
  }
});

// Get user's own responses for a quiz
router.get("/:quiz_id", authenticate, async (req, res) => {
  const db = req.app.locals.db;
  const { quiz_id } = req.params;

  try {
    const responses = await allAsync(
      db,
      "SELECT * FROM responses WHERE quiz_id = ? AND user_id = ?",
      [quiz_id, req.user.id]
    );

    responses.forEach((r) => (r.answers = JSON.parse(r.answers)));
    res.json(responses);
  } catch (err) {
    console.error("Get user responses error:", err);
    res.status(500).json({ error: "Failed to fetch responses" });
  }
});

// Get all responses for a quiz (teachers only)
router.get("/all/:quiz_id", authenticate, requireTeacher, async (req, res) => {
  const db = req.app.locals.db;
  const { quiz_id } = req.params;

  try {
    const responses = await allAsync(
      db,
      "SELECT * FROM responses WHERE quiz_id = ?",
      [quiz_id]
    );

    const questions = await allAsync(
      db,
      "SELECT * FROM questions WHERE quiz_id = ?",
      [quiz_id]
    );

    const results = [];
    for (const r of responses) {
      const user = await getAsync(
        db,
        "SELECT email FROM users WHERE id = ?",
        [r.user_id]
      );

      const answers = JSON.parse(r.answers);
      let score = 0;
      for (let i = 0; i < Math.min(answers.length, questions.length); i++) {
        if (questions[i] && answers[i] === questions[i].correct_option) {
          score++;
        }
      }

      results.push({
        email: user ? user.email : "Unknown",
        score,
        total_questions: questions.length,
        submitted_at: r.submitted_at,
      });
    }
    res.json(results);
  } catch (err) {
    console.error("Get all responses error:", err);
    res.status(500).json({ error: "Failed to fetch responses" });
  }
});

// Get results for quiz creator (teacher or student who owns quiz)
router.get("/creator/:quiz_id", authenticate, async (req, res) => {
  const db = req.app.locals.db;
  const { quiz_id } = req.params;

  try {
    const quiz = await getAsync(
      db,
      "SELECT * FROM quizzes WHERE id = ?",
      [quiz_id]
    );

    if (!quiz || quiz.created_by !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Only the quiz creator can view results" });
    }

    const responses = await allAsync(
      db,
      "SELECT * FROM responses WHERE quiz_id = ?",
      [quiz_id]
    );

    const questions = await allAsync(
      db,
      "SELECT * FROM questions WHERE quiz_id = ?",
      [quiz_id]
    );

    const results = [];
    for (const r of responses) {
      const user = await getAsync(
        db,
        "SELECT email FROM users WHERE id = ?",
        [r.user_id]
      );

      const answers = JSON.parse(r.answers);
      let score = 0;

      for (let i = 0; i < Math.min(answers.length, questions.length); i++) {
        if (questions[i] && answers[i] === questions[i].correct_option) {
          score++;
        }
      }

      results.push({
        email: user ? user.email : "Unknown",
        score,
        total_questions: questions.length,
        submitted_at: r.submitted_at,
      });
    }

    res.json(results);
  } catch (err) {
    console.error("Creator results error:", err);
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

module.exports = router;
