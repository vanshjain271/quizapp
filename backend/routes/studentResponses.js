const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");

// Promisified sqlite helpers
function allAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
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

// Get logged-in user's quiz results & scores
router.get("/mine", authenticate, async (req, res) => {
  const db = req.app.locals.db;
  const user_id = req.user.id;

  try {
    const responses = await allAsync(
      db,
      "SELECT * FROM responses WHERE user_id = ? ORDER BY submitted_at DESC",
      [user_id]
    );

    const results = [];
    for (const r of responses) {
      const quiz = await getAsync(
        db,
        "SELECT title FROM quizzes WHERE id = ?",
        [r.quiz_id]
      );

      const questions = await allAsync(
        db,
        "SELECT * FROM questions WHERE quiz_id = ?",
        [r.quiz_id]
      );

      let score = 0;
      const answers = JSON.parse(r.answers);

      answers.forEach((a, index) => {
        if (questions[index] && a === questions[index].correct_option) {
          score++;
        }
      });

      results.push({
        quiz_id: r.quiz_id,
        quiz_title: quiz ? quiz.title : "Unknown Quiz",
        score,
        total_questions: questions.length,
        submitted_at: r.submitted_at,
      });
    }

    res.json(results);
  } catch (err) {
    console.error("Fetch student results error:", err);
    res.status(500).json({ error: "Failed to fetch responses" });
  }
});

module.exports = router;
