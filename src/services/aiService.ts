import { AIAnalysis } from '../types/financial';
import { categories } from '../data/categories';

export class AIService {
  static async analyzeReceipt(imageData: string): Promise<AIAnalysis> {
    // Simula análise de OCR e IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock de dados extraídos
    const mockData = {
      amount: Math.random() * 200 + 10,
      date: new Date(),
      establishment: this.generateRandomEstablishment(),
      category: this.suggestCategory(),
      type: Math.random() > 0.7 ? 'income' as const : 'expense' as const,
    };

    return {
      extractedData: mockData,
      confidence: Math.random() * 0.3 + 0.7, // 70-100%
      suggestions: [
        'Verifique se a data está correta',
        'Confirme a categoria sugerida',
        'Adicione observações se necessário'
      ]
    };
  }

  static async chatQuery(query: string, context?: any): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Se há contexto, gera respostas mais personalizadas
    if (context) {
      const { financialContext, preferences, recentConversations } = context;
      
      // Analisa o contexto financeiro
      if (financialContext && financialContext.length > 0) {
        const totalExpenses = financialContext
          .filter((item: any) => item.context_type === 'expense')
          .reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
        
        const totalIncome = financialContext
          .filter((item: any) => item.context_type === 'income')
          .reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
        
        const balance = totalIncome - totalExpenses;
        
        // Respostas contextualizadas baseadas nos dados reais
        const contextualResponses = [
          `Com base no seu histórico, você tem um saldo atual de R$ ${balance.toFixed(2)}. ${balance >= 0 ? 'Parabéns por manter suas finanças equilibradas!' : 'Recomendo revisar seus gastos para equilibrar o orçamento.'}`,
          `Analisando seus dados, você gastou R$ ${totalExpenses.toFixed(2)} recentemente. ${query.toLowerCase().includes('economia') ? 'Posso sugerir algumas estratégias de economia baseadas no seu perfil.' : ''}`,
          `Sua receita registrada é de R$ ${totalIncome.toFixed(2)}. ${query.toLowerCase().includes('meta') ? 'Que tal definirmos uma meta de economia baseada nesse valor?' : ''}`,
          `Identifiquei ${financialContext.length} transações no seu histórico. ${query.toLowerCase().includes('categoria') ? 'Posso ajudar a categorizar melhor seus gastos.' : ''}`
        ];
        
        return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
      }
      
      // Se há preferências configuradas
      if (preferences) {
        return `Baseado nas suas preferências configuradas, posso oferecer insights mais personalizados. ${query.toLowerCase().includes('ajuda') ? 'Como posso ajudar especificamente?' : 'O que gostaria de saber sobre suas finanças?'}`;
      }
      
      // Se há conversas recentes
      if (recentConversations && recentConversations.length > 0) {
        return `Vejo que já conversamos antes. Continuando nossa conversa anterior, ${query.toLowerCase().includes('lembrar') ? 'posso acessar nosso histórico para dar respostas mais precisas.' : 'como posso ajudar hoje?'}`;
      }
    }
    
    // Respostas padrão quando não há contexto
    const defaultResponses = [
      `Sobre "${query}": Baseado em padrões gerais, você pode esperar gastos na faixa de R$ ${(Math.random() * 500 + 100).toFixed(2)} para essa categoria.`,
      'Para dar respostas mais precisas, preciso conhecer melhor seu perfil financeiro. Que tal começarmos registrando algumas transações?',
      'Posso ajudar com análises financeiras, planejamento de orçamento e definição de metas. O que você gostaria de explorar primeiro?',
      'Identifiquei que você está interessado em melhorar suas finanças. Vamos começar organizando suas receitas e despesas?',
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  private static generateRandomEstablishment(): string {
    const establishments = [
      'Supermercado Central',
      'Restaurante Bella Vista',
      'Posto Shell',
      'Farmácia Drogasil',
      'Shopping Center',
      'Uber',
      'iFood',
      'Netflix',
    ];
    return establishments[Math.floor(Math.random() * establishments.length)];
  }

  private static suggestCategory(): string {
    const expenseCategories = categories.filter(c => c.type === 'expense' || c.type === 'both');
    return expenseCategories[Math.floor(Math.random() * expenseCategories.length)].id;
  }
}
