import React from 'react';
import { MemoryDemo } from '../components/MemoryDemo';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Brain, Database, MessageSquare, TrendingUp } from 'lucide-react';

const MemoryTest: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold flex items-center justify-center space-x-2">
          <Brain className="h-8 w-8 text-blue-600" />
          <span>Sistema de Memória JavaliPay</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Demonstração completa do sistema de memória inteligente que permite ao JavaliPay 
          lembrar de conversas, contexto financeiro e preferências do usuário para oferecer 
          uma experiência personalizada e contextualizada.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <span>Conversas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Armazena e recupera o histórico completo de conversas entre o usuário e a IA, 
              permitindo continuidade e contexto em futuras interações.
            </p>
            <div className="mt-3 space-y-1 text-xs text-gray-500">
              <div>• Histórico de mensagens</div>
              <div>• Contexto de sessão</div>
              <div>• Busca semântica</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-600" />
              <span>Contexto Financeiro</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Mantém registro detalhado de transações, padrões de gastos e receitas 
              para análises personalizadas e recomendações inteligentes.
            </p>
            <div className="mt-3 space-y-1 text-xs text-gray-500">
              <div>• Receitas e despesas</div>
              <div>• Categorização automática</div>
              <div>• Análise de padrões</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span>Preferências</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Armazena preferências do usuário, metas financeiras e configurações 
              personalizadas para uma experiência totalmente customizada.
            </p>
            <div className="mt-3 space-y-1 text-xs text-gray-500">
              <div>• Perfil financeiro</div>
              <div>• Metas e objetivos</div>
              <div>• Configurações personalizadas</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <MemoryDemo className="w-full" />

      <Card>
        <CardHeader>
          <CardTitle>Como Funciona o Sistema de Memória</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">🧠 Inteligência Contextual</h3>
              <p className="text-sm text-gray-600">
                O sistema analisa automaticamente as conversas e extrai informações relevantes 
                sobre o contexto financeiro do usuário, criando um perfil dinâmico que evolui 
                com o tempo.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">💾 Armazenamento Seguro</h3>
              <p className="text-sm text-gray-600">
                Todos os dados são armazenados de forma segura no Supabase, com criptografia 
                e controle de acesso rigoroso, garantindo a privacidade e segurança das 
                informações financeiras.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">🔍 Busca Inteligente</h3>
              <p className="text-sm text-gray-600">
                Utiliza algoritmos de busca semântica para encontrar informações relevantes 
                no histórico, permitindo que a IA forneça respostas mais precisas e 
                contextualizadas.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">📊 Análise Preditiva</h3>
              <p className="text-sm text-gray-600">
                Com base no histórico e padrões identificados, o sistema pode fazer previsões 
                e sugestões proativas para melhorar a gestão financeira do usuário.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Benefícios para o Usuário</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Conversas mais naturais e contextualizadas com a IA</li>
              <li>• Recomendações personalizadas baseadas no perfil financeiro</li>
              <li>• Continuidade entre sessões - a IA "lembra" de conversas anteriores</li>
              <li>• Análises mais precisas com base no histórico real do usuário</li>
              <li>• Experiência progressivamente melhor conforme o uso</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryTest;