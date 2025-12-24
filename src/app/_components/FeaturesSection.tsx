"use client";

import { Brain, Lock, Eye, Zap, FileCheck, Shield } from "lucide-react";
import { FishIcon } from "./FishIcon";
import { cn } from "~/lib/utils";

const features = [
  {
    icon: Brain,
    title: "Hybrid Detection",
    description:
      "Combines deterministic header analysis with Gemini-powered language understanding for maximum accuracy.",
    fishVariant: "default" as const,
  },
  {
    icon: Lock,
    title: "Zero Data Retention",
    description:
      "Your emails are processed in real-time and never stored. Complete privacy by design.",
    fishVariant: "safe" as const,
  },
  {
    icon: Eye,
    title: "Human Explanations",
    description:
      "Every verdict comes with clear, educational reasons so you understand exactly why something smells phishy.",
    fishVariant: "default" as const,
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description:
      "Get results in under 3 seconds. Paste an email, click check, get your verdict.",
    fishVariant: "safe" as const,
  },
  {
    icon: FileCheck,
    title: "Threat Intelligence",
    description:
      "Checks against Google Safe Browsing, PhishTank, and urlscan.io for known threats.",
    fishVariant: "default" as const,
  },
  {
    icon: Shield,
    title: "Pattern Recognition",
    description:
      'Spots "Dear User" greetings, urgency tactics, fake brands, and other classic phishing tells.',
    fishVariant: "alert" as const,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-mono text-primary uppercase tracking-wider">
            Why Trust Smells Phishy
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mt-4 mb-6">
            Catch What Others <span className="text-coral">Miss</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Most phishing detectors rely on blacklists. We combine AI with signal analysis
            to catch sophisticated attacks that slip through traditional filters.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "group relative p-6 rounded-xl bg-card border border-border",
                "transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center group-hover:animate-float">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <FishIcon
                    variant={feature.fishVariant}
                    className="absolute -right-2 -top-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

