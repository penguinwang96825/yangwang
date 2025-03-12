import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

const useTheme = () => {
  // Check if user has already set a theme preference
  const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined') {
      // Check localStorage
      const storedTheme = window.localStorage.getItem('theme') as Theme | null;
      if (storedTheme) {
        return storedTheme;
      }

      // Check user preference
      const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (userPrefersDark) {
        return 'dark';
      }
    }
    
    // Default to light
    return 'light';
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Update the DOM when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};

export default useTheme; 