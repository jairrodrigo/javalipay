export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  establishment?: string;
  category: string;
  type: 'income' | 'expense';
  paymentMethod?: string;
  receipt?: string;
  isRecurring?: boolean;
  tags?: string[];
  confidence?: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: 'income' | 'expense' | 'both';
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyChange: number;
  topCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

export interface AIAnalysis {
  extractedData: {
    amount?: number;
    date?: Date;
    establishment?: string;
    category?: string;
    type?: 'income' | 'expense';
  };
  confidence: number;
  suggestions: string[];
}
