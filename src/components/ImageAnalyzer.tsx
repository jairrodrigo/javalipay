import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { analyzeExpenseImage, ImageAnalysisResult, isOpenAIConfigured } from '../services/openaiService';
import { Upload, Image, AlertCircle, CheckCircle, Loader2, X } from 'lucide-react';

interface ImageAnalyzerProps {
  onAnalysisComplete?: (result: ImageAnalysisResult) => void;
  onError?: (error: string) => void;
}

export default function ImageAnalyzer({ onAnalysisComplete, onError }: ImageAnalyzerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Verificar se a OpenAI está configurada
    if (!isOpenAIConfigured()) {
      const errorMsg = 'Chave da OpenAI não configurada. Verifique o arquivo .env';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // Mostrar preview da imagem
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeExpenseImage(file);
      setAnalysisResult(result);
      onAnalysisComplete?.(result);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao analisar imagem';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsAnalyzing(false);
    }
  }, [onAnalysisComplete, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const clearResults = () => {
    setAnalysisResult(null);
    setError(null);
    setUploadedImage(null);
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getTypeColor = (type: string) => {
    return type === 'receita' ? 'text-green-600' : 'text-red-600';
  };

  const getTypeIcon = (type: string) => {
    return type === 'receita' ? '💰' : '💸';
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6 min-h-[600px]">
      {/* Área de Upload */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${isAnalyzing ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {isAnalyzing ? (
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-gray-400" />
          )}
          
          <div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {isAnalyzing 
                ? 'Analisando imagem...' 
                : isDragActive 
                  ? 'Solte a imagem aqui' 
                  : 'Arraste uma imagem ou clique para selecionar'
              }
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Formatos aceitos: JPEG, PNG, WebP (máx. 10MB)
            </p>
          </div>
        </div>
      </div>

      {/* Preview da Imagem */}
      {uploadedImage && (
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Imagem Carregada
            </h3>
            <button
              onClick={clearResults}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="relative max-w-md mx-auto">
            <img
              src={uploadedImage}
              alt="Imagem carregada"
              className="w-full h-auto rounded-lg shadow-md"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <div className="text-white text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p>Analisando...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resultado da Análise */}
      {analysisResult && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Análise Concluída
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tipo
                </label>
                <p className={`text-lg font-semibold ${getTypeColor(analysisResult.type)}`}>
                  {getTypeIcon(analysisResult.type)} {analysisResult.type.charAt(0).toUpperCase() + analysisResult.type.slice(1)}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Categoria
                </label>
                <p className="text-gray-800 dark:text-gray-200 capitalize">
                  {analysisResult.category}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Valor
                </label>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {formatCurrency(analysisResult.amount)}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Descrição
                </label>
                <p className="text-gray-800 dark:text-gray-200">
                  {analysisResult.description}
                </p>
              </div>
              
              {analysisResult.establishment && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Estabelecimento
                  </label>
                  <p className="text-gray-800 dark:text-gray-200">
                    {analysisResult.establishment}
                  </p>
                </div>
              )}
              
              {analysisResult.date && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Data
                  </label>
                  <p className="text-gray-800 dark:text-gray-200">
                    {analysisResult.date}
                  </p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Confiança
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analysisResult.confidence}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {analysisResult.confidence}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 dark:text-red-400 font-medium">
              Erro na Análise
            </p>
          </div>
          <p className="text-red-600 dark:text-red-300 mt-2">
            {error}
          </p>
        </div>
      )}

      {/* Aviso se OpenAI não estiver configurada */}
      {!isOpenAIConfigured() && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <p className="text-yellow-700 dark:text-yellow-400 font-medium">
              Configuração Necessária
            </p>
          </div>
          <p className="text-yellow-600 dark:text-yellow-300 mt-2">
            Configure a chave da OpenAI no arquivo .env para usar a análise de imagens.
          </p>
        </div>
      )}
    </div>
  );
}