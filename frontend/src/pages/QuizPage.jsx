import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/QuizPage.css'; 

const QuizPage = () => {
  const { fileId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        console.log(`Fetching quiz with fileId: ${fileId}`);
        const response = await axios.get(`http://localhost:5001/api/quiz/${fileId}`);
        console.log('Quiz data received:', response.data);
        setQuiz(response.data);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };
    fetchQuiz();
  }, [fileId]);

  const handleChange = (questionId, option) => {
    setAnswers({
      ...answers,
      [questionId]: option,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Calculate results based on answers
    const correctAnswers = quiz.questions.filter(q => q.correct_option === answers[q.id]).length;
    setResults({
      total: quiz.questions.length,
      correct: correctAnswers,
    });
  };

  return (
    <div>
      {quiz ? (
        <form onSubmit={handleSubmit}>
          <h2>{quiz.quiz_title}</h2>
          {quiz.questions.map(question => (
            <div key={question.id} className="question">
              <p>{question.question_text}</p>
              {question.options.map((option, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    onChange={() => handleChange(question.id, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
      {results && (
        <div className="results">
          <h2>Results</h2>
          <p>Total Questions: {results.total}</p>
          <p>Correct Answers: {results.correct}</p>
        </div>
      )}
    </div>
  );
};

export default QuizPage;






