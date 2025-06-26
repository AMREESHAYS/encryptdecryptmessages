import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, PremiumTheme } from '@/types';

interface ThemeContextType {
  theme: Theme;
  premiumTheme: PremiumTheme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  setPremiumTheme: (theme: PremiumTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'system';
  });

  const [premiumTheme, setPremiumTheme] = useState<PremiumTheme>(() => {
    const saved = localStorage.getItem('premiumTheme');
    return (saved as PremiumTheme) || 'gradient';
  });

  const [isDark, setIsDark] = useState(false);

  // Update isDark based on theme and system preference
  useEffect(() => {
    const updateIsDark = () => {
      if (theme === 'system') {
        setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      } else {
        setIsDark(theme === 'dark');
      }
    };

    updateIsDark();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateIsDark);
      return () => mediaQuery.removeEventListener('change', updateIsDark);
    }
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply premium theme classes
    root.classList.remove('theme-gradient', 'theme-neon', 'theme-minimal');
    root.classList.add(`theme-${premiumTheme}`);
  }, [isDark, premiumTheme]);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('premiumTheme', premiumTheme);
  }, [premiumTheme]);

  const toggleTheme = () => {
    setTheme(current => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'system';
      return 'light';
    });
  };

  const value: ThemeContextType = {
    theme,
    premiumTheme,
    isDark,
    setTheme,
    setPremiumTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}