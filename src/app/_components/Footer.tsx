"use client";

import { Github, Twitter, Mail } from "lucide-react";
import { FishIcon } from "./FishIcon";

// Pre-computed positions to avoid hydration mismatch from Math.random()
const dotPositions = [
  { left: 5, top: 12, delay: 0.1 },
  { left: 92, top: 45, delay: 1.2 },
  { left: 23, top: 78, delay: 0.5 },
  { left: 67, top: 23, delay: 1.8 },
  { left: 45, top: 89, delay: 0.3 },
  { left: 78, top: 56, delay: 1.5 },
  { left: 12, top: 34, delay: 0.8 },
  { left: 56, top: 67, delay: 1.1 },
  { left: 34, top: 91, delay: 0.6 },
  { left: 89, top: 15, delay: 1.9 },
  { left: 18, top: 52, delay: 0.2 },
  { left: 71, top: 38, delay: 1.4 },
  { left: 42, top: 73, delay: 0.9 },
  { left: 95, top: 82, delay: 0.4 },
  { left: 8, top: 61, delay: 1.7 },
  { left: 63, top: 19, delay: 0.7 },
  { left: 29, top: 44, delay: 1.3 },
  { left: 84, top: 71, delay: 0.15 },
  { left: 51, top: 28, delay: 1.6 },
  { left: 76, top: 95, delay: 1.0 },
];

const footerLinks = {
  product: [
    { label: "Web App", href: "#demo" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
  ],
  resources: [
    { label: "Phishing Guide", href: "#" },
    { label: "Blog", href: "#" },
    { label: "API Docs", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "#" },
  ],
};

export function Footer() {
  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const id = href.slice(1);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-navy text-white relative overflow-hidden">
      {/* Bioluminescent dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {dotPositions.map((pos, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30 animate-pulse-glow"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              animationDelay: `${pos.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 relative">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <FishIcon className="w-8 h-8 text-primary" />
              <span className="font-serif text-xl font-bold">
                Smells <span className="text-coral">Phishy</span>
              </span>
            </div>
            <p className="text-white/60 text-sm mb-6 max-w-xs">
              Privacy-first phishing detection powered by AI. Never store data,
              always protect users.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>&copy; {new Date().getFullYear()} Smells Phishy. Don&apos;t get hooked.</p>
          <p className="flex items-center gap-2">
            Made with <FishIcon className="w-4 h-4 text-coral inline" /> by Rob Porter
          </p>
        </div>
      </div>
    </footer>
  );
}

