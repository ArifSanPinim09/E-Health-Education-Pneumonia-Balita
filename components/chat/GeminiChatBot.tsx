'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const TEMPLATE_QUESTIONS = [
  'Apa itu pneumonia pada balita?',
  'Apa saja gejala pneumonia?',
  'Bagaimana cara mencegah pneumonia?',
  'Kapan harus ke dokter?',
  'Apa komplikasi pneumonia?',
];

export default function GeminiChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Halo! Saya asisten edukasi pneumonia. Ada yang ingin Anda tanyakan tentang pneumonia pada balita?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowTemplates(false);

    try {
      const response = await fetch('/api/chat/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(-10), // Send last 10 messages for context
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateClick = (question: string) => {
    sendMessage(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div id="chatbot" className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-3">
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-[#2F5D50] rounded-lg shadow-sm hover:bg-[#2F5D50]/90 transition-all duration-300 flex items-center justify-center"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 left-4 right-4 sm:bottom-28 sm:left-auto sm:right-6 z-50 w-auto sm:w-96 h-[calc(100vh-2rem)] sm:h-[600px] bg-white rounded-lg shadow-sm flex flex-col overflow-hidden border border-[#2F5D50]/20">
          {/* Header */}
          <div className="bg-[#2F5D50] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium">Asisten Edukasi</h3>
                <p className="text-white/70 text-xs">Tanya tentang pneumonia</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F4F7F5]">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-[#2F5D50] text-white'
                      : 'bg-white text-[#1F2933] border border-[#2F5D50]/10'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-white/60' : 'text-[#1F2933]/50'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Template Questions */}
            {showTemplates && messages.length === 1 && !isLoading && (
              <div className="space-y-2">
                <p className="text-xs text-[#1F2933]/60 text-center mb-3">
                  Atau pilih pertanyaan berikut:
                </p>
                {TEMPLATE_QUESTIONS.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleTemplateClick(question)}
                    className="w-full text-left px-4 py-2.5 bg-white hover:bg-[#2F5D50]/5 border border-[#2F5D50]/20 hover:border-[#2F5D50]/40 rounded-lg transition-all text-sm text-[#1F2933] hover:text-[#2F5D50]"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-[#1F2933] rounded-lg px-4 py-3 border border-[#2F5D50]/10">
                  <Loader2 className="w-5 h-5 animate-spin text-[#2F5D50]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-[#2F5D50]/10">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanyakan tentang pneumonia..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-[#2F5D50]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30 focus:border-[#2F5D50] disabled:bg-[#F4F7F5] disabled:cursor-not-allowed text-sm"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-lg bg-[#2F5D50] hover:bg-[#2F5D50]/90 disabled:opacity-50 disabled:cursor-not-allowed p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
