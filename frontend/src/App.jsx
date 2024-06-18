import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SignUp from './pages/SignUp';
import QuizList from './pages/QuizList';
import QuizListUser from './pages/QuizListUser';
import TakeTheQuiz from './pages/TakeTheQuiz';
import LearnMoreItem from './pages/LearnMoreItem';
import LoadReviewer from './pages/LoadReviewer';
import LoadingAnimation from './pages/LoadingAnimation';
import './styles/App.css';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setIsLoggedIn(false);
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} handleLogout={handleLogout} />} />
      <Route path="/load-reviewer" element={<HomePage isLoggedIn={isLoggedIn} handleLogout={handleLogout} content="loadReviewer" />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/quiz-list" element={<QuizList />} />
      <Route path="/quiz-list-user/:id" element={<QuizListUser />} />
      <Route path="/take-the-quiz/:quizId" element={<TakeTheQuiz />} />
      <Route path="/loading-animation" element={<LoadingAnimation />} />
    </Routes>
  );
};

export default App;
