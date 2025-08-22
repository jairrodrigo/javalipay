import { faker } from '@faker-js/faker';
import { Goal, GoalTransaction, GoalStats } from '../types/goals';
import { goalCategories } from '../data/goalCategories';

export class GoalService {
  private static goals: Goal[] = [];
  private static transactions: GoalTransaction[] = [];

  static {
    this.generateMockData();
  }

  static generateMockData(): void {
    const goals: Goal[] = [];
    
    // Gerar alguns objetivos de exemplo
    for (let i = 0; i < 6; i++) {
      const category = goalCategories[Math.floor(Math.random() * goalCategories.length)];
      const targetAmount = parseFloat((Math.random() * 50000 + 5000).toFixed(2));
      const currentAmount = parseFloat((Math.random() * targetAmount * 0.6).toFixed(2));
      const targetDate = faker.date.future({ years: 2 });
      const createdDate = faker.date.recent({ days: 180 });
      
      const monthsRemaining = Math.max(1, Math.ceil((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)));
      const monthlyTarget = Math.ceil((targetAmount - currentAmount) / monthsRemaining);

      goals.push({
        id: faker.string.uuid(),
        name: this.generateGoalName(category.id as any),
        description: faker.lorem.sentence(),
        targetAmount,
        currentAmount,
        targetDate,
        createdDate,
        category: category.id as any,
        priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
        isCompleted: currentAmount >= targetAmount,
        monthlyTarget,
      });
    }

    this.goals = goals;
  }

  private static generateGoalName(category: string): string {
    const names: Record<string, string[]> = {
      personal: ['Reserva Pessoal', 'Independência Financeira', 'Aposentadoria'],
      business: ['Expansão do Negócio', 'Novo Equipamento', 'Capital de Giro'],
      emergency: ['Reserva de Emergência', 'Fundo de Segurança'],
      vacation: ['Viagem Europa', 'Férias Família', 'Lua de Mel'],
      education: ['MBA', 'Curso de Especialização', 'Intercâmbio'],
      home: ['Casa Própria', 'Reforma', 'Móveis Novos'],
      car: ['Carro Novo', 'Moto', 'Reforma do Carro'],
      other: ['Investimento', 'Projeto Especial', 'Hobby'],
    };
    
    const categoryNames = names[category] || names.other;
    return categoryNames[Math.floor(Math.random() * categoryNames.length)];
  }

  static getGoals(): Goal[] {
    return [...this.goals].sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      return b.createdDate.getTime() - a.createdDate.getTime();
    });
  }

  static getGoalById(id: string): Goal | undefined {
    return this.goals.find(goal => goal.id === id);
  }

  static addGoal(goalData: Omit<Goal, 'id' | 'createdDate' | 'isCompleted' | 'monthlyTarget'>): Goal {
    const monthsRemaining = Math.max(1, Math.ceil((goalData.targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)));
    const monthlyTarget = Math.ceil((goalData.targetAmount - goalData.currentAmount) / monthsRemaining);

    const newGoal: Goal = {
      ...goalData,
      id: faker.string.uuid(),
      createdDate: new Date(),
      isCompleted: goalData.currentAmount >= goalData.targetAmount,
      monthlyTarget,
    };

    this.goals.push(newGoal);
    return newGoal;
  }

  static updateGoal(id: string, updates: Partial<Goal>): Goal | null {
    const goalIndex = this.goals.findIndex(goal => goal.id === id);
    if (goalIndex === -1) return null;

    this.goals[goalIndex] = { ...this.goals[goalIndex], ...updates };
    
    // Recalcular monthlyTarget se necessário
    const goal = this.goals[goalIndex];
    if (updates.targetAmount || updates.currentAmount || updates.targetDate) {
      const monthsRemaining = Math.max(1, Math.ceil((goal.targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)));
      goal.monthlyTarget = Math.ceil((goal.targetAmount - goal.currentAmount) / monthsRemaining);
      goal.isCompleted = goal.currentAmount >= goal.targetAmount;
    }

    return goal;
  }

  static addMoneyToGoal(goalId: string, amount: number, description: string = 'Depósito'): boolean {
    const goal = this.getGoalById(goalId);
    if (!goal) return false;

    const transaction: GoalTransaction = {
      id: faker.string.uuid(),
      goalId,
      amount,
      date: new Date(),
      description,
      type: 'deposit',
    };

    this.transactions.push(transaction);
    this.updateGoal(goalId, { 
      currentAmount: goal.currentAmount + amount 
    });

    return true;
  }

  static getGoalStats(): GoalStats {
    const totalGoals = this.goals.length;
    const completedGoals = this.goals.filter(g => g.isCompleted).length;
    const totalTargetAmount = this.goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSavedAmount = this.goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const monthlyTargetSum = this.goals
      .filter(g => !g.isCompleted)
      .reduce((sum, g) => sum + (g.monthlyTarget || 0), 0);
    
    const averageProgress = totalGoals > 0 
      ? this.goals.reduce((sum, g) => sum + (g.currentAmount / g.targetAmount * 100), 0) / totalGoals 
      : 0;

    return {
      totalGoals,
      completedGoals,
      totalTargetAmount,
      totalSavedAmount,
      monthlyTargetSum,
      averageProgress,
    };
  }

  static getGoalTransactions(goalId: string): GoalTransaction[] {
    return this.transactions
      .filter(t => t.goalId === goalId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}
