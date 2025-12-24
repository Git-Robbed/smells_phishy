"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { FishIcon } from "./FishIcon";
import { cn } from "~/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2 group"
          >
            <FishIcon className="w-8 h-8 group-hover:animate-wiggle" />
            <span className="font-serif text-xl font-bold">
              Smells <span className="text-coral">Phishy</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("demo")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Try Demo
            </button>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scrollToSection("demo")}
              className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
            >
              Try Demo
            </button>
            <button
              onClick={() => scrollToSection("demo")}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-coral text-coral-foreground hover:bg-coral/90 transition-colors"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border">
          <nav className="flex flex-col p-4 gap-2">
            <button
              onClick={() => scrollToSection("features")}
              className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("demo")}
              className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Try Demo
            </button>
            <button
              className="mt-2 px-4 py-2 text-sm font-medium rounded-lg bg-coral text-coral-foreground hover:bg-coral/90 transition-colors"
              onClick={() => scrollToSection("demo")}
            >
              Get Started
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

