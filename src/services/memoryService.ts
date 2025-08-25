import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos para o sistema de memória
export interface UserConversation {
  id?: string;
  user_id: string;
  session_id: string;
  conversation_type: 'chat' | 'financial_advice' | 'goal_planning';
  title?: string;
  content: any;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
}

export interface UserPreferences {
  id?: string;
  user_id: string;
  financial_goals?: any;
  spending_categories?: any;
  notification_settings?: any;
  ai_personality?: any;
  created_at?: string;
  updated_at?: string;
}

export interface UserFinancialContext {
  id?: string;
  user_id: string;
  context_type: 'income' | 'expense' | 'goal' | 'insight';
  category?: string;
  amount?: number;
  description?: string;
  date_recorded?: string;
  metadata?: any;
  created_at?: string;
}

// Classe principal do serviço de memória
export class MemoryService {
  private static instance: MemoryService;
  private currentUserId: string = 'default_user'; // Em produção, vem da autenticação
  private currentSessionId: string = this.generateSessionId();

  private constructor() {}

  public static getInstance(): MemoryService {
    if (!MemoryService.instance) {
      MemoryService.instance = new MemoryService();
    }
    return MemoryService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Métodos para conversas
  async saveConversation(conversation: Omit<UserConversation, 'id' | 'user_id' | 'session_id'>): Promise<UserConversation | null> {
    try {
      const { data, error } = await supabase
        .from('user_conversations')
        .insert({
          ...conversation,
          user_id: this.currentUserId,
          session_id: this.currentSessionId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao salvar conversa:', error);
      return null;
    }
  }

  async getConversations(type?: string, limit: number = 50): Promise<UserConversation[]> {
    try {
      let query = supabase
        .from('user_conversations')
        .select('*')
        .eq('user_id', this.currentUserId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (type) {
        query = query.eq('conversation_type', type);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      return [];
    }
  }

  async getConversationsBySession(sessionId: string): Promise<UserConversation[]> {
    try {
      const { data, error } = await supabase
        .from('user_conversations')
        .select('*')
        .eq('user_id', this.currentUserId)
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar conversas da sessão:', error);
      return [];
    }
  }

  // Métodos para preferências do usuário
  async saveUserPreferences(preferences: Omit<UserPreferences, 'id' | 'user_id'>): Promise<UserPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          ...preferences,
          user_id: this.currentUserId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      return null;
    }
  }

  async getUserPreferences(): Promise<UserPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', this.currentUserId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = não encontrado
      return data;
    } catch (error) {
      console.error('Erro ao buscar preferências:', error);
      return null;
    }
  }

  // Métodos para contexto financeiro
  async saveFinancialContext(context: Omit<UserFinancialContext, 'id' | 'user_id'>): Promise<UserFinancialContext | null> {
    try {
      const { data, error } = await supabase
        .from('user_financial_context')
        .insert({
          ...context,
          user_id: this.currentUserId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao salvar contexto financeiro:', error);
      return null;
    }
  }

  async getFinancialContext(type?: string, limit: number = 100): Promise<UserFinancialContext[]> {
    try {
      let query = supabase
        .from('user_financial_context')
        .select('*')
        .eq('user_id', this.currentUserId)
        .order('date_recorded', { ascending: false })
        .limit(limit);

      if (type) {
        query = query.eq('context_type', type);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar contexto financeiro:', error);
      return [];
    }
  }

  async getFinancialSummary(): Promise<any> {
    try {
      const expenses = await this.getFinancialContext('expense', 30);
      const income = await this.getFinancialContext('income', 30);
      const goals = await this.getFinancialContext('goal', 10);

      const totalExpenses = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
      const totalIncome = income.reduce((sum, item) => sum + (item.amount || 0), 0);

      return {
        totalExpenses,
        totalIncome,
        balance: totalIncome - totalExpenses,
        expensesByCategory: this.groupByCategory(expenses),
        incomeByCategory: this.groupByCategory(income),
        activeGoals: goals.length,
        recentTransactions: [...expenses, ...income]
          .sort((a, b) => new Date(b.date_recorded || '').getTime() - new Date(a.date_recorded || '').getTime())
          .slice(0, 10)
      };
    } catch (error) {
      console.error('Erro ao gerar resumo financeiro:', error);
      return null;
    }
  }

  private groupByCategory(items: UserFinancialContext[]): Record<string, number> {
    return items.reduce((acc, item) => {
      const category = item.category || 'Outros';
      acc[category] = (acc[category] || 0) + (item.amount || 0);
      return acc;
    }, {} as Record<string, number>);
  }

  // Métodos utilitários
  setUserId(userId: string): void {
    this.currentUserId = userId;
  }

  getCurrentUserId(): string {
    return this.currentUserId;
  }

  getCurrentSessionId(): string {
    return this.currentSessionId;
  }

  startNewSession(): string {
    this.currentSessionId = this.generateSessionId();
    return this.currentSessionId;
  }

  // Método para buscar contexto relevante para IA
  async getRelevantContext(query: string, limit: number = 10): Promise<any> {
    try {
      // Busca conversas recentes
      const recentConversations = await this.getConversations(undefined, 5);
      
      // Busca contexto financeiro recente
      const financialContext = await this.getFinancialContext(undefined, 20);
      
      // Busca preferências do usuário
      const preferences = await this.getUserPreferences();
      
      return {
        recentConversations,
        financialContext,
        preferences,
        query,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro ao buscar contexto relevante:', error);
      return null;
    }
  }
}

// Exporta instância singleton
export const memoryService = MemoryService.getInstance();
export default memoryService;