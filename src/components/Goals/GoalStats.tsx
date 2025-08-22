import React from 'react';
import { GoalStats as GoalStatsType } from '../../types/goals';
import { Target, TrendingUp, CheckCircle, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface GoalStatsProps {
  stats: GoalStatsType;
}

export const GoalStats: React.FC<GoalStatsProps> = ({ stats }) => {
  const statsData = [
    {
      title: 'Total de Objetivos',
      value: stats.totalGoals.toString(),
      change: '+12.5%',
      icon: Target,
      color: 'accent-gradient',
    },
    {
      title: 'Objetivos Concluídos',
      value: stats.completedGoals.toString(),
      change: `${stats.totalGoals > 0 ? ((stats.completedGoals / stats.totalGoals) * 100).toFixed(1) : 0}%`,
      icon: CheckCircle,
      color: 'primary-gradient',
    },
    {
      title: 'Total Economizado',
      value: `R$ ${stats.totalSavedAmount.toFixed(2)}`,
      change: '+8.3%',
      icon: DollarSign,
      color: 'primary-gradient',
    },
    {
      title: 'Meta Mensal',
      value: `R$ ${stats.monthlyTargetSum.toFixed(2)}`,
      change: `${stats.averageProgress.toFixed(1)}% concluído`,
      icon: TrendingUp,
      color: 'accent-gradient',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card-gradient p-6 rounded-xl shadow-lg border border-neutral-black"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-light">{stat.title}</p>
              <p className="text-2xl font-bold text-primary-neon mt-1">{stat.value}</p>
              <div className="flex items-center mt-2 text-sm text-accent-cyan">
                <span>{stat.change}</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon size={24} className="text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
