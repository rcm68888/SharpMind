import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import logo from './assets/logo.png';

const HomePage = () => {
  const history = useNavigate();
  const [content, setContent] = useState('default');

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
    setContent('tryForFree');
  };

  return (
    <div>
      <div style={containerStyle}>
        <img src={logo} alt="Logo" style={logoStyle} />
        <h1>Welcome to SharpMind AI</h1>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button style={buttonStyle} onClick={() => history.push('/signup')}>Sign Up</button>
        <button style={buttonStyle} onClick={() => alert('Login functionality coming soon!')}>Login</button>
      </div>
      <div className="read-the-docs-container">
        {content === 'default' && (
          <p className="read-the-docs">
            SharpMindAI is an innovative educational application designed to enhance learning and comprehension through interactive quizzes generated from user-uploaded documents. Users can upload various file types—text documents, PDFs, video, power point and slides presentations.<br />
            Say goodbye to the traditional methods of self-testing that are not only time-consuming but often require the creation of custom quizzes or flashcards.<br />
            SharpMindAI aims to solve this problem by automating the quiz creation process, allowing users to focus on learning and understanding rather than on the mechanics of creating study aids.<br />
            SharpMindAI aims to provide a seamless and efficient learning experience, enabling users to deepen their understanding of study materials through interactive and automatically generated quizzes.
          </p>
        )}
        {content === 'learnMore' && (
          <>
            <div className="learn-more-content">
              <div className="learn-more-item">
                <h2>Easily Generate Quizzes from Various File Types with SharpMindAI</h2>
                <p>
                  With SharpMindAI, users can effortlessly upload different file types, such as text documents, PDFs, videos, power point presentations, and slides, and the app will automatically generate quiz-style questionnaires based on the content of these files. This innovative feature saves time and eliminates the need for manual quiz creation, allowing users to focus on learning and comprehension.
                </p>
              </div>
              <div className="learn-more-item">
                <h2>Enhance Learning and Comprehension with Interactive Quizzes</h2>
                <p>
                  SharpMindAI generates quiz-style questionnaires from user-uploaded documents, helping users assess their comprehension and enhance learning. By automating the quiz creation process, users can focus on understanding the material rather than creating study aids.
                </p>
              </div>
            </div>
            <button style={buttonStyle} onClick={handleTryForFreeClick}>Try for Free</button>
          </>
        )}
        {content === 'tryForFree' && (
          <>
            <div className="try-for-free-content">
              <h2>How to Use SharpMindAI: A Step-by-Step Guide</h2>
              <p>
                Using SharpMindAI is simple and intuitive. Follow these steps to make the most of our platform:<br />
                1. Upload your study materials, including text documents, PDFs, videos, and presentations.<br />
                2. SharpMindAI will automatically generate quiz-style questionnaires based on your uploaded content.<br />
                3. Take the quizzes to test your understanding and comprehension.
              </p>
              <button style={buttonStyle} onClick={() => alert('Upload functionality coming soon!')}>Upload your PDF or YouTube Link</button>
            </div>
          </>
        )}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button style={buttonStyle} onClick={() => alert('Get Started functionality coming soon!')}>Get Started</button>
          <button style={buttonStyle} onClick={handleLearnMoreClick}>Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;