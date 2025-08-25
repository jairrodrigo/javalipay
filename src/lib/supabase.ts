import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Configuração do Supabase não encontrada. Verifique as variáveis de ambiente.');
  console.warn('📝 Certifique-se de configurar REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_ANON_KEY no arquivo .env');
}

// Criar cliente do Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Tipos para as tabelas do banco de dados
export interface UserConversation {
  id?: string;
  user_id: string;
  session_id: string;
  user_message: string;
  ai_response: string;
  context_used?: any;
  created_at?: string;
  updated_at?: string;
}

export interface UserPreferences {
  id?: string;
  user_id: string;
  profile_type?: string;
  monthly_budget?: number;
  financial_goals?: string[];
  preferred_categories?: string[];
  notification_settings?: any;
  created_at?: string;
  updated_at?: string;
}

export interface UserFinancialContext {
  id?: string;
  user_id: string;
  context_type: 'income' | 'expense' | 'goal' | 'budget';
  amount?: number;
  category?: string;
  description?: string;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
}

// Função para verificar a conexão com o Supabase
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('user_conversations').select('count').limit(1);
    if (error) {
      console.error('❌ Erro na conexão com Supabase:', error.message);
      return false;
    }
    console.log('✅ Conexão com Supabase estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Falha na verificação da conexão:', error);
    return false;
  }
};

// Função para obter ou criar um ID de usuário (simulado para desenvolvimento)
export const getCurrentUserId = (): string => {
  let userId = localStorage.getItem('javalipay_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('javalipay_user_id', userId);
    console.log('🆔 Novo ID de usuário criado:', userId);
  }
  return userId;
};

// Função para obter ou criar um ID de sessão
export const getCurrentSessionId = (): string => {
  let sessionId = sessionStorage.getItem('javalipay_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('javalipay_session_id', sessionId);
    console.log('🔄 Nova sessão criada:', sessionId);
  }
  return sessionId;
};

export default supabase;