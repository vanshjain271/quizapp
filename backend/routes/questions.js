const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { authenticate } = require("../middleware/auth");

// Validation schema
const questionSchema = Joi.object({
  quiz_id: Joi.number().required(),
  question_text: Joi.string().required(),
  options: Joi.array().items(Joi.string()).min(2).required(),
  correct_option: Joi.number().integer().min(0).required(),
});

// Helper functions
function runAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function getAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function allAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []); // force array
    });
  });
}

// Add question
router.post("/", authenticate, async (req, res) => {
  const db = req.app.locals.db;

  const { error } = questionSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { quiz_id, question_text, options, correct_option } = req.body;

  try {
    const info = await runAsync(
      db,
      "INSERT INTO questions (quiz_id, question_text, options, correct_option) VALUES (?, ?, ?, ?)",
      [quiz_id, question_text, JSON.stringify(options), correct_option]
    );

    const question = await getAsync(
      db,
      "SELECT * FROM questions WHERE id = ?",
      [info.lastID]
    );

    question.options = JSON.parse(question.options);

    res.json(question);
  } catch (err) {
    console.error("Add question error:", err);
    res.status(500).json({ error: "Failed to add question" });
  }
});

// Delete question
router.delete("/:question_id", authenticate, async (req, res) => {
  const db = req.app.locals.db;
  const { question_id } = req.params;
  const user_id = req.user.id;

  try {
    const question = await getAsync(
      db,
      "SELECT * FROM questions WHERE id = ?",
      [question_id]
    );

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const quiz = await getAsync(
      db,
      "SELECT * FROM quizzes WHERE id = ?",
      [question.quiz_id]
    );

    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    if (quiz.created_by !== user_id) {
      return res
        .status(403)
        .json({ error: "Only quiz creator can delete questions" });
    }

    await runAsync(db, "DELETE FROM questions WHERE id = ?", [question_id]);

    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error("Delete question error:", err);
    res.status(500).json({ error: "Failed to delete question" });
  }
});

// Get questions for a quiz
router.get("/:quiz_id", async (req, res) => {
  const db = req.app.locals.db;
  const { quiz_id } = req.params;

  try {
    let questions = await allAsync(
      db,
      "SELECT * FROM questions WHERE quiz_id = ?",
      [quiz_id]
    );

    // Always ensure array & parse JSON safely
    questions = (Array.isArray(questions) ? questions : []).map(q => {
      try {
        q.options = JSON.parse(q.options);
      } catch {
        q.options = [];
      }
      return q;
    });

    const quiz = await getAsync(
      db,
      "SELECT id, title, description, time_per_question FROM quizzes WHERE id = ?",
      [quiz_id]
    );

    res.json({ quiz, questions });
  } catch (err) {
    console.error("Fetch quiz questions error:", err);
    res.status(500).json({ error: "Failed to fetch quiz questions" });
  }
});

module.exports = router;
