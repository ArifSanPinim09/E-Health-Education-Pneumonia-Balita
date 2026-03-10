'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Loader2, ZoomIn, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaEmbedProps {
  type: 'image' | 'video';
  mediaUrl: string;
  alt: string;
}

// Helper function to convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  // Check if it's a YouTube URL
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(youtubeRegex);
  
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  
  return null;
}

export default function MediaEmbed({ type, mediaUrl, alt }: MediaEmbedProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  // Check if video is from YouTube
  const youtubeEmbedUrl = type === 'video' ? getYouTubeEmbedUrl(mediaUrl) : null;
  
  // Determine the full media URL
  let fullMediaUrl: string;
  if (youtubeEmbedUrl) {
    // Use YouTube embed URL for videos
    fullMediaUrl = youtubeEmbedUrl;
  } else if (mediaUrl.startsWith('/')) {
    // Use local path for images starting with '/'
    fullMediaUrl = mediaUrl;
  } else {
    // Use Supabase storage for other media
    fullMediaUrl = `${supabaseUrl}/storage/v1/object/public/media-assets/${mediaUrl}`;
  }

  if (type === 'image') {
    return (
      <>
        <div className="my-8 group">
          <motion.div
            whileHover={{ scale: 1.005 }}
            className="relative rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            onClick={() => setShowImageModal(true)}
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-50">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-[#2F5D50] mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Memuat gambar...</p>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-400 text-3xl mb-2">📷</div>
                <p className="text-red-600 text-sm font-medium mb-1">Gagal memuat gambar</p>
                <p className="text-red-500 text-xs">Silakan refresh halaman</p>
              </div>
            )}
            <div className="relative">
              <Image
                src={fullMediaUrl}
                alt={alt}
                width={1200}
                height={800}
                className="rounded-lg w-full h-auto"
                priority={false}
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setError(true);
                }}
              />
              {/* Zoom overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center rounded-lg">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg"
                >
                  <ZoomIn className="w-4 h-4 text-gray-700" />
                </motion.div>
              </div>
            </div>
          </motion.div>
          {/* Caption */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-gray-500 mt-2 text-center italic"
          >
            {alt}
          </motion.p>
        </div>

        {/* Image Modal */}
        <AnimatePresence>
          {showImageModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowImageModal(false)}
            >
              <button
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-lg p-2 transition-colors"
                onClick={() => setShowImageModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="max-w-6xl max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={fullMediaUrl}
                  alt={alt}
                  width={1920}
                  height={1080}
                  className="rounded-lg w-full h-auto"
                />
                <p className="text-white text-center mt-3 text-sm">{alt}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  if (type === 'video') {
    return (
      <div className="my-8">
        {loading && (
          <div className="flex items-center justify-center bg-gray-50 rounded-lg p-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#2F5D50] mx-auto mb-2" />
              <p className="text-gray-500 text-xs">Memuat video...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-400 text-3xl mb-2">🎥</div>
            <p className="text-red-600 text-sm font-medium mb-1">Gagal memuat video</p>
            <p className="text-red-500 text-xs">Silakan refresh halaman atau coba lagi nanti</p>
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: loading || error ? 0 : 1, scale: loading || error ? 0.98 : 1 }}
          className={`relative rounded-lg overflow-hidden shadow-md bg-gray-900 ${loading || error ? 'hidden' : ''}`}
        >
          {/* YouTube Embed */}
          <iframe
            src={fullMediaUrl}
            className="w-full aspect-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            title={alt}
          />
        </motion.div>

        {/* Video Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs sm:text-sm text-gray-500 mt-2 text-center italic"
        >
          🎥 {alt}
        </motion.p>
      </div>
    );
  }

  return null;
}
