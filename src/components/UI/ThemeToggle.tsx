import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        theme-toggle
        ${sizeClasses[size]}
        rounded-full
        flex items-center justify-center
        focus:outline-none focus:ring-2 focus:ring-primary-orange focus:ring-offset-2
        hover:scale-105 active:scale-95
        ${className}
      `}
      aria-label={`Alternar para tema ${isDark ? 'claro' : 'escuro'}`}
      title={`Alternar para tema ${isDark ? 'claro' : 'escuro'}`}
    >
      {isDark ? (
        <Sun 
          size={iconSize[size]} 
          className="text-yellow-400 transition-all duration-300" 
        />
      ) : (
        <Moon 
          size={iconSize[size]} 
          className="text-gray-600 transition-all duration-300" 
        />
      )}
    </button>
  );
};

export default ThemeToggle;