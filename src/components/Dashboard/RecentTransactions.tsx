import React from 'react';
import { Transaction } from '../../types/financial';
import { categories } from '../../data/categories';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const recent = transactions.slice(0, 5);

  return (
    <div className="card-gradient p-6 rounded-xl shadow-lg border border-neutral-black">
      <h3 className="text-lg font-semibold text-primary-neon mb-4">Transações Recentes</h3>
      
      <div className="space-y-4">
        {recent.map((transaction, index) => {
          const category = categories.find(c => c.id === transaction.category);
          return (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-black transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{category?.icon}</div>
                <div>
                  <p className="font-medium text-neutral-light">{transaction.description}</p>
                  <p className="text-sm text-neutral-light opacity-70">
                    {format(transaction.date, "dd 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-primary-neon' : 'text-secondary-red'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                </p>
                <p className="text-sm text-neutral-light opacity-70">{category?.name}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
