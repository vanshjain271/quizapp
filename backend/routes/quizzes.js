const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { authenticate } = require('../middleware/auth');

// Validation schema
const quizSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  time_per_question: Joi.number().integer().min(5).default(30),
});

// Helper: Promisify sqlite3
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
      else resolve(rows);
    });
  });
}

function runAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this); // this.lastID, this.changes
    });
  });
}

// Create a quiz (teachers and students)
router.post('/', authenticate, async (req, res) => {
  const db = req.app.locals.db;

  const { error } = quizSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { title, description, time_per_question } = req.body;
  const created_by = req.user.id;

  try {
    const info = await runAsync(
      db,
      'INSERT INTO quizzes (title, description, time_per_question, created_by) VALUES (?, ?, ?, ?)',
      [title, description, time_per_question, created_by]
    );

    const quiz = await getAsync(
      db,
      'SELECT * FROM quizzes WHERE id = ?',
      [info.lastID]
    );

    res.json(quiz);
  } catch (err) {
    console.error('Create quiz error:', err);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// Get all quizzes (only those created by teachers)
router.get('/', async (req, res) => {
  const db = req.app.locals.db;
  try {
    const quizzes = await allAsync(
      db,
      'SELECT q.* FROM quizzes q JOIN users u ON q.created_by = u.id WHERE u.role = ?',
      ['teacher']
    );
    res.json(quizzes);
  } catch (err) {
    console.error('Get quizzes error:', err);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// Get quizzes created by the logged-in user
router.get('/my', authenticate, async (req, res) => {
  const db = req.app.locals.db;
  const user_id = req.user.id;

  try {
    const quizzes = await allAsync(
      db,
      'SELECT * FROM quizzes WHERE created_by = ?',
      [user_id]
    );
    res.json(quizzes);
  } catch (err) {
    console.error('Get my quizzes error:', err);
    res.status(500).json({ error: 'Failed to fetch your quizzes' });
  }
});

// Delete a quiz (only quiz creator can delete)
router.delete('/:quiz_id', authenticate, async (req, res) => {
  const db = req.app.locals.db;
  const { quiz_id } = req.params;
  const user_id = req.user.id;

  try {
    const quiz = await getAsync(
      db,
      'SELECT * FROM quizzes WHERE id = ?',
      [quiz_id]
    );

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    if (quiz.created_by !== user_id) {
      return res
        .status(403)
        .json({ error: 'Only the quiz creator can delete the quiz' });
    }

    // Delete questions
    await runAsync(
      db,
      'DELETE FROM questions WHERE quiz_id = ?',
      [quiz_id]
    );

    // Delete responses
    await runAsync(
      db,
      'DELETE FROM responses WHERE quiz_id = ?',
      [quiz_id]
    );

    // Delete quiz
    await runAsync(
      db,
      'DELETE FROM quizzes WHERE id = ?',
      [quiz_id]
    );

    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    console.error('Error in delete quiz endpoint:', err);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

module.exports = router;
