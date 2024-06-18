import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';
import '../styles/LoadReviewer.css';
import isURL from 'validator/lib/isURL';
import {
  extractTextFromYoutube,
  extractTextFromGDoc,
  getGoogleDocId
} from '../utils';
import { OpenAI } from 'openai';

const LoadReviewer = ({ handleLogout, isLoggedIn }) => {
  const navigate = useNavigate();
  const [reviewerLink, setReviewerLink] = useState('');
  const [error, setError] = useState(null);
  const [quiz, setQuiz] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleUploadButtonClick = () => {
    document.getElementById('reviewer-form').style.display = 'block';
  };

  const handleReviewerLinkChange = (e) => {
    setReviewerLink(e.target.value);
  };

  const handleReviewerLinkSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setQuiz('');
    setLoading(true); // Start loading
    let text;
    if (isURL(reviewerLink)) {
      if (reviewerLink.includes('youtube.com')) {
        text = await extractTextFromYoutube(reviewerLink);
      } else if (reviewerLink.includes('docs.google.com')) {
        const fileId = getGoogleDocId(reviewerLink);
        const accessToken = process.env.OPENAI_API_KEY;
        text = await extractTextFromGDoc(fileId, accessToken);
      }
    } else {
      text = reviewerLink;
    }

    if (text) {
      try {
        const response = await axios.post('http://localhost:5001/api/generate-quiz', { text });
        const quizData = response.data;
        setQuiz(quizData);

        // Navigate to QuizList page after saving the quiz
        navigate('/quiz-list');
      } catch (error) {
        console.error('Error generating quiz:', error);
        setError('Error generating quiz.');
      } finally {
        setLoading(false); // End loading
      }
    } else {
      alert('Please enter a valid URL or text.');
      setLoading(false); // End loading if invalid URL
    }
  };

  const handleViewQuizzes = () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user) {
      navigate(`/quiz-list-user/${user.id}`);
    } else {
      navigate('/quiz-list');
    }
  };

  return (
    <div className="load-reviewer-page">
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '24px' }}>
          Loading your quiz...
        </div>
      ) : (
        <>
          <div className="header">
            <img src={logo} alt="Logo" className="logo" />
            <h2>This is SharpMind's Quiz Generator Page (◕‿◕)</h2>
          </div>
          <div>
            <div className="try-for-free-content">
              {isLoggedIn && (
                <button className="button-stylehp" onClick={handleLogout}>Logout</button>
              )}
              <h3>How to Use SharpMind: A Step-by-Step Guide</h3>
              <p>
                Using SharpMind is simple and intuitive. Follow these steps to make the most of our platform:
                <br />
                1. Upload your study materials, including text documents, videos, and presentations.<br />
                2. SharpMind will automatically generate quiz-style questionnaires based on your uploaded content.<br />
                3. Take the quizzes to test your understanding and comprehension.<br />
                4. Review your test results so you'll know where to concentrate to improve your score and eventually master the topic based on the resources you're using.
              </p>
              <button className="button-stylehp" onClick={handleUploadButtonClick}>
                Click to start your learning journey!!!
              </button>
              <button className="button-stylehp" onClick={handleViewQuizzes}>View Quizzes</button>
            </div>
            <div id="reviewer-form" style={{ display: 'none' }}>
              <form onSubmit={handleReviewerLinkSubmit} className="reviewer-form">
                <label htmlFor="reviewerLink">Enter Reviewer Text or Link:</label> <br />
                <textarea
                  rows="8"
                  id="reviewerLink"
                  name="reviewerLink"
                  value={reviewerLink}
                  onChange={handleReviewerLinkChange}
                  style={{ width: '100%' }}
                  required
                ></textarea>
                <button className="button-stylehp" type="submit">Generate Quiz</button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LoadReviewer;
