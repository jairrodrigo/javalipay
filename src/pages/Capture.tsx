import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIService } from '../services/aiService';
import { DataService } from '../services/dataService';
import { categories } from '../data/categories';
import { AIAnalysis } from '../types/financial';
import { JavaliLogo } from '../components/UI/JavaliLogo';

export const Capture: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      setCapturedImage(imageData);
      setIsAnalyzing(true);

      try {
        const result = await AIService.analyzeReceipt(imageData);
        setAnalysis(result);
      } catch (error) {
        console.error('Erro na análise:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageCapture(file);
    }
  };

  const handleConfirmTransaction = () => {
    if (analysis?.extractedData) {
      const transaction = {
        amount: analysis.extractedData.amount || 0,
        date: analysis.extractedData.date || new Date(),
        description: analysis.extractedData.establishment || 'Transação capturada',
        establishment: analysis.extractedData.establishment,
        category: analysis.extractedData.category || 'other',
        type: analysis.extractedData.type || 'expense',
        confidence: analysis.confidence,
      };
      
      DataService.addTransaction(transaction);
      
      // Reset form
      setAnalysis(null);
      setCapturedImage(null);
      
      // Show success message
      alert('Transação adicionada com sucesso no JavaliPay!');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-background transition-colors duration-300">
      <div className="mb-6 flex items-center space-x-3">
        <div className="w-8 h-8 primary-gradient rounded-lg flex items-center justify-center">
          <JavaliLogo size={20} color="white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary-orange">Captura Inteligente JavaliPay</h1>
          <p className="text-text-secondary">Fotografe ou envie seus comprovantes para análise automática com IA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <div className="space-y-4">
          <div className="theme-card p-6 rounded-xl shadow-lg border border-border-color transition-colors duration-300">
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Carregar Documento</h3>
            
            <div className="space-y-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 border-2 border-dashed border-border-color rounded-lg hover:border-primary-orange transition-colors"
              >
                <div className="text-center">
                  <Upload size={48} className="mx-auto text-text-secondary mb-4" />
                  <p className="text-lg font-medium text-primary-orange">Clique para enviar</p>
                  <p className="text-text-secondary">ou arraste seus arquivos aqui</p>
                  <p className="text-sm text-text-secondary mt-2">PNG, JPG, PDF até 10MB</p>
                </div>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full primary-gradient text-neutral-black py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 font-semibold"
              >
                <Camera size={20} />
                <span>Usar Câmera</span>
              </button>
            </div>
          </div>

          {/* Captured Image Preview */}
          {capturedImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-gradient p-4 rounded-xl shadow-lg border border-neutral-black"
            >
              <h4 className="font-semibold mb-3 text-primary-neon">Imagem Capturada</h4>
              <img
                src={capturedImage}
                alt="Documento capturado"
                className="w-full h-48 object-cover rounded-lg"
              />
            </motion.div>
          )}
        </div>

        {/* Analysis Results */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card-gradient p-6 rounded-xl shadow-lg border border-neutral-black"
              >
                <div className="text-center">
                  <Loader className="animate-spin mx-auto text-primary-neon mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-primary-neon">Analisando documento...</h3>
                  <p className="text-neutral-light">Nossa IA JavaliPay está extraindo as informações</p>
                </div>
              </motion.div>
            )}

            {analysis && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-gradient p-6 rounded-xl shadow-lg border border-neutral-black"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="text-primary-neon" size={24} />
                  <h3 className="text-lg font-semibold text-primary-neon">Análise Concluída</h3>
                  <span className="bg-primary-neon text-neutral-black px-2 py-1 rounded-full text-sm font-semibold">
                    {(analysis.confidence * 100).toFixed(0)}% confiança
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-light mb-1">
                        Valor
                      </label>
                      <input
                        type="number"
                        value={analysis.extractedData.amount?.toFixed(2) || ''}
                        className="w-full p-2 bg-neutral-black border border-neutral-gray rounded-lg text-neutral-light focus:ring-2 focus:ring-primary-neon"
                        step="0.01"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-light mb-1">
                        Data
                      </label>
                      <input
                        type="date"
                        value={analysis.extractedData.date?.toISOString().split('T')[0] || ''}
                        className="w-full p-2 bg-neutral-black border border-neutral-gray rounded-lg text-neutral-light focus:ring-2 focus:ring-primary-neon"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-light mb-1">
                      Estabelecimento
                    </label>
                    <input
                      type="text"
                      value={analysis.extractedData.establishment || ''}
                      className="w-full p-2 bg-neutral-black border border-neutral-gray rounded-lg text-neutral-light focus:ring-2 focus:ring-primary-neon"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-light mb-1">
                        Categoria
                      </label>
                      <select
                        value={analysis.extractedData.category || ''}
                        className="w-full p-2 bg-neutral-black border border-neutral-gray rounded-lg text-neutral-light focus:ring-2 focus:ring-primary-neon"
                      >
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-light mb-1">
                        Tipo
                      </label>
                      <select
                        value={analysis.extractedData.type || 'expense'}
                        className="w-full p-2 bg-neutral-black border border-neutral-gray rounded-lg text-neutral-light focus:ring-2 focus:ring-primary-neon"
                      >
                        <option value="expense">Despesa</option>
                        <option value="income">Receita</option>
                      </select>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="bg-accent-cyan bg-opacity-10 border border-accent-cyan p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="text-accent-cyan mt-0.5" size={16} />
                      <div>
                        <h4 className="font-medium text-accent-cyan">Sugestões da IA JavaliPay</h4>
                        <ul className="text-sm text-neutral-light mt-1 space-y-1">
                          {analysis.suggestions.map((suggestion, index) => (
                            <li key={index}>• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleConfirmTransaction}
                      className="flex-1 primary-gradient text-neutral-black py-2 rounded-lg hover:opacity-90 transition-opacity font-semibold"
                    >
                      Confirmar Transação
                    </button>
                    <button
                      onClick={() => setAnalysis(null)}
                      className="flex-1 bg-neutral-black border border-neutral-gray text-neutral-light py-2 rounded-lg hover:bg-neutral-gray transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
