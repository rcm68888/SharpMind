import React, { useState } from 'react';
import HomeDefault from './pages/Home';
import LearnMoreItem from './pages/LearnMoreItem';
import LoadReviewer from './pages/LoadReviewer';

const HomePage = ({ isLoggedIn, handleLogout, content: initialContent = 'default' }) => {
  const [content, setContent] = useState(initialContent);

  return (
    <div className="home-page">
      {content === 'default' && <HomeDefault handleLogout={handleLogout} isLoggedIn={isLoggedIn} />}
      {content === 'learn_more_item' && <LearnMoreItem handleLogout={handleLogout} isLoggedIn={isLoggedIn} />}
      {content === 'load-reviewer' && <LoadReviewer handleLogout={handleLogout} isLoggedIn={isLoggedIn} />}
    </div>
  );
};

export default HomePage;
