'use client';

import { ContentSection } from '@/lib/constants/session-content';
import MediaEmbed from './MediaEmbed';
import { motion } from 'framer-motion';

interface ContentRendererProps {
  sections: ContentSection[];
}

export default function ContentRenderer({ sections }: ContentRendererProps) {
  // Count only headings for numbering
  let headingNumber = 0;

  return (
    <div className="content-renderer">
      {sections.map((section, index) => {
        // Increment heading number only for heading type
        if (section.type === 'heading') {
          headingNumber++;
        }

        switch (section.type) {
          case 'heading':
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3 }}
                className="px-6 py-4 border-b border-gray-200 bg-gray-50"
              >
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="bg-blue-600 text-white rounded-lg w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {headingNumber}
                  </span>
                  {section.content as string}
                </h2>
              </motion.div>
            );
          
          case 'paragraph':
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3 }}
                className="px-6 py-4"
              >
                <p className="text-gray-700 leading-relaxed">
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
                transition={{ duration: 0.3 }}
                className="px-6 py-4 bg-blue-50"
              >
                <ul className="space-y-2">
                  {(section.content as string[]).map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-gray-700 leading-relaxed"
                    >
                      <span className="text-blue-600 font-bold flex-shrink-0 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          
          case 'image':
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3 }}
                className="px-6 py-4"
              >
                <MediaEmbed
                  type="image"
                  mediaUrl={section.media_url || ''}
                  alt={section.alt || section.content as string}
                />
              </motion.div>
            );
          
          case 'video':
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3 }}
                className="px-6 py-4 bg-gray-50"
              >
                <MediaEmbed
                  type="video"
                  mediaUrl={section.media_url || ''}
                  alt={section.alt || section.content as string}
                />
              </motion.div>
            );
          
          default:
            return null;
        }
      })}
    </div>
  );
}
