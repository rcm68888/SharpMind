import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pkg from 'pg';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';



dotenv.config();
const { Pool } = pkg;
const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

let publicQuizzes = [];

// Database connection
const pool = new Pool({
  user: 'labber',
  host: 'localhost',
  database: 'sharpmind',
  password: 'labber',
  port: 5432,
});

// Get the directory name of the current module file
//const currentDir = dirname(new URL(import.meta.url).pathname);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the prompt from a .prompt file
const promptFilePath = path.join(__dirname, '.prompt');
const prompt = fs.readFileSync(promptFilePath, 'utf-8');

// Configure OpenAI API client
const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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


app.put('/api/users/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const { name, email, password } = req.body; // Updated user data

  if (isNaN(userId)) {
    return res.status(400).send('Invalid user ID');
  }

  try {
    const updateResult = await pool.query(
      'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
      [name, email, password, userId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).send('User not found');
    }

    res.json(updateResult.rows[0]); // Return updated user data
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**** CRUD for QUIZZES *****/

//CREATE for QUIZZES
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

//READ for QUIZZES (all quizzes)
app.get('/api/quizzes', async (req, res) => {
  try {
    const quizzes = await pool.query('SELECT * FROM quiz');
    res.json(quizzes.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


//UPDATE for QUIZZES
app.put('/api/quizzes/:quizId', async (req, res) => {
  const quizId = parseInt(req.params.quizId, 10);
  const { title, questions } = req.body;

  if (isNaN(quizId)) {
    return res.status(400).send('Invalid quiz ID');
  }

  try {
    const updateQuizResult = await pool.query(
      'UPDATE quiz SET quiz_title = $1 WHERE id = $2 RETURNING *',
      [title, quizId]
    );

    if (updateQuizResult.rows.length === 0) {
      return res.status(404).send('Quiz not found');
    }

    await pool.query('DELETE FROM question WHERE quiz_id = $1', [quizId]);

    for (const question of questions) {
      await pool.query(
        'INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES ($1, $2, $3, $4) RETURNING id',
        [quizId, question.questionText, JSON.stringify(question.options), question.correctOption]
      );
    }

    res.json({ message: 'Quiz updated successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//QUIZ DELETION
app.delete('/api/quizzes/:quizId', async (req, res) => {
  const quizId = parseInt(req.params.quizId, 10);

  if (isNaN(quizId)) {
    return res.status(400).send('Invalid quiz ID');
  }

  try {
    await pool.query('DELETE FROM question WHERE quiz_id = $1', [quizId]);

    const deleteQuizResult = await pool.query('DELETE FROM quiz WHERE id = $1 RETURNING *', [quizId]);

    if (deleteQuizResult.rows.length === 0) {
      return res.status(404).send('Quiz not found');
    }

    res.json({ message: 'Quiz deleted successfully!' });
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

/***** CRUD for FILES *****/

//CREATE for FILES

app.post('/api/files', async (req, res) => {
  const { fileName, filePath, fileType, userId } = req.body;

  try {
    const newFile = await pool.query(
      'INSERT INTO file (file_name, file_path, file_type, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [fileName, filePath, fileType, userId]
    );

    res.json(newFile.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//READ for FILES
app.get('/api/files', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, file_name FROM file');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

//UPDATE for FILES
app.put('/api/files/:fileId', async (req, res) => {
  const fileId = parseInt(req.params.fileId, 10);
  const { fileName, filePath, fileType, userId } = req.body;

  if (isNaN(fileId)) {
    return res.status(400).send('Invalid file ID');
  }

  try {
    const updateResult = await pool.query(
      'UPDATE file SET file_name = $1, file_path = $2, file_type = $3, user_id = $4 WHERE id = $5 RETURNING *',
      [fileName, filePath, fileType, userId, fileId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).send('File not found');
    }

    res.json(updateResult.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//DELETE for FILES

app.delete('/api/files/:fileId', async (req, res) => {
  const fileId = parseInt(req.params.fileId, 10);

  if (isNaN(fileId)) {
    return res.status(400).send('Invalid file ID');
  }

  try {
    const deleteResult = await pool.query('DELETE FROM file WHERE id = $1 RETURNING *', [fileId]);

    if (deleteResult.rows.length === 0) {
      return res.status(404).send('File not found');
    }

    res.json({ message: 'File deleted successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status (500).send('Server error');
  }
});


/**** CRUD for RESULT (only C and R) ****/
app.post('/api/results', async (req, res) => {
  const { userId, quizId, score, dateTaken } = req.body;

  try {
    const newResult = await pool.query(
      'INSERT INTO results (user_id, quiz_id, score, date_taken) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, quizId, score, dateTaken]
    );

    res.json(newResult.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.delete('/api/results/:resultId', async (req, res) => {
  const resultId = parseInt(req.params.resultId, 10);

  if (isNaN(resultId)) {
    return res.status(400).send('Invalid result ID');
  }

  try {
    const deleteResult = await pool.query('DELETE FROM results WHERE id = $1 RETURNING *', [resultId]);

    if (deleteResult.rows.length === 0) {
      return res.status(404).send('Result not found');
    }

    res.json({ message: 'Result deleted successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//For specific user
app.get('/api/users/:userId/results', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    return res.status(400).send('Invalid user ID');
  }

  try {
    const results = await pool.query('SELECT * FROM results WHERE user_id = $1', [userId]);
    res.json(results.rows);
  } catch (err) {
    console.error(err.message);
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

app.post('/api/extract-youtube', async (req, res) => {
  const { videoUrl } = req.body;
  try {
    // Logic to extract text from YouTube video
    const extractedText = 'Extracted text from YouTube video';
    res.json({ text: extractedText });
  } catch (error) {
    console.error('Error extracting text from YouTube:', error);
    res.status(500).json({ error: 'Error extracting text from YouTube' });
  }
});

app.post('/api/extract-gdoc', async (req, res) => {
  const { googleDocId } = req.body;
  try {
    // Logic to extract text from Google Doc
    const extractedText = 'Extracted text from Google Doc';
    res.json({ text: extractedText });
  } catch (error) {
    console.error('Error extracting text from Google Doc:', error);
    res.status(500).json({ error: 'Error extracting text from Google Doc' });
  }
});

app.post('/api/generate-quiz', async (req, res) => {
  // Read the prompt from a .prompt file
  const promptFilePath = path.join(__dirname, '.prompt');
  const prompt = fs.readFileSync(promptFilePath, 'utf-8');
  const { text } = req.body;
  const openai = new openAI({ apiKey: process.env.OPENAI_API_KEY, });
  try {
    const prompt = fs.readFileSync(promptFilePath, 'utf-8');
    const messages = [
      { role: 'system', content: prompt },
      { role: 'user', content: text }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 800,
      n: 1,
      stop: null,
      temperature: 0.7,
    });
    const quiz = response.choices[0].message.content;
    res.json({ quiz });
  } catch (error) {
    console.error('Error generating quiz with ChatGPT:', error.message);
    res.status(500).send('Error generating quiz');
  }
});

app.get('/api/quiz/:id', (req, res) => {
  const quizId = parseInt(req.params.id, 10);
  const quiz = publicQuizzes.find(q => q.id === quizId);
  if (quiz) {
    res.json(quiz);
  } else {
    res.status(404).json({ error: 'Quiz not found' });
  }
});

app.get('/api/public-quiz', async (req, res) => {
  try {
    const result = await pool.query('SELECT * from quiz where privacy=$1 LIMIT 10', ['public']);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});