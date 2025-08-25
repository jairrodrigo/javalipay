import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { categories } from '../../data/categories';
import { goalCategories } from '../../data/goalCategories';

interface ExpenseChartProps {
  data: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

const CHART_COLORS = [
  '#ffa500', // Laranja principal
  '#4f46e5', // Índigo para objetivos
  '#10b981', // Verde esmeralda
  '#f59e0b', // Âmbar
  '#ef4444', // Vermelho
  '#8b5cf6', // Violeta
  '#06b6d4', // Ciano
  '#f97316', // Laranja escuro
  '#84cc16'  // Lima
];

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ data }) => {
  // Dados de despesas
  const expenseData = data.map((item, index) => {
    const category = categories.find(c => c.id === item.category);
    return {
      name: category?.name || item.category,
      value: item.amount,
      color: CHART_COLORS[index % CHART_COLORS.length],
      type: 'expense'
    };
  });

  // Dados simulados de objetivos
  const goalData = [
    { name: 'Emergência', value: 5000, color: '#4f46e5', type: 'goal' },
    { name: 'Viagem', value: 3000, color: '#10b981', type: 'goal' },
    { name: 'Casa Própria', value: 8000, color: '#8b5cf6', type: 'goal' }
  ];

  // Combinar dados de despesas e objetivos
  const chartData = [...expenseData, ...goalData];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isGoal = data.type === 'goal';
      return (
        <div className="glass-card p-3 rounded-lg">
          <p className="text-text-primary font-medium">{data.name}</p>
          <p className="text-text-secondary text-xs mb-1">
            {isGoal ? '🎯 Objetivo' : '💰 Despesa'}
          </p>
          <p className="text-text-secondary">
            <span className="text-primary-orange font-semibold">R$ {payload[0].value.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => {
          const data = chartData.find(item => item.name === entry.value);
          const isGoal = data?.type === 'goal';
          return (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-text-secondary text-sm">
                {isGoal ? '🎯' : '💰'} {entry.value}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="glass-card p-6 rounded-xl transition-colors duration-300">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Despesas e Objetivos</h3>
      
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-text-secondary">Gráfico de despesas e objetivos</p>
          <div className="mt-4 space-y-2">
            {chartData.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-text-secondary text-sm">{item.name}</span>
                </div>
                <span className="text-primary-orange font-semibold">R$ {item.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
