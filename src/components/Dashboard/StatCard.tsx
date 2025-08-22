import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-gradient p-6 rounded-xl shadow-lg border border-neutral-black"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-light">{title}</p>
          <p className="text-2xl font-bold text-primary-neon mt-1">{value}</p>
          <div className={`flex items-center mt-2 text-sm ${
            isPositive ? 'text-primary-neon' : 'text-secondary-red'
          }`}>
            <span>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
            <span className="text-neutral-light ml-1">vs mês anterior</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
};
