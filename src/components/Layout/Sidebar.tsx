import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Camera, 
  PieChart, 
  MessageCircle, 
  Settings, 
  Receipt,
  TrendingUp,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { JavaliLogo } from '../UI/JavaliLogo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Capturar', href: '/capture', icon: Camera },
  { name: 'Objetivos', href: '/goals', icon: Target },
  { name: 'Transações', href: '/transactions', icon: Receipt },
  { name: 'Relatórios', href: '/reports', icon: PieChart },
  { name: 'Insights', href: '/insights', icon: TrendingUp },
  { name: 'Chat IA', href: '/chat', icon: MessageCircle },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-72 bg-neutral-gray shadow-xl z-30 lg:relative lg:translate-x-0 lg:shadow-none border-r border-neutral-black"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-neutral-black">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 primary-gradient rounded-xl flex items-center justify-center shadow-lg">
                <JavaliLogo size={28} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-neon">JavaliPay</h1>
                <p className="text-sm text-neutral-light">Gestão Inteligente</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'primary-gradient text-neutral-black shadow-lg'
                          : 'text-neutral-light hover:bg-neutral-black hover:text-primary-neon'
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info */}
          <div className="p-6 border-t border-neutral-black">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 accent-gradient rounded-full flex items-center justify-center">
                <span className="text-white font-medium">U</span>
              </div>
              <div>
                <p className="font-medium text-primary-neon">Usuário</p>
                <p className="text-sm text-neutral-light">usuario@email.com</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
