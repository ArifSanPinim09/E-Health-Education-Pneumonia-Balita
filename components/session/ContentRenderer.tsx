'use client';

import { ContentSection } from '@/lib/constants/session-content';
import MediaEmbed from './MediaEmbed';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  CheckCircle2, 
  Info,
  BookOpen,
  Heart,
  Shield
} from 'lucide-react';

interface ContentRendererProps {
  sections: ContentSection[];
}

export default function ContentRenderer({ sections }: ContentRendererProps) {
  // Count only main headings for numbering (without subtitle)
  let headingNumber = 0;

  return (
    <article className="content-renderer max-w-4xl mx-auto">
      {sections.map((section, index) => {
        // Increment heading number only for main heading type (without subtitle)
        if (section.type === 'heading' && !section.subtitle) {
          headingNumber++;
        }

        switch (section.type) {
          case 'heading':
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`
                  ${section.subtitle ? 'px-6 sm:px-8 lg:px-10 pt-6 pb-3' : 'px-6 sm:px-8 lg:px-10 pt-12 pb-4 first:pt-8'}
                  ${!section.subtitle ? 'border-l-4 border-[#2F5D50] bg-gradient-to-r from-[#F4F7F5] to-transparent' : ''}
                `}
              >
                {!section.subtitle && (
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#2F5D50] to-[#1a3d35] text-white rounded-full text-sm font-bold shadow-lg">
                      {headingNumber}
                    </div>
                    <div className="h-px bg-gradient-to-r from-[#2F5D50] to-transparent flex-1"></div>
                  </div>
                )}
                
                <h2 className={`
                  ${section.subtitle 
                    ? 'text-lg sm:text-xl font-semibold text-[#2F5D50] leading-tight' 
                    : 'text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[#1F2933] leading-tight'
                  }
                `}>
                  {section.content as string}
                </h2>
                
                {section.subtitle && (
                  <p className="text-sm text-[#6B7280] mt-1 italic">
                    {section.subtitle}
                  </p>
                )}
              </motion.div>
            );
          
          case 'paragraph':
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="px-6 sm:px-8 lg:px-10 py-4"
              >
                <p className="text-base sm:text-lg leading-relaxed text-[#374151] font-light tracking-wide">
                  {section.content as string}
                </p>
              </motion.div>
            );

          case 'list':
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="px-6 sm:px-8 lg:px-10 py-4"
              >
                <ul className="space-y-3">
                  {(section.content as string[]).map((item, itemIndex) => (
                    <motion.li
                      key={itemIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: itemIndex * 0.1, duration: 0.4 }}
                      className="flex items-start gap-3 text-base sm:text-lg leading-relaxed text-[#374151]"
                    >
                      <div className="flex-shrink-0 w-2 h-2 bg-gradient-to-br from-[#2F5D50] to-[#1a3d35] rounded-full mt-3"></div>
                      <span className="font-light tracking-wide">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            );

          case 'image':
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="px-6 sm:px-8 lg:px-10 py-6"
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                  <MediaEmbed
                    type="image"
                    mediaUrl={section.media_url!}
                    alt={section.alt!}
                  />
                  {section.content && (
                    <p className="text-sm text-[#6B7280] text-center mt-3 italic">
                      {section.content as string}
                    </p>
                  )}
                </div>
              </motion.div>
            );

          case 'video':
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="px-6 sm:px-8 lg:px-10 py-6"
              >
                <div className="bg-gradient-to-br from-[#2F5D50] to-[#1a3d35] rounded-xl shadow-lg p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-lg">Video Pembelajaran</h3>
                  </div>
                  <div className="bg-white rounded-lg overflow-hidden">
                    <MediaEmbed
                      type="video"
                      mediaUrl={section.media_url!}
                      alt={section.alt!}
                    />
                  </div>
                  {section.content && (
                    <p className="text-white/90 text-sm text-center mt-3">
                      {section.content as string}
                    </p>
                  )}
                </div>
              </motion.div>
            );

          case 'highlight':
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="px-6 sm:px-8 lg:px-10 py-4"
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-r-lg p-4 sm:p-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-base sm:text-lg leading-relaxed text-blue-900 font-medium">
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="px-6 sm:px-8 lg:px-10 py-4"
              >
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 rounded-r-lg p-4 sm:p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <p className="text-base sm:text-lg leading-relaxed text-red-900 font-medium">
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="px-6 sm:px-8 lg:px-10 py-4"
              >
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-r-lg p-4 sm:p-6">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <p className="text-base sm:text-lg leading-relaxed text-green-900 font-medium">
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="px-6 sm:px-8 lg:px-10 py-6"
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-[#2F5D50]" />
                    <h3 className="text-lg font-semibold text-[#1F2933]">
                      {section.content as string}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {section.stats?.map((stat, statIndex) => (
                      <motion.div
                        key={statIndex}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: statIndex * 0.1, duration: 0.4 }}
                        className="text-center p-4 bg-gradient-to-br from-[#F4F7F5] to-white rounded-lg border border-gray-100"
                      >
                        <p className="text-2xl font-bold text-[#2F5D50] mb-1">
                          {stat.value}
                        </p>
                        <p className="text-sm text-[#6B7280] font-medium">
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