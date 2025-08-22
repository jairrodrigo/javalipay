import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import { JavaliLogo } from '../components/UI/JavaliLogo';
import { GoalStats } from '../components/Goals/GoalStats';
import { GoalCard } from '../components/Goals/GoalCard';
import { CreateGoalModal } from '../components/Goals/CreateGoalModal';
import { GoalService } from '../services/goalService';
import { Goal } from '../types/goals';
import { goalCategories } from '../data/goalCategories';

export const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stats, setStats] = useState(GoalService.getGoalStats());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setGoals(GoalService.getGoals());
    setStats(GoalService.getGoalStats());
  };

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || goal.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'completed' && goal.isCompleted) ||
                         (statusFilter === 'active' && !goal.isCompleted);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 min-h-screen bg-neutral-black">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 primary-gradient rounded-lg flex items-center justify-center">
            <JavaliLogo size={20} color="white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-neon">Objetivos JavaliPay</h1>
            <p className="text-neutral-light">Guarde dinheiro e alcance suas metas financeiras</p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="primary-gradient text-neutral-black px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2 font-semibold"
        >
          <Plus size={20} />
          <span>Novo Objetivo</span>
        </button>
      </div>

      {/* Statistics */}
      <GoalStats stats={stats} />

      {/* Filters */}
      <div className="card-gradient p-4 rounded-xl shadow-lg border border-neutral-black">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-light" size={20} />
            <input
              type="text"
              placeholder="Buscar objetivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-black border border-neutral-gray rounded-lg focus:ring-2 focus:ring-primary-neon text-neutral-light placeholder-neutral-light"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-neutral-black border border-neutral-gray rounded-lg text-neutral-light focus:ring-2 focus:ring-primary-neon"
            >
              <option value="all">Todas Categorias</option>
              {goalCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-neutral-black border border-neutral-gray rounded-lg text-neutral-light focus:ring-2 focus:ring-primary-neon"
            >
              <option value="all">Todos Status</option>
              <option value="active">Ativos</option>
              <option value="completed">Concluídos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      {filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map(goal => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onUpdate={loadData}
            />
          ))}
        </div>
      ) : (
        <div className="card-gradient p-12 rounded-xl shadow-lg border border-neutral-black text-center">
          <div className="w-16 h-16 primary-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <JavaliLogo size={32} color="white" />
          </div>
          <h3 className="text-xl font-semibold text-primary-neon mb-2">
            {goals.length === 0 ? 'Nenhum objetivo criado' : 'Nenhum objetivo encontrado'}
          </h3>
          <p className="text-neutral-light mb-6">
            {goals.length === 0 
              ? 'Comece criando seu primeiro objetivo financeiro para acompanhar suas metas!'
              : 'Tente ajustar os filtros para encontrar seus objetivos.'
            }
          </p>
          {goals.length === 0 && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="primary-gradient text-neutral-black px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              Criar Primeiro Objetivo
            </button>
          )}
        </div>
      )}

      {/* Create Goal Modal */}
      <CreateGoalModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onGoalCreated={loadData}
      />
    </div>
  );
};
