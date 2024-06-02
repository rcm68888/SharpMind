import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pkg from 'pg';

const { Pool } = pkg;
const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const pool = new Pool({
  user: 'labber',
  host: 'localhost',
  database: 'sharpmind',
  password: 'labber',
  port: 5432,
});

// Routes
app.get('/', async (req, res) => {
  res.status(200).send({ message: 'Welcome to SharpMindAI', date: new Date() });
});

app.post('/api/signup', async (req, res) => {
  const { name, email, password, acct_type } = req.body;

  try {
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, acct_type) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, password, acct_type]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await pool.query('SELECT * FROM users');
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/api/quizzes', async (req, res) => {
  const { title, questions } = req.body;

  try {
    const quizResult = await pool.query(
      'INSERT INTO quiz (quiz_title) VALUES ($1) RETURNING id',
      [title]
    );
    const quizId = quizResult.rows[0].id;

    for (const question of questions) {
      const questionResult = await pool.query(
        'INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES ($1, $2, $3, $4) RETURNING id',
        [quizId, question.questionText, JSON.stringify(question.options), question.correctOption]
      );
      console.log(`Inserted question with ID: ${questionResult.rows[0].id}`);
    }

    res.json({ message: 'Quiz created successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/files', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, file_name FROM file');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/api/quiz/:fileId', async (req, res) => {
  const fileId = parseInt(req.params.fileId, 10);
  console.log(`Fetching quiz for fileId: ${fileId}`);
  if (isNaN(fileId)) {
    return res.status(400).send('Invalid fileId');
  }

  try {
    const result = await pool.query('SELECT * FROM quiz WHERE file_id = $1', [fileId]);
    const quiz = result.rows[0];
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }

    const questionsResult = await pool.query('SELECT * FROM question WHERE quiz_id = $1', [quiz.id]);
    quiz.questions = questionsResult.rows;
    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
