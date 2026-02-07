import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load dark mode preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme === 'dark') {
      // User has previously toggled to dark mode
      setIsDarkMode(true);
      applyDarkMode(true);
    } else {
      // Default to light mode (no system preference detection)
      setIsDarkMode(false);
      applyDarkMode(false);
      // Only save to localStorage after user toggles
    }
    setIsLoading(false);
  }, []);

  const applyDarkMode = (isDark) => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      applyDarkMode(newValue);
      localStorage.setItem('theme-preference', newValue ? 'dark' : 'light');
      return newValue;
    });
  };

  const value = {
    isDarkMode,
    toggleDarkMode,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
