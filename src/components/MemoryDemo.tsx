import React, { useState, useEffect } from 'react';
import { useMemory } from '../hooks/useMemory';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Brain, MessageSquare, DollarSign, User, Target, Calendar } from 'lucide-react';

interface MemoryDemoProps {
  className?: string;
}

export const MemoryDemo: React.FC<MemoryDemoProps> = ({ className }) => {
  const {
    conversations,
    saveConversation,
    getRelevantContext,
    financialSummary,
    preferences,
    updatePreferences,
    addFinancialContext,
    getCurrentSessionId,
    memoryLoading
  } = useMemory();

  const [testMessage, setTestMessage] = useState('');
  const [testAmount, setTestAmount] = useState('');
  const [testCategory, setTestCategory] = useState('');
  const [contextResult, setContextResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'conversations' | 'financial' | 'preferences'>('conversations');

  // Dados de exemplo para demonstração
  const handleAddTestConversation = async () => {
    if (!testMessage.trim()) return;
    
    try {
      await saveConversation({
        user_message: testMessage,
        ai_response: `Resposta da IA para: "${testMessage}"`,
        context_used: { demo: true },
        session_id: getCurrentSessionId()
      });
      setTestMessage('');
    } catch (error) {
      console.error('Erro ao salvar conversa:', error);
    }
  };

  const handleAddTestFinancial = async () => {
    if (!testAmount || !testCategory) return;
    
    try {
      await addFinancialContext({
        context_type: Math.random() > 0.5 ? 'income' : 'expense',
        amount: parseFloat(testAmount),
        category: testCategory,
        description: `Transação de teste: ${testCategory}`,
        metadata: { demo: true }
      });
      setTestAmount('');
      setTestCategory('');
    } catch (error) {
      console.error('Erro ao adicionar contexto financeiro:', error);
    }
  };

  const handleTestContext = async () => {
    try {
      const context = await getRelevantContext('finanças pessoais');
      setContextResult(context);
    } catch (error) {
      console.error('Erro ao buscar contexto:', error);
    }
  };

  const handleUpdateTestPreferences = async () => {
    try {
      await updatePreferences({
        profile_type: 'conservative',
        monthly_budget: 5000,
        financial_goals: ['economia', 'investimento'],
        preferred_categories: ['alimentação', 'transporte', 'lazer'],
        notification_settings: { email: true, push: false }
      });
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
    }
  };

  if (memoryLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 animate-spin" />
            <span>Carregando sistema de memória...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Demonstração do Sistema de Memória</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-1 mb-4">
            <Button
              variant={activeTab === 'conversations' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('conversations')}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Conversas
            </Button>
            <Button
              variant={activeTab === 'financial' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('financial')}
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Financeiro
            </Button>
            <Button
              variant={activeTab === 'preferences' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('preferences')}
            >
              <User className="h-4 w-4 mr-1" />
              Preferências
            </Button>
          </div>

          {activeTab === 'conversations' && (
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Digite uma mensagem de teste..."
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTestConversation()}
                />
                <Button onClick={handleAddTestConversation} disabled={!testMessage.trim()}>
                  Adicionar
                </Button>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Conversas Recentes ({conversations.length})</h4>
                {conversations.slice(0, 5).map((conv, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm">
                      <strong>Usuário:</strong> {conv.user_message}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <strong>IA:</strong> {conv.ai_response}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(conv.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
                {conversations.length === 0 && (
                  <p className="text-gray-500 text-sm">Nenhuma conversa registrada ainda.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Valor"
                  type="number"
                  value={testAmount}
                  onChange={(e) => setTestAmount(e.target.value)}
                />
                <Input
                  placeholder="Categoria"
                  value={testCategory}
                  onChange={(e) => setTestCategory(e.target.value)}
                />
                <Button onClick={handleAddTestFinancial} disabled={!testAmount || !testCategory}>
                  Adicionar
                </Button>
              </div>
              
              {financialSummary && (
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-600">
                        R$ {financialSummary.totalIncome?.toFixed(2) || '0.00'}
                      </div>
                      <div className="text-sm text-gray-600">Receitas</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-red-600">
                        R$ {financialSummary.totalExpenses?.toFixed(2) || '0.00'}
                      </div>
                      <div className="text-sm text-gray-600">Despesas</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className={`text-2xl font-bold ${
                        (financialSummary.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        R$ {financialSummary.balance?.toFixed(2) || '0.00'}
                      </div>
                      <div className="text-sm text-gray-600">Saldo</div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <Button onClick={handleUpdateTestPreferences}>
                Configurar Preferências de Teste
              </Button>
              
              {preferences && (
                <div className="space-y-3">
                  <div>
                    <strong>Perfil:</strong> 
                    <Badge variant="outline" className="ml-2">{preferences.profile_type}</Badge>
                  </div>
                  <div>
                    <strong>Orçamento Mensal:</strong> R$ {preferences.monthly_budget?.toFixed(2)}
                  </div>
                  <div>
                    <strong>Metas:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {preferences.financial_goals?.map((goal, index) => (
                        <Badge key={index} variant="secondary">
                          <Target className="h-3 w-3 mr-1" />
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong>Categorias Preferidas:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {preferences.preferred_categories?.map((category, index) => (
                        <Badge key={index} variant="outline">{category}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <Separator className="my-4" />
          
          <div className="space-y-2">
            <Button onClick={handleTestContext} variant="outline" className="w-full">
              Testar Busca de Contexto Relevante
            </Button>
            
            {contextResult && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Contexto Encontrado:</h4>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(contextResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryDemo;