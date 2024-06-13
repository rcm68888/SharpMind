import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pkg from 'pg';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import openAI from 'openai';

dotenv.config();
const { Pool } = pkg;
const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let publicQuizzes = [];

// Database connection
const pool = new Pool({
  user: 'labber',
  host: 'localhost',
  database: 'sharpmind',
  password: 'labber',
  port: 5432,
});

// Function to save data to a file
const saveToFile = (dir, fileName, data, res) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const filePath = path.join(dir, fileName);
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.error(`Error saving to ${filePath}:`, err);
      res.status(500).send(`Error saving ${fileName}`);
    } else {
      res.status(200).send(`${fileName} saved successfully`);
    }
  });
};

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
    const result = await pool.query('SELECT * from quiz where privacy=$1 LIMIT 10', ['public']);
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
  // Read the prompt from a .prompt file
  const promptFilePath = path.join(__dirname, '.prompt');
  const prompt = fs.readFileSync(promptFilePath, 'utf-8');
  const { text } = req.body;
  const openai = new openAI({ apiKey: process.env.OPENAI_API_KEY,});
  try {
    const prompt = fs.readFileSync(promptFilePath, 'utf-8');
    const messages = [
      { role: 'system', content: prompt },
      { role: 'user', content: text }
    ];
    //console.log(messages);

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 1500,
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

app.post('/api/generate-quiz_title', async (req, res) => {
  // Read the prompt from a .prompt file
  const promptFilePath1 = path.join(__dirname, '.prompt1');
  const prompt1 = fs.readFileSync(promptFilePath1, 'utf-8');
  const { text } = req.body;
  const openai1 = new openAI({ apiKey: process.env.OPENAI_API_KEY,});
  try {
    const prompt1 = fs.readFileSync(promptFilePath1, 'utf-8');
    const messages = [
      { role: 'system', content: prompt1 },
      { role: 'user', content: text }
    ];
    //console.log(messages);

    const response1 = await openai1.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 1500,
      n: 1,
      stop: null,
      temperature: 0.7,
    });
    const quiz_title = response1.choices[0].message.content;
    res.json({ quiz_title });
  } catch (error) {
    console.error('Error generating quiz title with ChatGPT:', error.message);
    res.status(500).send('Error generating quiz title');
  }
});

app.post('/api/save-quiz', (req, res) => {
  const { quiz } = req.body;

  if (!quiz) {
    return res.status(400).send('Quiz content is missing');
  }

  const uploadsDir = path.join(__dirname, 'uploads');
  saveToFile(uploadsDir, 'generated_quiz.txt', quiz, res);
});

app.post('/api/save-quiz_title', (req, res) => {
  const { quiz_title  } = req.body;
  if (!quiz_title) {
    return res.status(400).send('Quiz title is missing');
  }
  const uploadsDir = path.join(__dirname, 'uploads');
  saveToFile(uploadsDir, 'generated_quiz_title.txt', quiz_title, res);
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});