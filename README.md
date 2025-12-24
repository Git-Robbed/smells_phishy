# Smells Phishy

**Privacy-first phishing detection powered by AI.**

Smells Phishy is a web application that uses a hybrid detection engine combining real-time threat intelligence with LLM-based behavioral analysis to detect both known malware and novel social engineering attacks.

## Features

- **Hybrid Detection**: Combines deterministic threat intelligence checks with Gemini AI language analysis
- **Zero Data Retention**: Emails are processed in real-time and never stored
- **Instant Analysis**: Get verdicts in under 3 seconds
- **Human Explanations**: Clear, educational reasons for every verdict
- **Threat Intelligence**: Checks against Google Safe Browsing, PhishTank, and urlscan.io

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: tRPC for type-safe APIs
- **AI**: Google Gemini Flash
- **Threat Intel**: Google Safe Browsing, PhishTank, urlscan.io

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smells-phishy.git
cd smells-phishy
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your API keys:
```env
# Threat Intelligence APIs
GOOGLE_SAFE_BROWSING_API_KEY=your_key_here
URLSCAN_API_KEY=your_key_here

# Google Gemini
GEMINI_API_KEY=your_key_here

# Optional
PHISHTANK_API_KEY=
DATABASE_URL=
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## API Keys

You'll need the following API keys:

| Service | URL | Required |
|---------|-----|----------|
| Google Safe Browsing | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) | Yes |
| urlscan.io | [urlscan.io Profile](https://urlscan.io/user/profile/) | Yes |
| Google Gemini | [AI Studio](https://aistudio.google.com/app/apikey) | Yes |
| PhishTank | [PhishTank API](https://phishtank.org/api_info.php) | No |

## How It Works

### Layer 1: Threat Intelligence
Extracts URLs from the email and checks them against:
- Google Safe Browsing API (malware, social engineering, unwanted software)
- PhishTank (community-verified phishing sites)
- urlscan.io (historical malicious verdicts)

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

Deploy to Vercel:

```bash
npm run build
vercel deploy
```

Remember to set your environment variables in the Vercel dashboard.

## Privacy

- **No data is stored**: All email analysis happens in real-time
- **No logging of content**: Only anonymized metadata for analytics
- **API keys are server-side only**: Never exposed to the client

## License

MIT

## Author

Rob Porter
