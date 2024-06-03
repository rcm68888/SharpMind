import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SignUp from './pages/SignUp';
import QuizPage from './pages/QuizPage';
import './styles/App.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUp />} />
      {/* <Route path="/create-quiz" element={<QuizPage />} /> */}
      <Route path="/create-quiz/:fileId" element={<QuizPage />} />
    </Routes>
  );
};

export default App;
