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
    <article className="content-renderer">
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
                className="px-6 sm:px-8 lg:px-12 pt-10 pb-4 first:pt-8"
              >
                <h2 className="text-xl sm:text-2xl font-serif text-[#1F2933] leading-tight">
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
                className="px-6 sm:px-8 lg:px-12 py-3"
              >
                <p className="text-[#1F2933]/80 text-base sm:text-lg leading-relaxed sm:leading-loose">
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
                className="px-6 sm:px-8 lg:px-12 py-3"
              >
                <ul className="space-y-3">
                  {(section.content as string[]).map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-[#1F2933]/80 text-base sm:text-lg leading-relaxed sm:leading-loose"
                    >
                      <span className="text-[#2F5D50] font-bold flex-shrink-0 mt-1.5">•</span>
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
                className="px-6 sm:px-8 lg:px-12 py-6"
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
                className="px-6 sm:px-8 lg:px-12 py-6"
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
      
      {/* Bottom Spacing */}
      <div className="h-8"></div>
    </article>
  );
}
