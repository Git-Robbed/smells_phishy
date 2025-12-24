"use client";

import { Github, Twitter, Mail } from "lucide-react";
import { FishIcon } from "./FishIcon";

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
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30 animate-pulse-glow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
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

