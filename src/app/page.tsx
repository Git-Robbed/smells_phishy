import { Header } from "~/app/_components/Header";
import { HeroSection } from "~/app/_components/HeroSection";
import { FeaturesSection } from "~/app/_components/FeaturesSection";
import { DemoSection } from "~/app/_components/DemoSection";
import { HowItWorksSection } from "~/app/_components/HowItWorksSection";
import { Footer } from "~/app/_components/Footer";
import { HydrateClient } from "~/trpc/server";

export default function Home() {
  return (
    <HydrateClient>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <FeaturesSection />
          <DemoSection />
          <HowItWorksSection />
        </main>
        <Footer />
      </div>
    </HydrateClient>
  );
}
