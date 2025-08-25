import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, History, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIService } from '../services/aiService';
import { JavaliLogo } from '../components/UI/JavaliLogo';
import { useMemory } from '../hooks/useMemory';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const Chat: React.FC = () => {
  const {
    conversations,
    saveConversation,
    getRelevantContext,
    financialSummary,
    preferences,
    getCurrentSessionId,
    loading: memoryLoading
  } = useMemory();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Olá! Sou seu assistente financeiro inteligente do JavaliPay 🐗. Posso ajudar você a entender seus gastos, receitas e padrões financeiros pessoais ou empresariais. O que gostaria de saber?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMemoryInfo, setShowMemoryInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Busca contexto relevante para a IA
      const context = await getRelevantContext(currentInput);
      
      // Salva a mensagem do usuário na memória
      await saveConversation({
        conversation_type: 'chat',
        title: currentInput.substring(0, 50) + (currentInput.length > 50 ? '...' : ''),
        content: {
          type: 'user_message',
          message: currentInput,
          context: context
        },
        metadata: {
          sessionId: getCurrentSessionId(),
          hasContext: !!context
        }
      });

      // Envia query para IA com contexto
      const response = await AIService.chatQuery(currentInput, context);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Salva a resposta da IA na memória
      await saveConversation({
        conversation_type: 'chat',
        title: 'Resposta: ' + currentInput.substring(0, 40) + (currentInput.length > 40 ? '...' : ''),
        content: {
          type: 'ai_response',
          message: response,
          originalQuery: currentInput
        },
        metadata: {
          sessionId: getCurrentSessionId(),
          responseLength: response.length
        }
      });
      
    } catch (error) {
      console.error('Erro no chat:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-full flex flex-col min-h-screen bg-neutral-black">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 primary-gradient rounded-lg flex items-center justify-center">
            <JavaliLogo size={20} color="white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-neon">Chat IA JavaliPay</h1>
            <p className="text-neutral-light">Converse sobre suas finanças e receba insights personalizados</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowMemoryInfo(!showMemoryInfo)}
            className={`p-2 rounded-lg transition-colors ${
              showMemoryInfo 
                ? 'primary-gradient text-neutral-black' 
                : 'bg-neutral-gray text-neutral-light hover:bg-neutral-light hover:text-neutral-black'
            }`}
            title="Informações da Memória"
          >
            <Brain size={20} />
          </button>
          
          <div className="text-xs text-neutral-light">
            <div>Conversas: {conversations.length}</div>
            {financialSummary && (
              <div>Saldo: R$ {financialSummary.balance?.toFixed(2) || '0,00'}</div>
            )}
          </div>
        </div>
      </div>

      {/* Painel de Informações da Memória */}
      <AnimatePresence>
        {showMemoryInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 card-gradient rounded-xl border border-neutral-gray p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-primary-neon flex items-center">
                  <History size={16} className="mr-2" />
                  Histórico
                </h3>
                <div className="text-xs text-neutral-light space-y-1">
                  <div>Total de conversas: {conversations.length}</div>
                  <div>Sessão atual: {getCurrentSessionId().split('_')[1]}</div>
                  {memoryLoading && <div className="text-accent-neon">Carregando...</div>}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-primary-neon flex items-center">
                  <Brain size={16} className="mr-2" />
                  Contexto Financeiro
                </h3>
                <div className="text-xs text-neutral-light space-y-1">
                  {financialSummary ? (
                    <>
                      <div>Receitas: R$ {financialSummary.totalIncome?.toFixed(2) || '0,00'}</div>
                      <div>Gastos: R$ {financialSummary.totalExpenses?.toFixed(2) || '0,00'}</div>
                      <div className={`font-semibold ${
                        (financialSummary.balance || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        Saldo: R$ {financialSummary.balance?.toFixed(2) || '0,00'}
                      </div>
                    </>
                  ) : (
                    <div>Nenhum dado financeiro registrado</div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-primary-neon flex items-center">
                  <User size={16} className="mr-2" />
                  Preferências
                </h3>
                <div className="text-xs text-neutral-light space-y-1">
                  {preferences ? (
                    <>
                      <div>Perfil configurado: Sim</div>
                      <div>Metas ativas: {Object.keys(preferences.financial_goals || {}).length}</div>
                      <div>Categorias: {Object.keys(preferences.spending_categories || {}).length}</div>
                    </>
                  ) : (
                    <div>Nenhuma preferência configurada</div>
                  )}
                </div>
              </div>
            </div>
            
            {conversations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-neutral-gray">
                <h4 className="text-xs font-semibold text-neutral-light mb-2">Conversas Recentes:</h4>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {conversations.slice(0, 3).map((conv, index) => (
                    <div key={conv.id || index} className="text-xs text-neutral-light truncate">
                      • {conv.title || 'Conversa sem título'}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 card-gradient rounded-xl shadow-lg border border-neutral-black flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'primary-gradient text-neutral-black' 
                      : 'accent-gradient text-white'
                  }`}>
                    {message.type === 'user' ? (
                      <User size={16} />
                    ) : (
                      <JavaliLogo size={16} color="white" />
                    )}
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    message.type === 'user'
                      ? 'primary-gradient text-neutral-black rounded-br-none'
                      : 'bg-neutral-black text-neutral-light rounded-bl-none border border-neutral-gray'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-neutral-black opacity-70' : 'text-neutral-light opacity-50'
                    }`}>
                      {message.timestamp.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full accent-gradient flex items-center justify-center">
                  <JavaliLogo size={16} color="white" />
                </div>
                <div className="bg-neutral-black p-4 rounded-lg rounded-bl-none border border-neutral-gray">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary-neon rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary-neon rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary-neon rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-neutral-black">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta sobre finanças..."
              className="flex-1 p-3 bg-neutral-black border border-neutral-gray rounded-lg focus:ring-2 focus:ring-primary-neon focus:border-primary-neon text-neutral-light placeholder-neutral-light"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="primary-gradient text-neutral-black p-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="mt-4 card-gradient p-4 rounded-xl shadow-lg border border-neutral-black">
        <h3 className="text-sm font-medium text-primary-neon mb-3">Perguntas Rápidas</h3>
        <div className="flex flex-wrap gap-2">
          {[
            'Quanto gastei este mês?',
            'Qual minha categoria de maior gasto?',
            'Como está meu saldo?',
            'Mostre receitas recorrentes',
          ].map((question) => (
            <button
              key={question}
              onClick={() => setInputValue(question)}
              className="px-3 py-1 bg-neutral-black text-neutral-light rounded-full text-sm hover:bg-primary-neon hover:text-neutral-black transition-colors border border-neutral-gray"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
