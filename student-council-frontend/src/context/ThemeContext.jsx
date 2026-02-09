// ThemeContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import antdThemes from '../assets/antdThemes';
export const ThemeContext = createContext({
  currentTheme: 'council-classic-light',
  setCurrentTheme: () => {},
  availableThemes: Object.keys(antdThemes)
});

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('theme') || 'council-classic-light';
  });

  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  const value = {
    currentTheme,
    setCurrentTheme,
    availableThemes: Object.keys(antdThemes)
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};