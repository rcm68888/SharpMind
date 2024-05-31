import React from 'react';
import './HomePage.css';
import logo from './assets/logo.png';

const HomePage = () => {
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

  return (
    <div>
      <div style={containerStyle}>
        <img src={logo} alt="Logo" style={logoStyle} />
        <h1>Welcome to SharpMind AI</h1>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button style={buttonStyle} onClick={() => alert('Sign Up functionality coming soon!')}>Sign Up</button>
        <button style={buttonStyle} onClick={() => alert('Login functionality coming soon!')}>Login</button>
      </div>
      <div className="read-the-docs-container">
        <p className="read-the-docs">
          SharpMindAI is an innovative educational application designed to enhance learning and comprehension through interactive quizzes generated from user-uploaded documents. Users can upload various file types—text documents, PDFs, video, power point and slides presentations.<br />
          Say goodbye to the traditional methods of self-testing that are not only time-consuming but often require the creation of custom quizzes or flashcards.<br />
          SharpMindAI aims to solve this problem by automating the quiz creation process, allowing users to focus on learning and understanding rather than on the mechanics of creating study aids.<br />
          SharpMindAI aims to provide a seamless and efficient learning experience, enabling users to deepen their understanding of study materials through interactive and automatically generated quizzes.
        </p>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button style={buttonStyle} onClick={() => alert('Get Started functionality coming soon!')}>Get Started</button>
          <button style={buttonStyle} onClick={() => alert('Learn More functionality coming soon!')}>Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;