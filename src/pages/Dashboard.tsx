import React from 'react';
import { StatCard } from '../components/Dashboard/StatCard';
import { RecentTransactions } from '../components/Dashboard/RecentTransactions';
import { ExpenseChart } from '../components/Dashboard/ExpenseChart';
import { DataService } from '../services/dataService';
import { DollarSign, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';
import { JavaliLogo } from '../components/UI/JavaliLogo';

export const Dashboard: React.FC = () => {
  const summary = DataService.getFinancialSummary();
  const transactions = DataService.getTransactions();

  return (
    <div className="p-6 space-y-6 min-h-screen bg-background transition-colors duration-300">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 primary-gradient rounded-lg flex items-center justify-center">
          <JavaliLogo size={20} color="white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary-orange">Dashboard JavaliPay</h1>
          <p className="text-text-secondary">Visão geral das suas finanças pessoais e empresariais</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Saldo Total"
          value={`R$ ${summary.balance.toFixed(2)}`}
          change={summary.monthlyChange}
          icon={DollarSign}
          color="primary-gradient"
        />
        <StatCard
          title="Receitas"
          value={`R$ ${summary.totalIncome.toFixed(2)}`}
          change={8.2}
          icon={TrendingUp}
          color="primary-gradient"
        />
        <StatCard
          title="Despesas"
          value={`R$ ${summary.totalExpenses.toFixed(2)}`}
          change={-3.1}
          icon={TrendingDown}
          color="secondary-gradient"
        />
        <StatCard
          title="Transações"
          value={transactions.length.toString()}
          change={15.3}
          icon={CreditCard}
          color="secondary-gradient"
        />
      </div>

      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart data={summary.topCategories} />
        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  );
};
