DROP TABLE IF EXISTS users, file, quiz, question, result CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  acct_type VARCHAR(50) NOT NULL
);

CREATE TABLE file (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE quiz (
  id SERIAL PRIMARY KEY,
  file_id INT NOT NULL,
  user_id INT NOT NULL,
  quiz_title VARCHAR(255) NOT NULL,
  privacy VARCHAR(15) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES file(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE question (
  id SERIAL PRIMARY KEY,
  quiz_id INT NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option CHAR(1) NOT NULL,
  FOREIGN KEY (quiz_id) REFERENCES quiz(id) ON DELETE CASCADE
);

CREATE TABLE result (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  quiz_id INT NOT NULL,
  score INT NOT NULL,
  taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (quiz_id) REFERENCES quiz(id) ON DELETE CASCADE
);
