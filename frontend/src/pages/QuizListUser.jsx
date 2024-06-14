import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';
import '../styles/QuizList.css';

const QuizList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true); // Set loading state before fetching

      try {
        const response = await axios.get(`http://localhost:5001/api/quiz-list-user/${id}`);
        setQuizzes(response.data);
        setLoading(false); // Set loading to false on successful fetch
      } catch (error) {
        setError('Failed to fetch quizzes');
        setLoading(false); // Set loading to false on error
      }
    };

    if (id) {
      fetchQuizzes(); // Fetch quizzes only if `id` is defined
    }
  }, [id]);

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
        <h1>SharpMind 😎👌🔥 Your Quiz List</h1>
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