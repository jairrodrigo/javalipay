import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { categories } from '../../data/categories';

interface ExpenseChartProps {
  data: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

const CHART_COLORS = ['#00FF88', '#FF4D6D', '#1E90FF', '#FFD700', '#FF6B35', '#6A4C93', '#F72585'];

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ data }) => {
  const chartData = data.map((item, index) => {
    const category = categories.find(c => c.id === item.category);
    return {
      name: category?.name || item.category,
      value: item.amount,
      color: CHART_COLORS[index % CHART_COLORS.length],
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-gray p-3 rounded-lg border border-neutral-black shadow-lg">
          <p className="text-primary-neon font-medium">{label}</p>
          <p className="text-neutral-light">
            <span className="text-primary-neon">R$ {payload[0].value.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-gradient p-6 rounded-xl shadow-lg border border-neutral-black">
      <h3 className="text-lg font-semibold text-primary-neon mb-4">Gastos por Categoria</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                color: '#E5E5E5',
                fontSize: '14px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
