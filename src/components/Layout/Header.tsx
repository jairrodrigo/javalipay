import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { JavaliLogo } from '../UI/JavaliLogo';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-neutral-gray shadow-sm border-b border-neutral-black px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-black text-neutral-light"
          >
            <Menu size={24} />
          </button>
          
          {/* Logo mini for mobile */}
          <div className="flex items-center space-x-2 lg:hidden">
            <JavaliLogo size={24} color="#00FF88" />
            <span className="font-bold text-primary-neon">JavaliPay</span>
          </div>
          
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-light" size={20} />
            <input
              type="text"
              placeholder="Buscar transações..."
              className="pl-10 pr-4 py-2 bg-neutral-black border border-neutral-black rounded-lg focus:ring-2 focus:ring-primary-neon focus:border-primary-neon text-neutral-light placeholder-neutral-light w-64"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-lg hover:bg-neutral-black text-neutral-light">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-secondary-red rounded-full"></span>
          </button>
          
          <div className="w-8 h-8 primary-gradient rounded-full flex items-center justify-center">
            <span className="text-neutral-black font-semibold text-sm">U</span>
          </div>
        </div>
      </div>
    </header>
  );
};
