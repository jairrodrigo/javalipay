import React from 'react';
import ChatBot from '../components/ChatBot';
import ImageAnalyzer from '../components/ImageAnalyzer';
import { ImageAnalysisResult } from '../services/openaiService';
import { useState } from 'react';
import { MessageSquare, Camera } from 'lucide-react';

export const Chat: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'image'>('chat');
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);

  const handleImageAnalysis = (result: ImageAnalysisResult) => {
    setAnalysisResult(result);
    // Opcional: mudar para a aba de chat para mostrar o resultado
    // setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Assistente Financeiro IA
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Chat inteligente e análise de imagens de despesas
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'chat'
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <MessageSquare size={20} />
                Chat
              </button>
              <button
                onClick={() => setActiveTab('image')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'image'
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Camera size={20} />
                Análise de Imagem
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            {activeTab === 'chat' ? (
              <ChatBot initialContext={analysisResult} />
            ) : (
              <ImageAnalyzer onAnalysisComplete={handleImageAnalysis} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
