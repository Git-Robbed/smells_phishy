/**
 * Gemini AI integration for phishing detection
 * Layer 2 of the detection system - contextual analysis of email content
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "~/env";

export interface GeminiAnalysisResult {
  score: number; // 0-100 risk score
  verdict: "SAFE" | "SUSPICIOUS" | "DANGER";
  reasons: string[];
  summary: string;
}

const PHISHING_DETECTION_PROMPT = `You are a cybersecurity expert specializing in phishing detection. Analyze the following email content for signs of phishing or social engineering attacks.

Evaluate the email based on these criteria:

1. **Urgency Tactics**: Look for phrases like "act now", "account suspended", "24 hours", "immediately", "urgent action required"

2. **Authority Impersonation**: Check if the sender claims to be from a well-known company (PayPal, Amazon, Google, banks) but the email domain doesn't match

3. **Suspicious Links**: Look for URLs that:
   - Use lookalike domains (paypa1.com, amaz0n.com)
   - Use URL shorteners
   - Use suspicious TLDs (.xyz, .tk, .ml, .ga, .cf)
   - Don't match the claimed sender

4. **Generic Greetings**: "Dear Valued Customer", "Dear User", "Dear Account Holder" instead of using the recipient's name

5. **Grammar and Spelling**: Poor grammar, spelling mistakes, or awkward phrasing in supposedly professional emails

6. **Request for Sensitive Info**: Asking for passwords, credit card numbers, SSN, or to "verify" account details

7. **Mismatched Headers**: Reply-To address different from From address, or suspicious routing

8. **Threatening Language**: Threats of account closure, legal action, or other consequences

Provide your analysis in the following JSON format:
{
  "score": <number 0-100, where 0 is completely safe and 100 is definitely phishing>,
  "verdict": "<SAFE if score < 30, SUSPICIOUS if 30-70, DANGER if > 70>",
  "reasons": [<array of specific findings, max 5 most important>],
  "summary": "<one sentence summary of your assessment>"
}

Only output valid JSON, nothing else.`;

/**
 * Analyze email content using Gemini Flash for phishing detection
 */
export async function analyzeWithGemini(
  emailContent: string
): Promise<GeminiAnalysisResult> {
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  
  // Use Gemini Flash for speed
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.1, // Low temperature for consistent analysis
      maxOutputTokens: 1024,
    },
  });

  try {
    const prompt = `${PHISHING_DETECTION_PROMPT}

EMAIL CONTENT TO ANALYZE:
---
${emailContent}
---

Analyze this email and provide your assessment in JSON format:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    // Extract JSON from the response (handle potential markdown code blocks)
    let jsonStr = text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1]!.trim();
    }

    const analysis = JSON.parse(jsonStr) as {
      score: number;
      verdict: string;
      reasons: string[];
      summary: string;
    };

    // Validate and normalize the response
    const score = Math.max(0, Math.min(100, analysis.score));
    let verdict: "SAFE" | "SUSPICIOUS" | "DANGER";
    
    if (score < 30) {
      verdict = "SAFE";
    } else if (score <= 70) {
      verdict = "SUSPICIOUS";
    } else {
      verdict = "DANGER";
    }

    return {
      score,
      verdict,
      reasons: Array.isArray(analysis.reasons) ? analysis.reasons.slice(0, 5) : [],
      summary: analysis.summary ?? "Analysis complete",
    };
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    
    // Return a conservative "unknown" result on error
    return {
      score: 50,
      verdict: "SUSPICIOUS",
      reasons: ["Unable to complete AI analysis - proceed with caution"],
      summary: "AI analysis encountered an error",
    };
  }
}

