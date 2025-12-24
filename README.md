# Smells Phishy

**Privacy-first phishing detection powered by AI.**

Smells Phishy is a web application that uses a hybrid detection engine combining real-time threat intelligence with LLM-based behavioral analysis to detect both known malware and novel social engineering attacks.

## Features

- **Hybrid Detection**: Combines deterministic threat intelligence checks with Gemini AI language analysis
- **Zero Data Retention**: Emails are processed in real-time and never stored
- **Instant Analysis**: Get verdicts in under 3 seconds
- **Human Explanations**: Clear, educational reasons for every verdict
- **Free Tier Optimized**: Built to stay within free API quotas
- **Rate Limited**: Protects against abuse (10 scans/hour per user)

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: tRPC for type-safe APIs
- **AI**: Google Gemini Flash (1,500 free requests/day)
- **Threat Intel**: Google Safe Browsing, PhishTank, urlscan.io (optional)
- **Rate Limiting**: Upstash Redis (optional) or in-memory

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Git-Robbed/smells_phishy.git
cd smells_phishy
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your API keys:
```env
# Required - Threat Intelligence
GOOGLE_SAFE_BROWSING_API_KEY=your_key_here

# Required - AI Analysis
GEMINI_API_KEY=your_key_here

# Optional - Enhanced threat detection (limited free tier)
URLSCAN_API_KEY=
PHISHTANK_API_KEY=

# Optional - Persistent rate limiting (free tier: 10k commands/day)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Optional - Not needed for core functionality
DATABASE_URL=
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## API Keys & Free Tiers

| Service | Free Tier | Get Key | Required |
|---------|-----------|---------|----------|
| **Google Safe Browsing** | 10,000/day | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) | Yes |
| **Google Gemini** | 1,500/day, 15/min | [AI Studio](https://aistudio.google.com/app/apikey) | Yes |
| **urlscan.io** | 1,000/day | [urlscan.io Profile](https://urlscan.io/user/profile/) | No |
| **PhishTank** | Unlimited (slow) | [PhishTank API](https://phishtank.org/api_info.php) | No |
| **Upstash Redis** | 10,000 commands/day | [Upstash](https://upstash.com) | No |

### Free Tier Optimizations

The app is designed to stay within free tiers:

- **Rate Limiting**: 10 scans/hour per IP address
- **Smart API Usage**: urlscan.io only called if primary checks don't find threats
- **Quota Tracking**: Gemini calls tracked to prevent overages
- **Reduced URL Checks**: Max 3 URLs per service per scan

## How It Works

### Layer 1: Threat Intelligence
Extracts URLs from the email and checks them against:
- Google Safe Browsing API (malware, social engineering, unwanted software)
- PhishTank (community-verified phishing sites)
- urlscan.io (historical malicious verdicts) - *only if configured*

If any source flags the content as malicious, an immediate "DANGER" verdict is returned.

### Layer 2: AI Analysis
If no known threats are found, Gemini AI analyzes the email for:
- Urgency tactics ("Act now!", "24 hours")
- Authority impersonation (fake PayPal, Amazon, etc.)
- Suspicious link patterns
- Generic greetings ("Dear Valued Customer")
- Grammar and spelling issues
- Requests for sensitive information

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Settings → Environment Variables
4. Deploy!

### Environment Variables for Vercel

Add these in the Vercel dashboard:

| Variable | Required |
|----------|----------|
| `GOOGLE_SAFE_BROWSING_API_KEY` | Yes |
| `GEMINI_API_KEY` | Yes |
| `URLSCAN_API_KEY` | No |
| `PHISHTANK_API_KEY` | No |
| `UPSTASH_REDIS_REST_URL` | No |
| `UPSTASH_REDIS_REST_TOKEN` | No |

## Privacy

- **No data is stored**: All email analysis happens in real-time
- **No logging of content**: Only anonymized metadata for analytics
- **API keys are server-side only**: Never exposed to the client
- **Rate limiting by IP**: Anonymous, no user tracking

## License

MIT

## Author

Rob Porter
