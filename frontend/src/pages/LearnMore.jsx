import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const navigate = useNavigate();

const LearnMore = ({ handleLogout, isLoggedIn }) => {
  const history = useHistory();

  return (
    <div className="learn-more-page">
      <div className="header">
        <button className="button-stylehp" onClick={() => history.push('/')}>Home</button>
        {isLoggedIn && (
          <button className="button-stylehp" onClick={handleLogout}>Logout</button>
        )}
      </div>
      <img src={logo} alt="Logo" className="logo" />
      <h1>Welcome to SharpMind</h1>
      {/* Add Learn More content here */}
    </div>
  );
};

export default LearnMore;
