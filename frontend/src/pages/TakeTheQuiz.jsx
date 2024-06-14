import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/TakeTheQuiz.css';

const TakeTheQuiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [number, setNumber] = useState(0);
  const [pts, setPts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(null);

  const optionMap = { A: 0, B: 1, C: 2, D: 3 };

  const pickAnswer = (e) => {
    let userAnswer = e.target.innerText;

    if (quiz[number].correct_option === userAnswer) setPts(pts + 1);
    setNumber(number + 1);
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

    fetchQuiz();
  }, [quizId]); // Ensure useEffect depends on quizId

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="quiz-window">
      {quiz[number] && (
        <>
          <div className="question">{quiz[number].question}</div>
          <div className="options">
            {quiz[number].options.map((item, index) => (
              <button key={index} className="option" onClick={pickAnswer}>{item}</button>
            ))}
          </div>
        </>
      )}
      {number === quiz.length && <GameOver pts={pts} />}
    </div>
  );
};

const GameOver = ({ pts }) => {
  const refreshPage = () => window.location.reload();

  return (
    <div className="game-over">
      <h1>Game Over</h1>
      <p>You did {pts} out of {quiz.length}!</p>
      <button onClick={refreshPage}>Retry</button>
    </div>
  );
};

export default TakeTheQuiz;