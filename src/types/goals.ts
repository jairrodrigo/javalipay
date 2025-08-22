export interface Goal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  createdDate: Date;
  category: 'personal' | 'business' | 'emergency' | 'vacation' | 'education' | 'home' | 'car' | 'other';
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  monthlyTarget?: number;
}

export interface GoalTransaction {
  id: string;
  goalId: string;
  amount: number;
  date: Date;
  description: string;
  type: 'deposit' | 'withdrawal';
}

export interface GoalStats {
  totalGoals: number;
  completedGoals: number;
  totalTargetAmount: number;
  totalSavedAmount: number;
  monthlyTargetSum: number;
  averageProgress: number;
}
