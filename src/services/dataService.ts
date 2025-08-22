import { faker } from '@faker-js/faker';
import { Transaction, FinancialSummary } from '../types/financial';
import { categories } from '../data/categories';

export class DataService {
  private static transactions: Transaction[] = [];

  static {
    // Gerar dados mock iniciais
    this.generateMockData();
  }

  static generateMockData(): void {
    const transactions: Transaction[] = [];
    
    for (let i = 0; i < 50; i++) {
      const isIncome = Math.random() > 0.7;
      const category = categories.find(c => 
        isIncome ? (c.type === 'income' || c.type === 'both') : (c.type === 'expense' || c.type === 'both')
      ) || categories[0];

      transactions.push({
        id: faker.string.uuid(),
        amount: parseFloat((Math.random() * (isIncome ? 3000 : 500) + (isIncome ? 500 : 10)).toFixed(2)),
        date: faker.date.recent({ days: 90 }),
        description: faker.commerce.productName(),
        establishment: faker.company.name(),
        category: category.id,
        type: isIncome ? 'income' : 'expense',
        paymentMethod: faker.helpers.arrayElement(['credit', 'debit', 'cash', 'pix']),
        isRecurring: Math.random() > 0.8,
        confidence: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)),
      });
    }

    this.transactions = transactions;
  }

  static getTransactions(): Transaction[] {
    return [...this.transactions].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  static addTransaction(transaction: Omit<Transaction, 'id'>): Transaction {
    const newTransaction: Transaction = {
      ...transaction,
      id: faker.string.uuid(),
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  static getFinancialSummary(): FinancialSummary {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = this.transactions.filter(t => 
      t.date.getMonth() === currentMonth && t.date.getFullYear() === currentYear
    );

    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryTotals = monthlyTransactions.reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = 0;
      acc[t.category] += t.amount;
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / (totalIncome + totalExpenses)) * 100,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      monthlyChange: Math.random() * 20 - 10, // Mock
      topCategories,
    };
  }
}
