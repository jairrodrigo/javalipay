import { Category } from '../types/financial';

export const categories: Category[] = [
  // Despesas
  { id: 'food', name: 'Alimentação', color: '#FF6B6B', icon: '🍽️', type: 'expense' },
  { id: 'transport', name: 'Transporte', color: '#4ECDC4', icon: '🚗', type: 'expense' },
  { id: 'health', name: 'Saúde', color: '#45B7D1', icon: '🏥', type: 'expense' },
  { id: 'entertainment', name: 'Entretenimento', color: '#96CEB4', icon: '🎮', type: 'expense' },
  { id: 'shopping', name: 'Compras', color: '#FECA57', icon: '🛍️', type: 'expense' },
  { id: 'bills', name: 'Contas', color: '#FF9FF3', icon: '📋', type: 'expense' },
  { id: 'education', name: 'Educação', color: '#A8E6CF', icon: '📚', type: 'expense' },
  { id: 'rent', name: 'Aluguel', color: '#FFB347', icon: '🏠', type: 'expense' },
  
  // Receitas
  { id: 'salary', name: 'Salário', color: '#68D391', icon: '💰', type: 'income' },
  { id: 'freelance', name: 'Freelance', color: '#81E6D9', icon: '💻', type: 'income' },
  { id: 'investment', name: 'Investimentos', color: '#90CDF4', icon: '📈', type: 'income' },
  { id: 'bonus', name: 'Bônus', color: '#F6AD55', icon: '🎁', type: 'income' },
  { id: 'refund', name: 'Reembolso', color: '#B794F6', icon: '💸', type: 'income' },
];
