import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const LearnMoreItem = ({ handleLogout, isLoggedIn }) => {
  const navigate = useNavigate();

  const handleTryForFreeClick = () => {
      navigate('/load-reviewer');
  };

  return (
    <div className="learn-more-item-page">
      <div className="header">
        {isLoggedIn && (
          <button className="button-stylehp" onClick={handleLogout}>Logout</button>
        )}
        <img src={logo} alt="Logo" className="logo" />
        <h2>Learn More about SharpMind</h2>
      </div>
      
      <div className="content-container">
        <div className="description">
          <h3>Easily Generate Quizzes from Various File Types with SharpMind</h3>
          <p>
            With SharpMind, users can effortlessly cut and paste the text from their reviewer documents, PDFs, powerpoint and slides presentations and the app will automatically generate quiz-style questionnaires based on the content of these files. This innovative feature saves time and eliminates the need for manual quiz creation, allowing users to focus on learning and comprehension.
          </p>
        </div>
        <div className="learn-more-item">
          <h3>Enhance Learning and Comprehension with Interactive Quizzes</h3>
          <p>
            SharpMind generates quiz-style questionnaires from user-uploaded documents, helping users enhance their learning and comprehension of the material. By actively engaging with the content through quizzes, users can reinforce their understanding and retain information more effectively.
          </p>
        </div>
        <div className="learn-more-item">
          <h3>Say Goodbye to Time-Consuming Custom Quiz Creation</h3>
          <p>
            Say goodbye to the traditional methods of self-testing that require the creation of custom quizzes or flashcards. SharpMind automates the quiz creation process, eliminating the time-consuming task of manually crafting quizzes. Users can now focus on studying and mastering the content rather than on the mechanics of quiz creation.
          </p>
        </div>
        <div className="learn-more-item">
          <h3>Experience a Seamless and Efficient Learning Journey</h3>
          <p>
            SharpMind aims to provide a seamless and efficient learning experience for users. By automating the quiz creation process, users can deepen their understanding of study materials through interactive and automatically generated quizzes. This intuitive approach enhances learning outcomes and makes the educational journey more enjoyable and productive.
          </p>
        </div>
      </div>
      <div className="centered-button">
        <button
          className="button-stylehp"
          onClick={handleTryForFreeClick}
        >
          {isLoggedIn ? 'Continue' : 'Try For Free'}
        </button>
      </div>
    </div>
  );
};

export default LearnMoreItem;
