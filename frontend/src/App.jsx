import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SignUp from './pages/SignUp';
import QuizList from './pages/QuizList';
import QuizListUser from './pages/QuizListUser';
import TakeTheQuiz from './pages/TakeTheQuiz';
import LearnMoreItem from './pages/LearnMoreItem';
import LoadReviewer from './pages/LoadReviewer';
import './styles/App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setIsLoggedIn(false);
  };

  return (
    <div className="app-container">
      <Routes>
        <Route
          path="/"
          element={<HomePage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} handleLogout={handleLogout} />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/learnMoreItem" element={<LearnMoreItem />} />
        <Route path="/load-reviewer" element={<LoadReviewer handleLogout={handleLogout} isLoggedIn={isLoggedIn} />} />
        <Route path="/quiz-list" element={<QuizList />} />
        <Route path="/quiz-list-user/:id" element={<QuizListUser />} />
        <Route path="/take-the-quiz/:quizId" element={<TakeTheQuiz />} />
      </Routes>
    </div>
  );
};

export default App;
