"use client";

import { ArrowRight, Shield } from "lucide-react";
import { FishIcon, BubbleEffect } from "./FishIcon";

export function HeroSection() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
    >
      {/* Ocean gradient background */}
      <div className="absolute inset-0 bg-ocean-gradient" />

      {/* Glow effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-coral/10 rounded-full blur-2xl" />
      </div>

      {/* Animated bubbles */}
      <BubbleEffect />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-20">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 opacity-0 animate-fade-up"
          style={{ animationDelay: "0ms" }}
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm text-white/90 font-medium">
            Privacy-first phishing detection
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 opacity-0 animate-fade-up leading-tight"
          style={{ animationDelay: "100ms" }}
        >
          Does That Email
          <br />
          <span className="text-coral">Smell Phishy?</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-sans opacity-0 animate-fade-up"
          style={{ animationDelay: "200ms" }}
        >
          Combining AI-powered language analysis with real-time threat intelligence
          to catch the sneakiest phishing attempts. Zero data stored. Maximum protection.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up"
          style={{ animationDelay: "300ms" }}
        >
          <button
            onClick={() => scrollToSection("demo")}
            className="group flex items-center gap-2 px-6 py-3 text-lg font-medium rounded-lg bg-coral text-coral-foreground hover:bg-coral/90 transition-all"
          >
            Test the Waters
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => scrollToSection("features")}
            className="flex items-center gap-2 px-6 py-3 text-lg font-medium rounded-lg bg-white/10 text-white border border-white/30 backdrop-blur-sm hover:bg-white/20 transition-all"
          >
            <Shield className="w-5 h-5" />
            Learn More
          </button>
        </div>

        {/* Stats */}
        <div
          className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto opacity-0 animate-fade-up"
          style={{ animationDelay: "400ms" }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-white font-heading">95%+</div>
            <div className="text-sm text-white/60">Detection Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white font-heading">0</div>
            <div className="text-sm text-white/60">Data Stored</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white font-heading">&lt;3s</div>
            <div className="text-sm text-white/60">To Verdict</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-up"
        style={{ animationDelay: "500ms" }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

