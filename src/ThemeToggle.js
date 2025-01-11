import React, { useState, useEffect } from 'react';
import styles from './ThemeToggle.module.css'; 
import BlockchainData from './BlockchainData';

function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light'); 

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.body.classList.toggle('light-theme', theme === 'light');
    document.body.classList.toggle('dark-theme', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={styles.themeSelectorContiner}>
      <button
        id="theme-toggle"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        onClick={toggleTheme}
        className={styles.themeToggle}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="472.39" height="472.39" viewBox="0 0 472.39 472.39">
          <g className={styles.toggleSun}>
            <path d="M403.21,167V69.18H305.38L236.2,0,167,69.18H69.18V167L0,236.2l69.18,69.18v97.83H167l69.18,69.18,69.18-69.18h97.83V305.38l69.18-69.18Zm-167,198.17a129,129,0,1,1,129-129A129,129,0,0,1,236.2,365.19Z" />
          </g>
          <g className={styles.toggleCircle}>
            <circle className="cls-1" cx="236.2" cy="236.2" r="103.78" />
          </g>
        </svg>
      </button>
      <BlockchainData theme={theme} />
    </div>
  )
}

export default ThemeToggle;