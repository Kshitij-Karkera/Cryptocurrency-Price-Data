import React from 'react';
import './LoadingAnimation.css';

const LoadingAnimation = () => {
  return (
    <div className="blockchain-container" aria-hidden="true"> 
      <div className="cube">
        <div className="cube-face front" />
        <div className="cube-face back" />
        <div className="cube-face left" />
        <div className="cube-face right" />
        <div className="cube-face top" />
        <div className="cube-face bottom" />
      </div>
    </div>
  );
};

export default LoadingAnimation; 
