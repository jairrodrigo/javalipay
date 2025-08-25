import { useState, useEffect, useCallback } from 'react';
import { memoryService, UserConversation, UserPreferences, UserFinancialContext } from '../services/memoryService';

// Hook para gerenciar conversas
export const useConversations = (type?: string) => {
  const [conversations, setConversations] = useState<UserConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await memoryService.getConversations(type);
      setConversations(data);
    } catch (err) {
      setError('Erro ao carregar conversas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  const saveConversation = useCallback(async (conversation: Omit<UserConversation, 'id' | 'user_id' | 'session_id'>) => {
    try {
      const saved = await memoryService.saveConversation(conversation);
      if (saved) {
        setConversations(prev => [saved, ...prev]);
        return saved;
      }
    } catch (err) {
      setError('Erro ao salvar conversa');
      console.error(err);
    }
    return null;
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    loading,
    error,
    saveConversation,
    refreshConversations: loadConversations
  };
};

// Hook para gerenciar preferências do usuário
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPreferences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await memoryService.getUserPreferences();
      setPreferences(data);
    } catch (err) {
      setError('Erro ao carregar preferências');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const savePreferences = useCallback(async (newPreferences: Omit<UserPreferences, 'id' | 'user_id'>) => {
    try {
      const saved = await memoryService.saveUserPreferences(newPreferences);
      if (saved) {
        setPreferences(saved);
        return saved;
      }
    } catch (err) {
      setError('Erro ao salvar preferências');
      console.error(err);
    }
    return null;
  }, []);

  const updatePreferences = useCallback(async (updates: Partial<Omit<UserPreferences, 'id' | 'user_id'>>) => {
    if (!preferences) return null;
    
    const updatedPreferences = {
      ...preferences,
      ...updates
    };
    
    return await savePreferences(updatedPreferences);
  }, [preferences, savePreferences]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return {
    preferences,
    loading,
    error,
    savePreferences,
    updatePreferences,
    refreshPreferences: loadPreferences
  };
};

// Hook para gerenciar contexto financeiro
export const useFinancialContext = (type?: string) => {
  const [financialData, setFinancialData] = useState<UserFinancialContext[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFinancialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await memoryService.getFinancialContext(type);
      setFinancialData(data);
      
      // Carrega resumo apenas se não há filtro de tipo
      if (!type) {
        const summaryData = await memoryService.getFinancialSummary();
        setSummary(summaryData);
      }
    } catch (err) {
      setError('Erro ao carregar dados financeiros');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  const saveFinancialData = useCallback(async (data: Omit<UserFinancialContext, 'id' | 'user_id'>) => {
    try {
      const saved = await memoryService.saveFinancialContext(data);
      if (saved) {
        setFinancialData(prev => [saved, ...prev]);
        // Recarrega o resumo após adicionar novo dado
        if (!type) {
          const summaryData = await memoryService.getFinancialSummary();
          setSummary(summaryData);
        }
        return saved;
      }
    } catch (err) {
      setError('Erro ao salvar dados financeiros');
      console.error(err);
    }
    return null;
  }, [type]);

  useEffect(() => {
    loadFinancialData();
  }, [loadFinancialData]);

  return {
    financialData,
    summary,
    loading,
    error,
    saveFinancialData,
    refreshFinancialData: loadFinancialData
  };
};

// Hook para contexto relevante para IA
export const useAIContext = () => {
  const [context, setContext] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRelevantContext = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const contextData = await memoryService.getRelevantContext(query);
      setContext(contextData);
      return contextData;
    } catch (err) {
      setError('Erro ao buscar contexto relevante');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    context,
    loading,
    error,
    getRelevantContext
  };
};

// Hook principal que combina todas as funcionalidades
export const useMemory = () => {
  const conversations = useConversations();
  const preferences = useUserPreferences();
  const financialContext = useFinancialContext();
  const aiContext = useAIContext();

  const startNewSession = useCallback(() => {
    return memoryService.startNewSession();
  }, []);

  const getCurrentUserId = useCallback(() => {
    return memoryService.getCurrentUserId();
  }, []);

  const getCurrentSessionId = useCallback(() => {
    return memoryService.getCurrentSessionId();
  }, []);

  const setUserId = useCallback((userId: string) => {
    memoryService.setUserId(userId);
    // Recarrega todos os dados para o novo usuário
    conversations.refreshConversations();
    preferences.refreshPreferences();
    financialContext.refreshFinancialData();
  }, [conversations, preferences, financialContext]);

  return {
    // Conversas
    conversations: conversations.conversations,
    saveConversation: conversations.saveConversation,
    refreshConversations: conversations.refreshConversations,
    
    // Preferências
    preferences: preferences.preferences,
    savePreferences: preferences.savePreferences,
    updatePreferences: preferences.updatePreferences,
    
    // Contexto financeiro
    financialData: financialContext.financialData,
    financialSummary: financialContext.summary,
    saveFinancialData: financialContext.saveFinancialData,
    
    // Contexto para IA
    getRelevantContext: aiContext.getRelevantContext,
    aiContext: aiContext.context,
    
    // Utilitários
    startNewSession,
    getCurrentUserId,
    getCurrentSessionId,
    setUserId,
    
    // Estados de loading e erro
    loading: conversations.loading || preferences.loading || financialContext.loading || aiContext.loading,
    error: conversations.error || preferences.error || financialContext.error || aiContext.error
  };
};

export default useMemory;