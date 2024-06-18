import React, { useState, useEffect } from 'react';
import '../styles/LoadingAnimation.css';

const LoadingAnimation = () => {
  const [loadingText, setLoadingText] = useState('Loading your text');
  const loadingMessages = [
    'Loading your text',
    'Asking AI to generate quiz',
    'Asking AI to generate quiz POLITELY',
    'Receiving quiz',
    'Generating quiz',
    'Almost there'
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[index]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="wrap">
      <div className="loading">
        <div className="bounceball"></div>
        <div className="text">{loadingText}</div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
