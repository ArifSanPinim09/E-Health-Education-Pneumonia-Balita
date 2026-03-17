'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface QuizInputProps {
  question: string;
  correctAnswer: number;
  unit?: string;
  feedback?: {
    correct: string;
    incorrect: string;
  };
}

export default function QuizInput({ 
  question, 
  correctAnswer, 
  unit = '', 
  feedback 
}: QuizInputProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const answer = parseInt(userAnswer);
    const correct = answer === correctAnswer;
    
    setIsCorrect(correct);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setUserAnswer('');
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-6"
    >
      <div className="bg-[#2F5D50]/5 rounded-lg p-6 border border-[#2F5D50]/20 shadow-sm">
        {/* Question */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-8 h-8 bg-[#2F5D50]/10 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-[#2F5D50]" />
          </div>
          <div className="flex-1">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              Pertanyaan Latihan
            </h4>
            <p className="text-sm sm:text-base text-gray-700">
              {question}
            </p>
          </div>
        </div>

        {/* Input Form */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Masukkan jawaban Anda"
                    className="w-full px-4 h-12 text-base border border-[#2F5D50]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent"
                    required
                    min="0"
                    max="200"
                  />
                  {unit && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      {unit}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="px-6 h-12 bg-[#2F5D50] hover:bg-[#274E43] text-white font-medium rounded-lg transition-all shadow-sm"
              >
                Periksa Jawaban
              </button>
            </div>
          </form>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              {/* Result */}
              <div className={`p-4 rounded-lg border ${
                isCorrect 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h5 className={`font-bold text-base mb-1 ${
                      isCorrect ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {isCorrect ? 'Jawaban Benar!' : 'Jawaban Kurang Tepat'}
                    </h5>
                    <p className={`text-sm ${
                      isCorrect ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {isCorrect 
                        ? feedback?.correct || 'Selamat! Jawaban Anda benar.'
                        : feedback?.incorrect || 'Coba lagi dengan lebih teliti.'
                      }
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-red-700 mt-2">
                        <strong>Jawaban Anda:</strong> {userAnswer} {unit}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!isCorrect && (
                  <button
                    onClick={handleReset}
                    className="flex-1 px-4 h-12 bg-white border border-[#2F5D50]/20 text-[#2F5D50] font-medium rounded-lg hover:bg-[#2F5D50]/5 transition-all"
                  >
                    Coba Lagi
                  </button>
                )}
                {isCorrect && (
                  <div className="flex-1 px-4 h-12 bg-[#2F5D50]/10 border border-[#2F5D50]/20 text-[#2F5D50] font-medium rounded-lg flex items-center justify-center">
                    Jawaban Benar: {correctAnswer} {unit}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
