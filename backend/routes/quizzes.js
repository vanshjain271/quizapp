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

// Create a quiz (teachers and students)
router.post('/', authenticate, async (req, res) => {
  const db = req.app.locals.db;
  const nanoid = req.app.locals.nanoid;

  const { error } = quizSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { title, description, time_per_question } = req.body;
  const created_by = req.user.id;

  try {
    const quiz = {
      id: nanoid(),
      title,
      description,
      time_per_question,
      created_by,
      created_at: new Date().toISOString()
    };

    db.data.quizzes.push(quiz);
    await db.write();

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
    const quizzes = db.data.quizzes.filter(q => {
      const user = db.data.users.find(u => u.id === q.created_by);
      return user && user.role === 'teacher';
    });
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
    const quizzes = db.data.quizzes.filter(q => q.created_by === user_id);
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
    const quizIndex = db.data.quizzes.findIndex(q => q.id === quiz_id);

    if (quizIndex === -1) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const quiz = db.data.quizzes[quizIndex];

    if (quiz.created_by !== user_id) {
      return res
        .status(403)
        .json({ error: 'Only the quiz creator can delete the quiz' });
    }

    // Delete questions
    db.data.questions = db.data.questions.filter(q => q.quiz_id !== quiz_id);

    // Delete responses
    db.data.responses = db.data.responses.filter(r => r.quiz_id !== quiz_id);

    // Delete quiz
    db.data.quizzes.splice(quizIndex, 1);

    await db.write();

    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    console.error('Error in delete quiz endpoint:', err);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

module.exports = router;
