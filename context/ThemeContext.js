import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(prev => !prev);

  const theme = {
    isDark,
    toggleTheme,
    colors: {
      background: isDark ? '#111827' : '#F9FAFB',
      card: isDark ? '#1F2937' : '#FFFFFF',
      text: isDark ? '#F9FAFB' : '#111827',
      subtext: isDark ? '#9CA3AF' : '#6B7280',
      border: isDark ? '#374151' : '#E5E7EB',
      header: isDark ? '#1A3A20' : '#3A5A40',
      primary: '#3A5A40',
      badge: isDark ? '#2D4A33' : '#D8E8D8',
      badgeText: isDark ? '#86EFAC' : '#1A3A1A',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);