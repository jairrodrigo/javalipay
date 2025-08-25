import React, { useState } from 'react';
import { Goal } from '../../types/goals';
import { goalCategories } from '../../data/goalCategories';
import { motion } from 'framer-motion';
import { Calendar, Target, TrendingUp, Plus, Check } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { GoalService } from '../../services/goalService';

interface GoalCardProps {
  goal: Goal;
  onUpdate: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onUpdate }) => {
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState('');

  const category = goalCategories.find(c => c.id === goal.category);
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  const daysRemaining = Math.ceil((goal.targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const handleAddMoney = () => {
    const value = parseFloat(amount);
    if (value > 0) {
      GoalService.addMoneyToGoal(goal.id, value, `Depósito de R$ ${value.toFixed(2)}`);
      setAmount('');
      setShowAddMoney(false);
      onUpdate();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-secondary-red';
      case 'medium': return 'text-accent-cyan';
      default: return 'text-neutral-light';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card-gradient p-6 rounded-xl shadow-lg border border-neutral-black ${
        goal.isCompleted ? 'border-primary-neon bg-opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: category?.color }}
          >
            {category?.icon}
          </div>
          <div>
            <h3 className="font-semibold text-primary-neon">{goal.name}</h3>
            <p className="text-sm text-neutral-light">{goal.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(goal.priority)} bg-opacity-20`}>
            {goal.priority}
          </span>
          {goal.isCompleted && (
            <div className="w-6 h-6 bg-primary-neon rounded-full flex items-center justify-center">
              <Check size={14} className="text-neutral-black" />
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-neutral-light">Progresso</span>
          <span className="text-primary-neon font-semibold">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-neutral-black rounded-full h-3">
          <div 
            className="primary-gradient h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-neutral-light">Atual</p>
          <p className="text-lg font-semibold text-primary-neon">
            R$ {goal.currentAmount.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-neutral-light">Meta</p>
          <p className="text-lg font-semibold text-neutral-light">
            R$ {goal.targetAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Target size={14} className="text-neutral-light" />
            <span className="text-neutral-light">Faltam</span>
          </div>
          <span className="text-secondary-red font-semibold">
            R$ {remaining.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Calendar size={14} className="text-neutral-light" />
            <span className="text-neutral-light">Prazo</span>
          </div>
          <span className={`font-semibold ${daysRemaining < 30 ? 'text-secondary-red' : 'text-neutral-light'}`}>
            {format(goal.targetDate, "dd/MM/yyyy", { locale: ptBR })}
          </span>
        </div>

        {goal.monthlyTarget && !goal.isCompleted && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <TrendingUp size={14} className="text-neutral-light" />
              <span className="text-neutral-light">Por mês</span>
            </div>
            <span className="text-accent-cyan font-semibold">
              R$ {goal.monthlyTarget.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Add Money Section */}
      {!goal.isCompleted && (
        <div className="border-t border-neutral-black pt-4">
          {!showAddMoney ? (
            <button
              onClick={() => setShowAddMoney(true)}
              className="w-full flex items-center justify-center space-x-2 primary-gradient text-neutral-black py-2 rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              <Plus size={16} />
              <span>Adicionar Dinheiro</span>
            </button>
          ) : (
            <div className="space-y-3">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Valor a adicionar"
                className="w-full p-2 bg-neutral-black border border-neutral-gray rounded-lg text-neutral-light focus:ring-2 focus:ring-primary-neon"
                step="0.01"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleAddMoney}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="flex-1 primary-gradient text-neutral-black py-2 rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setShowAddMoney(false)}
                  className="flex-1 bg-neutral-black border border-neutral-gray text-neutral-light py-2 rounded-lg hover:bg-neutral-gray transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
