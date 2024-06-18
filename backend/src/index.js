import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import openAI from 'openai';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authRoutes from './auth.js';
import cookieParser from 'cookie-parser';
import { generateToken, verifyToken } from './auth.js';
import { createRequire } from 'module';

dotenv.config();
const app = express();
const { Pool } = pg;
const PORT = 5001;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api', authRoutes);
app.use(cookieParser());

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let publicQuizzes = [];

// Routes
app.get('/', async (req, res) => {
  res.status(200).send({ message: 'Welcome to SharpMind', date: new Date() });
});

app.post('/api/signup', async (req, res) => {
  const { name, email, password, acct_type } = req.body;

  if (!name || !email || !password || !acct_type ) {
    return res.status(400).send({ message: 'Incomplete form' });
  }

  if (name.length > 40) {
    return res.status(400).send({ message: 'Name cannot be greater than 40 characters' });
  }

  if (password.length < 4) {
    return res.status(400).send({ message: 'Password cannot be less than 8 characters' });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, acct_type) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, acct_type]
    );

    const token = jwt.sign({ id: newUser.rows[0].id, email: newUser.rows[0].email }, JWT_SECRET, { expiresIn: '1h' });

    // Create JWT token
    res.json({ token, user: { id: newUser.rows[0].id, email: newUser.rows[0].email } });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development',
      sameSite: 'strict',
    });

    res.json({ id: user.id, email: user.email, name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out successfully' });
});

app.put('/api/users/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const { name, email, password } = req.body; // Updated user data

  if (isNaN(userId)) {
    return res.status(400).send('Invalid user ID');
  }

  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const updateFields = [name, email, hashedPassword].filter(Boolean);

    const updateQuery = `
      UPDATE users 
      SET 
        name = COALESCE($1, name), 
        email = COALESCE($2, email), 
        password = COALESCE($3, password) 
      WHERE id = $4 RETURNING *`;

    const updateResult = await pool.query(updateQuery, [...updateFields, userId]);

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
  const { title, questions, userId } = req.body;

  try {
    const quizResult = await pool.query(
      'INSERT INTO quiz (quiz_title, user_id) VALUES ($1, $2) RETURNING id',
      [title, userId]
    );
    const quizId = quizResult.rows[0].id;

    for (const question of questions) {
      await pool.query(
        'INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES ($1, $2, $3, $4)',
        [quizId, question.questionText, JSON.stringify(question.options), question.correctOption]
      );
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

//READ for QUIZZES SPECIFIC (quiz creation history)
app.get('/api/users/:userId/quizzes', async (req, res) => {
  const userId = parseInt(req.params.userId);

  if (isNaN(userId)) {
    return res.status(400).send('Invalid user ID');
  }

  try {
      const result = await pool.query('SELECT * FROM quiz WHERE user_id = $1', [userId]);
      res.json(result.rows);
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
        'INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES ($1, $2, $3, $4)',
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

//READ for FILES for SPECIFIC USER (upload history)
app.get('/api/users/:userId/files', async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
      const result = await pool.query('SELECT * FROM file WHERE user_id = $1', [userId]);
      res.json(result.rows);
  } catch (err) {
      console.error(err.message);
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
    const results = await pool.query('SELECT * FROM result WHERE user_id = $1', [userId]);
    res.json(results.rows);
  } catch (err) {
    console.error(err.message);
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

app.get('/api/public-quiz', async (req, res) => {
  try {
    const result = await pool.query('SELECT * from quiz where privacy=$1 LIMIT 40', ['public']);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/api/quiz-list-user/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
 
  if (isNaN(userId)) {
    return res.status(400).send('Invalid user ID');
  }

  try {
    const result = await pool.query('SELECT * FROM quiz WHERE user_id = $1 LIMIT 10', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/api/take-the-quiz/:quizId', async (req, res) => {
  const quizId = parseInt(req.params.quizId, 10);

  if (isNaN(quizId)) {
    return res.status(400).send('Invalid quiz ID');
  }

  try {
    const result = await pool.query('SELECT * FROM question WHERE quiz_id = $1', [quizId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/api/quizes', async (req, res) => {
  const privacy = req.query.privacy
  try {
    const result = await pool.query('SELECT * from quiz where privacy=$1 LIMIT 10', [privacy]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/api/generate-quiz', async (req, res) => {
  const promptFilePath1 = path.join(__dirname, '.prompt1');
  const prompt1 = fs.readFileSync(promptFilePath1, 'utf-8');
  const { text } = req.body;
  const openai1 = new openAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const messages = [
      { role: 'system', content: prompt1 },
      { role: 'user', content: text }
    ];

    const response1 = await openai1.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 1500,
      n: 1,
      stop: null,
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const quizData = JSON.parse(response1.choices[0].message.content);

    // Sends quiz directly to db then takes the quiz_id
    const quizResult = await pool.query(
      'INSERT INTO quiz (user_id, quiz_title, privacy) VALUES ($1, $2, $3) RETURNING id',
      [quizData.user_id, quizData.quiz_title, quizData.privacy]
    );

    const quiz_id = quizResult.rows[0].id;

    // Insert the questions for the quiz into the database
    for (const question of quizData.questions) {
      await pool.query(
        'INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES ($1, $2, $3, $4)',
        [quiz_id, question.question_text, JSON.stringify(question.options), question.correct_option]
      );
    }

    res.json({ message: 'Quiz and questions saved successfully.', quiz_id });
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

app.get('/api/users/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).send('Invalid user ID');
  }
  try {
      const result = await pool.query('SELECT name, email FROM users WHERE id = $1', [userId]);
      if (result.rows.length > 0) {
          res.json(result.rows[0]);
      } else {
          res.status(404).send('User not found');
      }
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});