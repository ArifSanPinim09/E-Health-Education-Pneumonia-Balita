'use client';

import { ContentSection } from '@/lib/constants/session-content';
import MediaEmbed from './MediaEmbed';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  Info,
  BookOpen
} from 'lucide-react';

interface ContentRendererProps {
  sections: ContentSection[];
}

export default function ContentRenderer({ sections }: ContentRendererProps) {
  // Helper function to format text with bold
  const formatTextWithBold = (text: string) => {
    // Split by colon to detect labels like "Virus:", "Bakteri:", etc.
    const parts = text.split(':');
    
    if (parts.length > 1) {
      // Check if first part looks like a label (short text before colon)
      const label = parts[0].trim();
      const content = parts.slice(1).join(':').trim();
      
      // If label is short (likely a category), make it bold
      if (label.length < 50 && content.length > 0) {
        return (
          <>
            <strong className="font-bold text-gray-900">{label}:</strong> {content}
          </>
        );
      }
    }
    
    return text;
  };

  return (
    <article className="content-renderer max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {sections.map((section, index) => {
        switch (section.type) {
          case 'heading':
            const level = section.level || 1;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`
                  ${level === 1 ? 'mt-10 mb-4 first:mt-0' : level === 2 ? 'mt-8 mb-3' : 'mt-6 mb-2'}
                `}
              >
                {level === 2 && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-px bg-gradient-to-r from-[#2F5D50]/30 to-transparent flex-1"></div>
                  </div>
                )}
                
                {level === 1 && (
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {section.content as string}
                  </h2>
                )}
                
                {level === 2 && (
                  <h3 className="text-xl sm:text-2xl font-bold text-[#2F5D50]">
                    {section.content as string}
                  </h3>
                )}
                
                {level === 3 && (
                  <h4 className="text-base sm:text-lg font-semibold text-[#2F5D50]">
                    {section.content as string}
                  </h4>
                )}
                
                {section.subtitle && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 italic">
                    {section.subtitle}
                  </p>
                )}
              </motion.div>
            );
          
          case 'paragraph':
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="my-4"
              >
                <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                  {section.content as string}
                </p>
              </motion.div>
            );

          case 'list':
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="my-4"
              >
                <ul className="space-y-2">
                  {(section.content as string[]).map((item, itemIndex) => (
                    <motion.li
                      key={itemIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: itemIndex * 0.05, duration: 0.3 }}
                      className="flex items-start gap-2 text-sm sm:text-base leading-relaxed text-gray-700"
                    >
                      <div className="flex-shrink-0 w-1.5 h-1.5 bg-[#2F5D50] rounded-full mt-2"></div>
                      <span>{formatTextWithBold(item)}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            );

          case 'image':
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="my-6"
              >
                <MediaEmbed
                  type="image"
                  mediaUrl={section.media_url!}
                  alt={section.alt!}
                />
                {section.content && (
                  <p className="text-xs sm:text-sm text-gray-500 text-center mt-2 italic">
                    {section.content as string}
                  </p>
                )}
              </motion.div>
            );

          case 'video':
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="my-8"
              >
                <MediaEmbed
                  type="video"
                  mediaUrl={section.media_url!}
                  alt={section.alt!}
                />
                {section.content && (
                  <p className="text-xs sm:text-sm text-gray-600 text-center mt-2 font-medium">
                    {section.content as string}
                  </p>
                )}
              </motion.div>
            );

          case 'audio':
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="my-6"
              >
                <MediaEmbed
                  type="audio"
                  mediaUrl={section.media_url!}
                  alt={section.alt!}
                />
                {section.content && (
                  <p className="text-xs sm:text-sm text-gray-600 text-center mt-2 font-medium">
                    {section.content as string}
                  </p>
                )}
              </motion.div>
            );

          case 'highlight':
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="my-5"
              >
                <div className="bg-blue-50 border-l-3 border-blue-400 rounded-r-lg p-3 sm:p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base leading-relaxed text-blue-900">
                      {section.content as string}
                    </p>
                  </div>
                </div>
              </motion.div>
            );

          case 'warning':
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="my-5"
              >
                <div className="bg-red-50 border-l-3 border-red-400 rounded-r-lg p-3 sm:p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base leading-relaxed text-red-900">
                      {section.content as string}
                    </p>
                  </div>
                </div>
              </motion.div>
            );

          case 'tip':
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="my-5"
              >
                <div className="bg-green-50 border-l-3 border-green-400 rounded-r-lg p-3 sm:p-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base leading-relaxed text-green-900">
                      {section.content as string}
                    </p>
                  </div>
                </div>
              </motion.div>
            );

          case 'stats':
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="my-6"
              >
                <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#2F5D50]" />
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                      {section.content as string}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {section.stats?.map((stat, statIndex) => (
                      <motion.div
                        key={statIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: statIndex * 0.05, duration: 0.3 }}
                        className="text-center p-3 bg-white rounded-lg border border-gray-200"
                      >
                        <p className="text-lg sm:text-xl font-bold text-[#2F5D50] mb-0.5">
                          {stat.value}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {stat.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );

          default:
            return null;
        }
      })}
    </article>
  );
}