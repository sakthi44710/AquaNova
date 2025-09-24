import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Professional Purple Theme Colors
export const themeColors = {
  light: {
    primary: '#8B5CF6', // Purple 500
    primaryDark: '#7C3AED', // Purple 600
    primaryLight: '#A78BFA', // Purple 400
    secondary: '#EC4899', // Pink 500
    accent: '#06B6D4', // Cyan 500
    background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #F1F5F9 100%)',
    cardBg: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1E293B',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    shadow: '0 4px 20px rgba(139, 92, 246, 0.1)',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  dark: {
    primary: '#A78BFA', // Purple 400
    primaryDark: '#8B5CF6', // Purple 500
    primaryLight: '#C4B5FD', // Purple 300
    secondary: '#F472B6', // Pink 400
    accent: '#22D3EE', // Cyan 400
    background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)',
    cardBg: '#1E293B',
    surface: '#334155',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    border: '#475569',
    shadow: '0 4px 20px rgba(167, 139, 250, 0.2)',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171'
  }
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Apply theme class to document body
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const currentTheme = isDarkMode ? themeColors.dark : themeColors.light;

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: currentTheme,
    // Backward compatibility
    primary: currentTheme.primary,
    secondary: currentTheme.secondary,
    background: currentTheme.background,
    text: currentTheme.text,
    textSecondary: currentTheme.textSecondary
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};