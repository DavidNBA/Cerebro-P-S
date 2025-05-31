"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-gray-700 text-sm text-gray-300 hover:text-white transition-colors duration-200"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        // Simple text, could be an icon (e.g., Moon icon)
        <span>Modo Oscuro</span>
      ) : (
        // Simple text, could be an icon (e.g., Sun icon)
        <span>Modo Claro</span>
      )}
    </button>
  );
};

export default ThemeSwitcher;
