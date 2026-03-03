import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MediaEmbed from '@/components/session/MediaEmbed';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, onLoad, onError, ...props }: any) => {
    return (
      <img
        src={src}
        alt={alt}
        onLoad={onLoad}
        onError={onError}
        {...props}
      />
    );
  },
}));

// Mock environment variable
beforeEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
});

describe('MediaEmbed Component', () => {
  describe('Image Embed', () => {
    it('should render image with loading state initially', () => {
      render(
        <MediaEmbed
          type="image"
          mediaUrl="images/test-image.png"
          alt="Test image"
        />
      );

      // Loading spinner should be visible
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should construct correct Supabase URL for image', () => {
      render(
        <MediaEmbed
          type="image"
          mediaUrl="images/gambar-ibu.png"
          alt="Gambar ibu"
        />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute(
        'src',
        'https://test.supabase.co/storage/v1/object/public/media-assets/images/gambar-ibu.png'
      );
    });

    it('should display error message when image fails to load', async () => {
      render(
        <MediaEmbed
          type="image"
          mediaUrl="images/nonexistent.png"
          alt="Test image"
        />
      );

      const img = screen.getByRole('img');
      fireEvent.error(img);

      await waitFor(() => {
        expect(screen.getByText('Gagal memuat gambar')).toBeInTheDocument();
      });
    });

    it('should hide loading state when image loads successfully', async () => {
      render(
        <MediaEmbed
          type="image"
          mediaUrl="images/test.png"
          alt="Test image"
        />
      );

      const img = screen.getByRole('img');
      fireEvent.load(img);

      await waitFor(() => {
        expect(screen.queryByText('Memuat gambar...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Video Embed', () => {
    it('should render video element', () => {
      render(
        <MediaEmbed
          type="video"
          mediaUrl="videos/test-video.mp4"
          alt="Test video"
        />
      );

      // Video should be in the document (might be hidden initially)
      const videos = document.querySelectorAll('video');
      expect(videos.length).toBeGreaterThan(0);
    });

    it('should construct correct Supabase URL for video', () => {
      render(
        <MediaEmbed
          type="video"
          mediaUrl="videos/video-suhu.mp4"
          alt="Video suhu"
        />
      );

      const video = document.querySelector('video');
      expect(video).toHaveAttribute(
        'src',
        'https://test.supabase.co/storage/v1/object/public/media-assets/videos/video-suhu.mp4'
      );
    });

    it('should have playsInline attribute for mobile compatibility', () => {
      render(
        <MediaEmbed
          type="video"
          mediaUrl="videos/test.mp4"
          alt="Test video"
        />
      );

      const video = document.querySelector('video');
      expect(video).toHaveAttribute('playsInline');
    });

    it('should have preload metadata attribute', () => {
      render(
        <MediaEmbed
          type="video"
          mediaUrl="videos/test.mp4"
          alt="Test video"
        />
      );

      const video = document.querySelector('video');
      expect(video).toHaveAttribute('preload', 'metadata');
    });

    it('should display video caption', async () => {
      render(
        <MediaEmbed
          type="video"
          mediaUrl="videos/test.mp4"
          alt="Tutorial mengukur suhu"
        />
      );

      const video = document.querySelector('video');
      if (video) {
        fireEvent.loadedData(video);
      }

      await waitFor(() => {
        expect(screen.getByText(/Tutorial mengukur suhu/)).toBeInTheDocument();
      });
    });

    it('should display error message when video fails to load', async () => {
      render(
        <MediaEmbed
          type="video"
          mediaUrl="videos/nonexistent.mp4"
          alt="Test video"
        />
      );

      const video = document.querySelector('video');
      if (video) {
        fireEvent.error(video);
      }

      await waitFor(() => {
        expect(screen.getByText('Gagal memuat video')).toBeInTheDocument();
      });
    });

    it('should have play button when video is paused', async () => {
      render(
        <MediaEmbed
          type="video"
          mediaUrl="videos/test.mp4"
          alt="Test video"
        />
      );

      const video = document.querySelector('video');
      if (video) {
        fireEvent.loadedData(video);
      }

      await waitFor(() => {
        const playButtons = screen.getAllByLabelText(/play/i);
        expect(playButtons.length).toBeGreaterThan(0);
      });
    });

    it('should have volume controls', async () => {
      render(
        <MediaEmbed
          type="video"
          mediaUrl="videos/test.mp4"
          alt="Test video"
        />
      );

      const video = document.querySelector('video');
      if (video) {
        fireEvent.loadedData(video);
      }

      await waitFor(() => {
        const muteButtons = screen.getAllByLabelText(/mute|unmute/i);
        expect(muteButtons.length).toBeGreaterThan(0);
      });
    });

    it('should have fullscreen button', async () => {
      render(
        <MediaEmbed
          type="video"
          mediaUrl="videos/test.mp4"
          alt="Test video"
        />
      );

      const video = document.querySelector('video');
      if (video) {
        fireEvent.loadedData(video);
      }

      await waitFor(() => {
        expect(screen.getByLabelText('Fullscreen')).toBeInTheDocument();
      });
    });
  });

  describe('Invalid Type', () => {
    it('should return null for invalid media type', () => {
      const { container } = render(
        <MediaEmbed
          type={'invalid' as any}
          mediaUrl="test.file"
          alt="Test"
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });
});
