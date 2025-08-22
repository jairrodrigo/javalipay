import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, DollarSign, Target } from 'lucide-react';
import { GoalService } from '../../services/goalService';
import { goalCategories } from '../../data/goalCategories';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalCreated: () => void;
}

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
  isOpen,
  onClose,
  onGoalCreated,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    currentAmount: '0',
    targetDate: '',
    category: 'personal' as const,
    priority: 'medium' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount || !formData.targetDate) {
      return;
    }

    GoalService.addGoal({
      name: formData.name,
      description: formData.description,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      targetDate: new Date(formData.targetDate),
      category: formData.category,
      priority: formData.priority,
    });

    onGoalCreated();
    onClose();
    setFormData({
      name: '',
      description: '',
      targetAmount: '',
      currentAmount: '0',
      targetDate: '',
      category: 'personal',
      priority: 'medium',
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-neutral-gray rounded-xl shadow-xl border border-neutral-black max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary-neon">Novo Objetivo</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-black rounded-lg transition-colors"
                >
                  <X size={20} className="text-neutral-light" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-light mb-2">
                    Nome do Objetivo *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full p-3 bg-neutral-black border border-neutral-black rounded-lg text-neutral-light focus:ring-2 focus:ring-primary-neon"
                    placeholder="Ex: Casa própria, Viagem, Emergência..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-light mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full p-3 bg-neutral-black border border-neutral-black rounded-lg text-neutral-light focus:ring-2 focus:ring-primary-neon"
                    placeholder="Descrição detalhada do objetivo..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-light mb-2">
                      <DollarSign size={16} className="inline mr-1" />
                      Valor Meta *
                    </label>
                    <input
                      type="number"
                      value={formData.targetAmount}
                      onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                      className="w-full p-3 bg-neutral-black border border-neutral-black rounded-lg text-neutral-light focus:ring-2 focus:ring-primary-neon"
                      placeholder="0.00"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-light mb-2">
                      <Target size={16} className="inline mr-1" />
                      Valor Inicial
                    </label>
                    <input
                      type="number"
                      value={formData.currentAmount}
                      onChange={(e) => handleInputChange('currentAmount', e.target.value)}
                      className="w-full p-3 bg-neutral-black border border-neutral-black rounded-lg text-neutral-light focus:ring-2 focus:ring-primary-neon"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-light mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Data Meta *
                  </label>
                  <input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => handleInputChange('targetDate', e.target.value)}
                    className="w-full p-3 bg-neutral-black border border-neutral-black rounded-lg text-neutral-light focus:ring-2 focus:ring-primary-neon"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-light mb-2">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full p-3 bg-neutral-black border border-neutral-black rounded-lg text-neutral-light focus:ring-2 focus:ring-primary-neon"
                  >
                    {goalCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-light mb-2">
                    Prioridade
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full p-3 bg-neutral-black border border-neutral-black rounded-lg text-neutral-light focus:ring-2 focus:ring-primary-neon"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 primary-gradient text-neutral-black py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    Criar Objetivo
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-neutral-black border border-neutral-gray text-neutral-light py-3 rounded-lg hover:bg-neutral-black transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
