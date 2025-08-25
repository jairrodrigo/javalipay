import OpenAI from 'openai';

// Configuração do cliente OpenAI
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Necessário para uso no frontend
});

// Interface para resultado da análise de imagem
export interface ImageAnalysisResult {
  type: 'despesa' | 'receita';
  category: string;
  amount?: number;
  description: string;
  date?: string;
  establishment?: string;
  confidence: number; // 0-100
}

// Interface para resposta do chat
export interface ChatResponse {
  message: string;
  suggestions?: string[];
}

/**
 * Analisa uma imagem de despesa ou receita usando OpenAI Vision API
 * @param imageFile - Arquivo de imagem para análise
 * @returns Resultado da análise estruturado
 */
export async function analyzeExpenseImage(imageFile: File): Promise<ImageAnalysisResult> {
  try {
    // Converte a imagem para base64
    const base64Image = await fileToBase64(imageFile);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analise esta imagem de comprovante/nota fiscal e extraia as seguintes informações:
              
              - type: despesa ou receita
              - category: alimentação, transporte, saúde, educação, lazer, casa, trabalho, outros
              - amount: valor monetário (apenas números)
              - description: breve descrição do item/serviço
              - date: data da transação (se visível)
              - establishment: nome do estabelecimento (se visível)
              - confidence: nível de confiança na análise (0-100)
              
              Responda APENAS em formato JSON válido, sem texto adicional.`
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 500,
      temperature: 0.1
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Resposta vazia da OpenAI');
    }

    // Parse do JSON retornado
    const result = JSON.parse(content) as ImageAnalysisResult;
    
    // Validação básica dos dados
    if (!result.type || !result.category || !result.description) {
      throw new Error('Dados incompletos na análise');
    }

    return result;
  } catch (error) {
    console.error('Erro na análise de imagem:', error);
    throw new Error('Falha ao analisar a imagem. Verifique se é um comprovante válido.');
  }
}

/**
 * Processa mensagens de chat com contexto financeiro
 * @param message - Mensagem do usuário
 * @param context - Contexto adicional (opcional)
 * @returns Resposta do chat
 */
export async function processChatMessage(
  message: string, 
  context?: string
): Promise<ChatResponse> {
  try {
    const systemPrompt = `Você é um assistente financeiro especializado em gestão de despesas e receitas.
    Ajude o usuário com:
    - Análise de gastos
    - Sugestões de economia
    - Planejamento financeiro
    - Categorização de despesas
    - Definição de metas financeiras
    
    Seja conciso, prático e sempre focado em finanças pessoais.
    ${context ? `Contexto adicional: ${context}` : ''}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Resposta vazia da OpenAI');
    }

    return {
      message: content,
      suggestions: generateSuggestions(message)
    };
  } catch (error) {
    console.error('Erro no chat:', error);
    throw new Error('Falha ao processar mensagem. Tente novamente.');
  }
}

/**
 * Converte arquivo para base64
 * @param file - Arquivo para conversão
 * @returns String base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Gera sugestões baseadas na mensagem do usuário
 * @param message - Mensagem do usuário
 * @returns Array de sugestões
 */
function generateSuggestions(message: string): string[] {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('gasto') || lowerMessage.includes('despesa')) {
    return [
      'Ver relatório de gastos',
      'Definir limite de gastos',
      'Categorizar despesas'
    ];
  }
  
  if (lowerMessage.includes('meta') || lowerMessage.includes('objetivo')) {
    return [
      'Criar nova meta',
      'Ver progresso das metas',
      'Ajustar metas existentes'
    ];
  }
  
  if (lowerMessage.includes('economia') || lowerMessage.includes('poupar')) {
    return [
      'Dicas de economia',
      'Analisar gastos desnecessários',
      'Plano de poupança'
    ];
  }
  
  return [
    'Ver dashboard',
    'Adicionar despesa',
    'Criar meta financeira'
  ];
}

/**
 * Verifica se a API Key está configurada
 * @returns boolean
 */
export function isOpenAIConfigured(): boolean {
  return !!import.meta.env.VITE_OPENAI_API_KEY && 
         import.meta.env.VITE_OPENAI_API_KEY !== 'sk-proj-your_openai_api_key_here';
}

/**
 * Testa a conexão com a OpenAI API
 * @returns Promise<boolean>
 */
export async function testOpenAIConnection(): Promise<boolean> {
  try {
    if (!isOpenAIConfigured()) {
      return false;
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Teste" }],
      max_tokens: 5
    });
    
    return !!response.choices[0]?.message?.content;
  } catch (error) {
    console.error('Erro ao testar conexão OpenAI:', error);
    return false;
  }
}