import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/HomePage.css';
import axios from 'axios';

const Home = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acctType, setAcctType] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const loginPayload = {
      email: loginEmail,
      password: loginPassword,
    };

    console.log('Login Payload:', loginPayload);
    
    try {
      const response = await axios.post('http://localhost:5001/api/users/login', loginPayload);
      const userData = response.data;
      console.log('User Data:', userData);
      
      if (userData) {
        localStorage.setItem('loggedInUser', JSON.stringify(userData));
        setIsLoggedIn(true);
        navigate('/load-reviewer');
      } else {
        setErrorMessage('Wrong email address or password!');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred during login. Please try again.');
    }
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleLearnMoreClick = () => {
    navigate('/learnMoreItem');
  };

  return (
    <div className="home-page">
      <div className="header">
        {isLoggedIn && (
          <button className="button-stylehp" onClick={handleLogout}>Logout</button>
        )}
        <img src={logo} alt="Logo" className="logo" />
        <h2>Welcome to SharpMind</h2>
      </div>
      
      <div className="buttons">
        <button className="button-stylehp" onClick={() => navigate('/signup')}>Sign Up</button>
        {!showLogin && <button className="button-stylehp" onClick={handleLoginClick}>Login</button>}
      </div>

      {showLogin && (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <button className="button-stylehp" type="submit">Login</button>
          </form>
        </div>
      )}
      <div className="content-container">
        <div className="description">
          <p>
            SharpMind is an innovative educational application designed to enhance learning and comprehension through interactive quizzes generated from user-uploaded text from documents, PDFs, PowerPoint and slides, or video presentations.
          </p>
          <p>
            Say goodbye to the traditional methods of self-testing that are not only time-consuming but often require the creation of custom quizzes or flashcards.
          </p>
          <p>
            SharpMind aims to solve this problem by automating the quiz creation process, allowing users to focus on learning and understanding rather than on the mechanics of creating study aids.
          </p>
          <p>
            SharpMind aims to provide a seamless and efficient learning experience, enabling users to deepen their understanding of study materials through interactive and automatically generated quizzes.
          </p>
        </div>
      </div>
      {errorMessage && <p>{errorMessage}</p>}
      <div className="learn-more">
        <button className="button-stylehp" onClick={handleLearnMoreClick}>Learn More</button>
      </div>
    </div>
  );
};

export default Home;
