"use client";

import { Mail, Search, Brain, CheckCircle } from "lucide-react";
import { cn } from "~/lib/utils";

const steps = [
  {
    icon: Mail,
    title: "Paste Email",
    description: "Copy any suspicious email and paste it into our scanner",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Search,
    title: "Threat Check",
    description: "URLs checked against Google Safe Browsing, PhishTank & urlscan.io",
    color: "text-teal",
    bgColor: "bg-teal/10",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Gemini AI analyzes language patterns, urgency tactics, and social engineering",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: CheckCircle,
    title: "Get Verdict",
    description: "Receive a clear Safe, Suspicious, or Danger verdict with explanations",
    color: "text-coral",
    bgColor: "bg-coral/10",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-mono text-primary uppercase tracking-wider">
            Simple & Fast
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mt-4 mb-6">
            How It <span className="text-coral">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From suspicious email to verdict in under 3 seconds. Our two-layer approach
            combines known threat databases with AI-powered analysis.
          </p>
        </div>

        {/* Steps - Horizontal on desktop, vertical on mobile */}
        <div className="relative">
          {/* Connection line - desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                {/* Connection line - mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden absolute left-6 top-16 bottom-0 w-0.5 bg-border -mb-8" />
                )}

                <div className="relative bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
                  {/* Step number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-sm font-bold text-primary">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                      step.bgColor
                    )}
                  >
                    <step.icon className={cn("w-6 h-6", step.color)} />
                  </div>

                  {/* Content */}
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>

                {/* Arrow - desktop only */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-4 h-4 rotate-45 border-t-2 border-r-2 border-primary bg-background" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              All analysis happens in real-time. Your data is never stored.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

