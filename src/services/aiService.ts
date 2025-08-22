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

  static async chatQuery(query: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock de respostas inteligentes
    const responses = [
      `Baseado no seu histórico, você gastou R$ ${(Math.random() * 500 + 100).toFixed(2)} com essa categoria este mês.`,
      'Identifiquei um padrão interessante nos seus gastos. Veja os detalhes no relatório.',
      'Sua receita média mensal é de R$ 4.500,00, com um crescimento de 8% nos últimos 3 meses.',
      'Recomendo revisar os gastos com alimentação, que aumentaram 15% este mês.',
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
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
