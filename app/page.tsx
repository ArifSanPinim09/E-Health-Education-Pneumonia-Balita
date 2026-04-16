import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { StatisticsSection } from '@/components/landing/StatisticsSection';
import { CTASection } from '@/components/landing/CTASection';
import { VideoGuide } from '@/components/shared/VideoGuide';
import GeminiChatBot from '@/components/chat/GeminiChatBot';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroSection />
        <StatisticsSection />
        <BenefitsSection />
        <HowItWorksSection />
        <VideoGuide variant="landing" />
        <CTASection />
      </main>
      <GeminiChatBot />
    </>
  );
}
