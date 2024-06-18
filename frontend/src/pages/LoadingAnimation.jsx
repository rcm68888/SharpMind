import React from 'react';
import '../styles/LoadingAnimation.css';

const LoadingAnimation = () => {
  return (
    <div className="wrap">
      <div className="loading">
      <div className="text">LOADING QUIZ</div>
        <div className="bounceball"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
