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

  res.status(200).send({ message: 'Welcome to SharpMindAI', date: new Date() })
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
    const users = await pool.query(
      'SELECT * FROM users'
    );

    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});