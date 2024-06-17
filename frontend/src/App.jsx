import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import SignUp from './pages/SignUp';
import QuizList from './pages/QuizList';
import QuizListUser from './pages/QuizListUser';
import TakeTheQuiz from './pages/TakeTheQuiz';
import Dashboard from './pages/Dashboard';
import LearnMoreItem from './pages/LearnMoreItem';
import LoadReviewer from './pages/LoadReviewer';
import './styles/App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} handleLogout={handleLogout} />} />
      <Route path="/learnMoreItem" element={<LearnMoreItem />} />
      <Route path="/load-reviewer" element={<LoadReviewer isLoggedIn={isLoggedIn} handleLogout={handleLogout} />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/quiz-list" element={<QuizList />} />
      <Route path="/quiz-list-user/:id" element={<QuizListUser />} />
      <Route path="/take-the-quiz/:quizId" element={<TakeTheQuiz />} />
    </Routes>
  );
};

export default App;
