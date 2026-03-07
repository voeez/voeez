import Hero from "@/components/Hero";
import PainSection from "@/components/PainSection";
import AppTicker from "@/components/AppTicker";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import VideoSection from "@/components/VideoSection";
import Testimonials from "@/components/Testimonials";
import MidCTA from "@/components/MidCTA";
import PricingCards from "@/components/PricingCards";
import BetaPricing from "@/components/BetaPricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import { isBetaMode } from "@/lib/betaMode";

export default function Home() {
  return (
    <>
      <Hero />
      <PainSection />
      <AppTicker />
      <Features />
      <HowItWorks />
      <VideoSection />
      <Testimonials />
      <MidCTA />
      {isBetaMode ? <BetaPricing /> : <PricingCards />}
      <FAQ />
      <FinalCTA />
    </>
  );
}
