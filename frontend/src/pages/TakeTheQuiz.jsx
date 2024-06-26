import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/TakeTheQuiz.css';
import logo from '../assets/logo.png';

const TakeTheQuiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [number, setNumber] = useState(0);
  const [pts, setPts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [viewResults, setViewResults] = useState(false);
  const [explanations, setExplanations] = useState([]);
  const [loadingExplanations, setLoadingExplanations] = useState(false);

  const navigate = useNavigate();
  const optionMap = { A: 0, B: 1, C: 2, D: 3 };

  const pickAnswer = (e) => {
    const selectedAnswerIndex = parseInt(e.target.dataset.index);
    const selectedAnswer = `${String.fromCharCode(65 + selectedAnswerIndex)} - ${quiz[number].options[selectedAnswerIndex]}`;

    const correctAnswerIndex = quiz[number].options.indexOf(quiz[number].correct_option);
    const correctAnswer = `${String.fromCharCode(65 + correctAnswerIndex)} - ${quiz[number].correct_option}`;

    setSelectedAnswers([...selectedAnswers, { question: quiz[number].question, userAnswer: selectedAnswer, correctAnswer }]);

    if (selectedAnswer === correctAnswer) {
      setPts(pts + 1);
    }
    setNumber(number + 1);
  };

  const fetchExplanations = async () => {
    setLoadingExplanations(true);
    try {
      const response = await axios.post('http://localhost:5001/api/generate-explanations', {
        answers: selectedAnswers
      });
      setExplanations(response.data.explanations);
      setViewResults(true);
    } catch (error) {
      console.error('Error fetching explanations:', error);
    } finally {
      setLoadingExplanations(false);
    }
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/take-the-quiz/${quizId}`);
        setQuiz(response.data.map(item => ({
          question: item.question_text,
          options: item.options,
          correct_option: item.options[optionMap[item.correct_option]],
        })));
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch quiz');
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="quiz-window">
      {number < quiz.length ? (
        <>
          <div className="question-number">
            Question {number + 1} of {quiz.length}
          </div>
          <div className="question"> {quiz[number].question}</div>
          <div className="options">
            {quiz[number].options.map((item, index) => (
              <button key={index} className="option" data-index={index} onClick={pickAnswer}>
                {String.fromCharCode(65 + index)} - {item}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div>
          <div className="ttq-header">
            <img src={logo} alt="Logo" className="logo-style" />
            <h2>SharpMind ʚ(｡˃ ᵕ ˂ )ɞ Results</h2>
          </div>
          <div className="game-over">
            <p>Your score: {pts} out of {quiz.length}!</p>
            <button onClick={() => window.location.reload()}>Retry</button>
            <button onClick={() => navigate('/')}>Home</button>
            <button onClick={fetchExplanations} disabled={loadingExplanations}>
              {loadingExplanations ? 'Loading Explanations...' : 'View Results'}
            </button>
            {viewResults && (
              <div className="results">
                <h3>Your Quiz Results</h3>
                {selectedAnswers.map((answer, index) => (
                  <div key={index} className="result-item">
                    <p><strong>Q{index + 1}: {answer.question}</strong></p>
                    <p className={answer.userAnswer === answer.correctAnswer ? 'correct' : 'incorrect'}>
                      Your answer: {answer.userAnswer}
                    </p>
                    <p>Correct answer: {answer.correctAnswer}</p>
                    {answer.userAnswer !== answer.correctAnswer && explanations[index] && (
                      <p className="explanation">
                        Explanation: {explanations[index]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeTheQuiz;

