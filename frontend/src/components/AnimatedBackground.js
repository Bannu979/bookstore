import React from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = ({ theme }) => {
  return (
    <div className={`animated-background ${theme}`}>
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>
      <div className="shape shape-4"></div>
      <div className="shape shape-5"></div>
    </div>
  );
};

export default AnimatedBackground; 