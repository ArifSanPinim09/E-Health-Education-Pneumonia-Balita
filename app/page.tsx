import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { StatisticsSection } from '@/components/landing/StatisticsSection';
import { CTASection } from '@/components/landing/CTASection';
import GeminiChatBot from '@/components/chat/GeminiChatBot';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroSection />
        <HowItWorksSection />
        <BenefitsSection />
        <StatisticsSection />
        <CTASection />
      </main>
      <GeminiChatBot />
    </>
  );
}
