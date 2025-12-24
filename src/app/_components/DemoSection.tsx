"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, Loader2, Mail, X, Copy, Check } from "lucide-react";
import { FishIcon, BubbleEffect } from "./FishIcon";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

type Verdict = "SAFE" | "SUSPICIOUS" | "DANGER";

interface ScanResult {
  verdict: Verdict;
  score: number;
  reasons: string[];
  provider: "ThreatIntel" | "Gemini";
}

const samplePhishingEmail = `From: security@paypa1-alerts.com
Subject: URGENT: Your Account Has Been Limited!

Dear Valued Customer,

We have noticed some unusual activity on your account and need you to verify your information immediately to avoid suspension.

Click here to verify: http://paypa1-secure.xyz/verify

If you do not respond within 24 hours, your account will be permanently limited.

PayPal Security Team`;

const sampleSafeEmail = `From: newsletter@techcompany.com
Subject: Your Weekly Tech Digest

Hi there,

Here's your weekly roundup of the latest tech news and updates from our team.

- New feature release: Dark mode is now available
- Tips: 5 ways to improve your workflow
- Community spotlight: Meet our users

Best regards,
The Tech Company Team

Unsubscribe: https://techcompany.com/unsubscribe`;

const verdictConfig = {
  SAFE: {
    color: "bg-accent/20 text-accent border-accent/30",
    barColor: "bg-accent",
    icon: CheckCircle,
    label: "Looks Safe",
    recommendation: "This email appears legitimate, but always stay vigilant.",
  },
  SUSPICIOUS: {
    color: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
    barColor: "bg-yellow-500",
    icon: AlertTriangle,
    label: "Suspicious",
    recommendation: "Proceed with caution. Verify the sender through official channels before taking action.",
  },
  DANGER: {
    color: "bg-coral/20 text-coral border-coral/30",
    barColor: "bg-coral",
    icon: AlertTriangle,
    label: "Phishing Detected",
    recommendation: "Do not click any links. Report this email as phishing and delete it.",
  },
};

export function DemoSection() {
  const [emailContent, setEmailContent] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [copied, setCopied] = useState(false);

  const scanMutation = api.scan.analyzeText.useMutation({
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error) => {
      console.error("Scan failed:", error);
      // Show a fallback result on error
      setResult({
        verdict: "SUSPICIOUS",
        score: 50,
        reasons: ["Unable to complete full analysis - proceed with caution"],
        provider: "Gemini",
      });
    },
  });

  const analyzeEmail = () => {
    if (!emailContent.trim()) return;
    setResult(null);
    scanMutation.mutate({
      text: emailContent,
      source: "web",
    });
  };

  const loadSample = (type: "phishing" | "safe") => {
    setEmailContent(type === "phishing" ? samplePhishingEmail : sampleSafeEmail);
    setResult(null);
  };

  const clearDemo = () => {
    setEmailContent("");
    setResult(null);
  };

  const copyResult = async () => {
    if (!result) return;
    const text = `Smells Phishy Analysis:
Verdict: ${result.verdict}
Score: ${result.score}%
Reasons:
${result.reasons.map(r => `- ${r}`).join('\n')}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const config = result ? verdictConfig[result.verdict] : null;
  const Icon = config?.icon;

  return (
    <section id="demo" className="py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
      <BubbleEffect count={8} />

      <div className="max-w-4xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-mono text-primary uppercase tracking-wider">
            Interactive Demo
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mt-4 mb-6">
            Test the <span className="text-coral">Waters</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Paste any email and get an instant verdict. Try our sample emails to see
            how Smells Phishy catches the sneaky stuff.
          </p>
        </div>

        {/* Demo Card */}
        <div className="bg-card/80 backdrop-blur-lg border border-border rounded-xl p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Email Content</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => loadSample("phishing")}
                className="px-3 py-1.5 text-sm rounded-md border border-border hover:bg-muted transition-colors"
              >
                Load Phishing Sample
              </button>
              <button
                onClick={() => loadSample("safe")}
                className="px-3 py-1.5 text-sm rounded-md border border-border hover:bg-muted transition-colors"
              >
                Load Safe Sample
              </button>
              {emailContent && (
                <button
                  onClick={clearDemo}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Textarea */}
          <textarea
            placeholder="Paste the full email content here, including headers if available..."
            className="w-full min-h-[200px] p-4 font-mono text-sm rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            value={emailContent}
            onChange={(e) => {
              setEmailContent(e.target.value);
              if (result) setResult(null);
            }}
          />

          {/* Analyze Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={analyzeEmail}
              disabled={!emailContent.trim() || scanMutation.isPending}
              className={cn(
                "flex items-center gap-2 px-6 py-3 text-lg font-medium rounded-lg transition-all",
                "bg-coral text-coral-foreground hover:bg-coral/90",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {scanMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sniffing for Phish...
                </>
              ) : (
                <>
                  <FishIcon className="w-5 h-5 group-hover:animate-wiggle" />
                  Check If Phishy
                </>
              )}
            </button>
          </div>

          {/* Results */}
          {result && config && Icon && (
            <div className="mt-8 p-6 rounded-lg border bg-card/50 animate-fade-up">
              {/* Verdict Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", config.color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className={cn("inline-block px-2 py-1 text-sm font-medium rounded mb-1", config.color)}>
                      {config.label}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      Risk Score: {result.score}% | Analyzed by: {result.provider}
                    </p>
                  </div>
                </div>
                {/* Score bar */}
                <div className="flex items-center gap-2">
                  <div className="w-24 h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full transition-all duration-500", config.barColor)}
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                  <button
                    onClick={copyResult}
                    className="p-2 rounded-md hover:bg-muted transition-colors"
                    title="Copy result"
                  >
                    {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Findings */}
              <div className="mb-6">
                <h4 className="font-heading font-semibold mb-3">Analysis Findings</h4>
                <ul className="space-y-2">
                  {result.reasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span
                        className={cn(
                          "mt-1.5 w-1.5 h-1.5 rounded-full shrink-0",
                          result.verdict === "SAFE" ? "bg-accent" : "bg-coral"
                        )}
                      />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendation */}
              <div className="p-4 rounded-md bg-muted/50 border border-border">
                <p className="text-sm">
                  <strong>Recommendation:</strong> {config.recommendation}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Privacy note */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-accent" />
            Your email content is processed in real-time and never stored.
          </span>
        </p>
      </div>
    </section>
  );
}

