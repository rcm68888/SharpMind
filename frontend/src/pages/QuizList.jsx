import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';
import '../styles/QuizList.css';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/public-quiz');
        setQuizzes(response.data);
      } catch (error) {
        setError('Failed to fetch quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedQuiz) {
      navigate(`/take-the-quiz/${selectedQuiz}`);
    } else {
      alert('Please select a quiz.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="quiz-list-header">
        <img src={logo} alt="Logo" className="logo-style" />
        <h1>SharpMind ⭐ Quiz List</h1>
      </div>
      <div className="quiz-list-container">
        <form onSubmit={handleSubmit} className="quiz-form">
          <label htmlFor="quiz-select">Select the quiz you want to take:</label>
          <select
            id="quiz-select"
            value={selectedQuiz}
            onChange={(e) => setSelectedQuiz(e.target.value)}
            className="quiz-select"
          >
            <option value="">--Select a quiz--</option>
            {quizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>
                {quiz.quiz_title}
              </option>
            ))}
          </select>
          <button type="submit" className="button-styleql">Submit</button>
        </form>
      </div>
    </>
  );
};

export default QuizList;