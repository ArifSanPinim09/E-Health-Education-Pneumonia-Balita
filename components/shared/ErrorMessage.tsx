'use client';

import { motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorMessage({ message, onDismiss, className = '' }: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={`bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 ${className}`}
    >
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <p className="text-red-800 text-sm flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
          aria-label="Tutup pesan error"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </motion.div>
  );
}
