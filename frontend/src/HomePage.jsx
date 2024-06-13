import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/HomePage.css';
import logo from './assets/logo.png';
import { saveAs } from 'file-saver';
import {
  extractTextFromYoutube,
  extractTextFromGDoc,
  generateQuizWithChatGPT,
  getGoogleDocId
} from './utils';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

const HomePage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('default');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // Store logged-in user data
  const [showSignUpButton, setShowSignUpButton] = useState(true);
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isUploadButtonClicked, setIsUploadButtonClicked] = useState(false);
  const [quiz, setQuiz] = useState(null); // State to store generated quiz

  useEffect(() => {
    localStorage.removeItem('loggedInUser');  // Remove stored user data on mount
    const storedUser = localStorage.getItem('loggedInUser'); // Check for remaining data (optional)
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      setIsLoggedIn(true); // Update state if data still exists (optional)
    }
  }, []); // Empty dependency array to run only once on component mount

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setUserData(null); // Clear user data in state
    setIsLoggedIn(false); // Update login state
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:5001/api/users', {
        email,
        password,
      });
      const userData = response.data;
      if (userData) {
        localStorage.setItem('loggedInUser', JSON.stringify(userData));
        setUserData(userData); // Update state with user data
        setIsLoggedIn(true);
        setContent('loadReviewer'); // Set content to "loadReviewer" after successful login
        navigate('/load-reviewer'); // Optional: Navigate to a dedicated "/load-reviewer" route
      } else {
        setErrorMessage('Wrong email address or password!');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred during login. Please try again.');
    }
  };

  const handleUploadButtonClick = () => {
    setIsUploadButtonClicked(true);
  };

  const isURL = (str) => {
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleReviewerLinkSubmit = async (e) => {
    e.preventDefault();
    const reviewerLink = e.target.reviewerLink.value.trim();
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
        const quizData = response.data.quiz;
        setQuiz(quizData);

        const blob = new Blob([quizData], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'generated_quiz.txt');
        
        // Save quiz on the backend
        await axios.post('http://localhost:5001/api/save-quiz', { quiz: quizData });

      } catch (error) {
        console.error('Error generating quiz:', error);
      }
    } else {
      alert('Please enter a valid URL or text.');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleShowLoginForm = () => {
    setShowLoginForm(true); // Toggle login form visibility
    setShowSignUpButton(false); // Hide Sign Up button on login form open
  };

  const LoginForm = () => (  // Separate LoginForm component
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <form onSubmit={handleLoginSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <button style={buttonStyle} type="submit">Submit</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>
    </div>
  );

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007BFF',
    color: '#FFF',
    margin: '10px'
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '50px',
    textAlign: 'center'
  };

  const logoStyle = {
    width: '110px',
    height: '110px',
    marginBottom: '10px',
    marginRight: '20px'
  };

  const handleLearnMoreClick = () => {
    setContent('learnMore');
  };

  const handleTryForFreeClick = () => {
    setContent('loadReviewer');
  };

  return (
    <div>
      <div style={containerStyle}>
        <img src={logo} alt="Logo" style={logoStyle} />
        <h1>Welcome to SharpMind AI</h1>
      </div>

      {!isLoggedIn && (
        <>
          {showSignUpButton && (  // Conditionally render Sign Up button
            <button style={buttonStyle} onClick={() => navigate('/signup')}>Sign Up</button>
          )}
          {!showLoginForm && (  // Render Login button only if form not shown
            <button style={buttonStyle} onClick={handleShowLoginForm}>Login</button>
          )}
          {showLoginForm && <LoginForm />}  {/* Render LoginForm conditionally */}
        </>
      )}
      <div className="read-the-docs-container">
        {content === 'default' && (
          <p className="read-the-docs">
            SharpMindAI is an innovative educational application designed to enhance learning and comprehension through interactive quizzes generated from user-uploaded documents. Users can upload various file types—text documents, PDFs, video, powerpoint and slides presentations.<br /> <br />
            Say goodbye to the traditional methods of self-testing that are not only time-consuming but often require the creation of custom quizzes or flashcards.<br /> <br />
            SharpMindAI aims to solve this problem by automating the quiz creation process, allowing users to focus on learning and understanding rather than on the mechanics of creating study aids.<br /> <br />
            SharpMindAI aims to provide a seamless and efficient learning experience, enabling users to deepen their understanding of study materials through interactive and automatically generated quizzes.
          </p>
        )}
        {content === 'learnMore' && (
          <>
            <div className="learn-more-content">
              <div className="learn-more-item">
                <h2>Easily Generate Quizzes from Various File Types with SharpMindAI</h2>
                <p>
                  With SharpMindAI, users can effortlessly upload different file types, such as text documents, PDFs, videos, powerpoint and slides presentations and the app will automatically generate quiz-style questionnaires based on the content of these files. This innovative feature saves time and eliminates the need for manual quiz creation, allowing users to focus on learning and comprehension.
                </p>
              </div>
              <div className="learn-more-item">
                <h2>Enhance Learning and Comprehension with Interactive Quizzes</h2>
                <p>
                  SharpMindAI generates quiz-style questionnaires from user-uploaded documents, helping users enhance their learning and comprehension of the material. By actively engaging with the content through quizzes, users can reinforce their understanding and retain information more effectively.
                </p>
              </div>
              <div className="learn-more-item">
                <h2>Say Goodbye to Time-Consuming Custom Quiz Creation</h2>
                <p>
                  Say goodbye to the traditional methods of self-testing that require the creation of custom quizzes or flashcards. SharpMindAI automates the quiz creation process, eliminating the time-consuming task of manually crafting quizzes. Users can now focus on studying and mastering the content rather than on the mechanics of quiz creation.
                </p>
              </div>
              <div className="learn-more-item">
                <h2>Experience a Seamless and Efficient Learning Journey</h2>
                <p>
                  SharpMindAI aims to provide a seamless and efficient learning experience for users. By automating the quiz creation process, users can deepen their understanding of study materials through interactive and automatically generated quizzes. This intuitive approach enhances learning outcomes and makes the educational journey more enjoyable and productive.
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button style={buttonStyle} onClick={handleTryForFreeClick}>Try for Free</button>
            </div>
          </>
        )}
        {content === 'loadReviewer' && (
          <div>
            {/* Instructions and Upload Button */}
            <div className="try-for-free-content">
              <h2>How to Use SharpMindAI: A Step-by-Step Guide</h2>
              <p>
                Using SharpMindAI is simple and intuitive. Follow these steps to make the most of our platform:
                <br />
                1. Upload your study materials, including text documents, videos, and presentations.<br />
                2. SharpMindAI will automatically generate quiz-style questionnaires based on your uploaded content.<br />
                3. Take the quizzes to test your understanding and comprehension.<br />
                4. Review your test results so you'll know where to concentrate to improve your score and eventualy master the topic based on the resources you're using.
              </p>
              <button style={buttonStyle} onClick={handleUploadButtonClick}>
                Click to start your learning journey!!!
              </button>
            </div>

            {/* Reviewer Link Input (conditionally displayed) */}
            {isUploadButtonClicked && (
              <form onSubmit={handleReviewerLinkSubmit}>
                <label htmlFor="reviewerLink">Enter Reviewer Text or Link:</label>
                <input type="text" id="reviewerLink" name="reviewerLink" required />
                <button style={buttonStyle} type="submit">Generate Quiz</button>
              </form>
            )}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {content === 'default' && (
            <>
              <button style={buttonStyle} onClick={() => navigate('/create-quiz/1')}>Get Started</button>
              <button style={buttonStyle} onClick={handleLearnMoreClick}>Learn More</button>
            </>
          )}
        </div>
        {quiz && (
          <div>
            <h2>Generated Quiz:</h2>
            <pre>{quiz}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;