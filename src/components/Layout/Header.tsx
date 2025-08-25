import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { JavaliLogo } from '../UI/JavaliLogo';
import ThemeToggle from '../UI/ThemeToggle';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="theme-card border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-text-primary transition-colors duration-300"
          >
            <Menu size={24} />
          </button>
          
          {/* Logo mini for mobile */}
          <div className="flex items-center space-x-2 lg:hidden">
            <JavaliLogo size={24} color="#ffa500" />
            <span className="font-bold text-primary-orange">JavaliPay</span>
          </div>
          
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
            <input
              type="text"
              placeholder="Buscar transações..."
              className="pl-10 pr-4 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-primary-orange text-text-primary placeholder-text-secondary w-64 transition-all duration-300"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle size="sm" />
          
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-text-primary transition-colors duration-300">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="w-8 h-8 primary-gradient rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">U</span>
          </div>
        </div>
      </div>
    </header>
  );
};
