import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SignUp from './pages/SignUp';
import QuizList from './pages/QuizList';
import QuizListUser from './pages/QuizListUser';
import TakeTheQuiz from './pages/TakeTheQuiz';
import './styles/App.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/load-reviewer" element={<HomePage content="loadReviewer" />} />  {/* Pre-set content */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/quiz-list" element={<QuizList />} />
      <Route path="/quiz-list-user/:id" element={<QuizListUser />} />
      <Route path="/take-the-quiz/:quizId" element={<TakeTheQuiz />} />
    </Routes>
  );
};

export default App;
