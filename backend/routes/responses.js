const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { authenticate, requireTeacher } = require("../middleware/auth");

// Validation schema
const responseSchema = Joi.object({
  quiz_id: Joi.string().required(),
  answers: Joi.array().items(Joi.number().integer()).required(),
});

// Submit quiz response
router.post("/", authenticate, async (req, res) => {
  const db = req.app.locals.db;
  const nanoid = req.app.locals.nanoid;

  const { error } = responseSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { quiz_id, answers } = req.body;
  const user_id = req.user.id;

  try {
    const response = {
      id: nanoid(),
      quiz_id,
      user_id,
      answers,
      submitted_at: new Date().toISOString()
    };

    db.data.responses.push(response);
    await db.write();

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
    const responses = db.data.responses.filter(r => r.quiz_id === quiz_id && r.user_id === req.user.id);
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
    const responses = db.data.responses.filter(r => r.quiz_id === quiz_id);

    const questions = db.data.questions.filter(q => q.quiz_id === quiz_id);

    const results = [];
    for (const r of responses) {
      const user = db.data.users.find(u => u.id === r.user_id);

      const answers = r.answers;
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
    const quiz = db.data.quizzes.find(q => q.id === quiz_id);

    if (!quiz || quiz.created_by !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Only the quiz creator can view results" });
    }

    const responses = db.data.responses.filter(r => r.quiz_id === quiz_id);

    const questions = db.data.questions.filter(q => q.quiz_id === quiz_id);

    const results = [];
    for (const r of responses) {
      const user = db.data.users.find(u => u.id === r.user_id);

      const answers = r.answers;
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
