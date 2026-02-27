# Reactive Content Intelligence System

**Monitors the internet → Identifies trends → Generates timely content**

No more static prompts. Content responds to what people are actually talking about.

---

## How It Works

```
┌─────────────────────────────────────────────────────────┐
│  MONITOR PHASE (Every 6 hours)                         │
│  ├── Twitter: High-engagement tweets about email       │
│  ├── Reddit: Popular posts in relevant subreddits      │
│  ├── HackerNews: Trending discussions                  │
│  └── Google Trends: Rising search queries              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  ANALYZE PHASE (AI-powered)                            │
│  ├── Identify trending pain points                     │
│  ├── Find common questions                             │
│  ├── Detect content gaps                               │
│  └── Generate content ideas with context               │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  GENERATE PHASE (AI creates content)                   │
│  ├── Reddit comments (helpful, contextual)             │
│  ├── Blog post (2000+ words, SEO-optimized)           │
│  ├── Twitter thread (5-7 tweets)                       │
│  └── All tied to real trending discussions             │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  POST PHASE (User validation + auto-posting)           │
│  ├── Review each Reddit comment                        │
│  ├── Approve/reject/edit before posting                │
│  ├── Post to Reddit automatically                      │
│  └── Track posted comments (avoid duplicates)          │
└─────────────────────────────────────────────────────────┘
```

---

## Setup (5 minutes)

### 1. Install Dependencies
```bash
cd scripts
npm install
```

### 2. Configure API Keys
```bash
cp .env.example .env
nano .env
```

Add your keys:
- **OpenRouter API** (openrouter.ai/keys) - Cheaper than direct Anthropic
- **Twitter API** (developer.twitter.com)

### 3. Test It
```bash
npm run intelligence
```

This will:
- Monitor Twitter, Reddit, HackerNews
- Find trending discussions about email/productivity
- Generate content ideas based on real signals
- Save to `signals.json` and `content-ideas.json`

### 4. Generate Content
```bash
npm run generate
```

This will:
- Read content ideas from step 3
- Generate blog posts, tweets, Reddit comments
- Save to `../content/` directory

---

## Usage

### One-Time Run (Manual)
```bash
npm run intelligence  # Gather signals, generate Reddit comment ideas
npm run post-reddit   # Review & post comments (interactive with approval)
npm run generate      # Create blog posts/tweets (optional)
```

**Recommended workflow:**
1. `npm run intelligence` - Find trending discussions
2. `npm run post-reddit` - Engage with comments (you approve each one)
3. `npm run generate` - Create long-form content (if needed)

### Continuous Monitoring (Automated)
```bash
npm run monitor       # Runs every 6 hours via PM2
npm run logs          # Check what it's finding
npm run stop          # Stop monitoring
```

### Cron Job (Alternative to PM2)
```bash
# Add to crontab
crontab -e

# Run every 6 hours
0 */6 * * * cd /path/to/marketing/scripts && npm run intelligence

# Generate content once daily
0 6 * * * cd /path/to/marketing/scripts && npm run generate
```

---

## What Gets Created

### After Intelligence Run:
```
signals.json           # Raw signals from internet
content-ideas.json     # AI-generated content ideas with context
```

### After Generate Run:
```
content/blog/
  └── 2026-02-26-how-to-avoid-email-bankruptcy.md  # Full blog post

content/social/
  ├── 2026-02-26-twitter-thread-email-bankruptcy.json
  └── 2026-02-26-reddit-comments-email-bankruptcy.json
```

---

## Example Output

### Signal Found:
```json
{
  "source": "reddit",
  "subreddit": "entrepreneur",
  "title": "I'm spending 4+ hours a day on email and it's killing my startup",
  "score": 347,
  "comments": 128,
  "url": "https://reddit.com/r/entrepreneur/..."
}
```

### Content Idea Generated:
```json
{
  "title": "Email Overload Is Killing Your Startup: Here's The Fix",
  "signal_context": "Reddit post with 347 upvotes about founder spending 4hrs/day on email",
  "keywords": ["email overload", "startup productivity", "founder burnout"],
  "why_timely": "High engagement on Reddit right now, lots of founders relate",
  "outline": "1. The real cost of email overload...",
  "estimated_reach": "500-1000 views from Reddit alone"
}
```

### Blog Post Created:
- 2000-3000 words
- Addresses the exact pain point from Reddit
- Mentions the discussion that inspired it
- SEO-optimized for the keywords
- Includes CTA to Majordomo

---

## Signals Monitored

### Twitter Queries:
- "email overload"
- "too many emails"
- "inbox zero impossible"
- "drowning in email"
- "email bankruptcy"
- "productivity tips email"

### Reddit Subreddits:
- r/productivity (2M members)
- r/entrepreneur (3.5M members)
- r/startups (1.5M members)
- r/SaaS (150K members)
- r/solopreneur (230K members)

### HackerNews:
- Top 30 stories mentioning: email, productivity, automation, AI

### Google Trends:
- Rising searches related to email automation
- Related queries people are asking

---

## Reactive vs Static Content

### Static (Old Way):
```javascript
// Generate blog post about "email management"
// Always the same topic, regardless of trends
```

### Reactive (New Way):
```javascript
// 1. Reddit: "I'm drowning in 500 emails/day"
// 2. Twitter: "Email bankruptcy again 😭"
// 3. HN: Discussion about email overload at 300 upvotes
// 4. AI: "People are struggling with email volume RIGHT NOW"
// 5. Generate: "How I Went From 500 Emails/Day to Zero Stress"
```

**Reactive content:**
- ✅ Addresses real, trending pain points
- ✅ References actual discussions happening now
- ✅ Higher engagement (people see their problem)
- ✅ Better SEO (targets what people search today)
- ✅ More shareable (timely + relevant)

---

## Customization

### Monitor Different Topics:
Edit `content-intelligence.js`:
```javascript
const SOURCES = {
  twitter: {
    queries: [
      'your custom queries here',
      'e.g., AI automation',
    ]
  },
  reddit: {
    subreddits: ['your', 'subreddits'],
    keywords: ['your', 'keywords']
  }
};
```

### Change Monitoring Frequency:
```bash
# Every 4 hours instead of 6
pm2 start content-intelligence.js --cron '0 */4 * * *'

# Daily at 6am
pm2 start content-intelligence.js --cron '0 6 * * *'
```

### Add More Sources:
Add functions to `content-intelligence.js`:
```javascript
async function monitorQuora() {
  // Scrape Quora for questions
}

async function monitorProductHunt() {
  // Monitor PH discussions
}
```

---

## Cost

**API Costs:**
- **OpenRouter API:** ~$0.15-0.30 per run (70% cheaper than direct Anthropic)
- **Twitter API:** Free tier (sufficient)
- **Reddit/HN:** Free (public APIs)

**Total:** ~$1-2/month if running 2x/day

**Why OpenRouter?**
- Access to Claude 3.5 Sonnet at ~$3/$15 per M tokens (vs Anthropic's $3/$15)
- Can switch models without changing code
- Better rate limits
- No prompt caching needed

**ROI:** One viral blog post (from trending topic) = 1000+ visitors = 10-20 trials = 2-4 customers = $18-36 MRR

---

## Troubleshooting

### "Rate limit exceeded"
- Twitter: Use free tier limits (450 requests/15min)
- Reddit: Add delay between requests
- Anthropic: Use prompt caching (saves 90% cost)

### "No signals found"
- Check API keys in .env
- Verify Twitter credentials work
- Check Reddit isn't blocking your user agent

### "Content not generating"
- Check Anthropic API key
- Verify signals.json exists and has data
- Check content-ideas.json format

---

## Next Steps

1. **Run first intelligence scan:** `npm run intelligence`
2. **Review signals found:** Check `signals.json`
3. **Generate content:** `npm run generate`
4. **Publish:** Move content to blog, post tweets
5. **Automate:** `npm run monitor` for continuous operation

---

## Advanced: Multi-Source Intelligence

Add more signal sources:

**Product Hunt API:**
- Monitor launches in productivity category
- Generate content comparing solutions

**IndieHackers API:**
- Track founder pain points
- Generate case studies

**Twitter Spaces:**
- Monitor live conversations about productivity
- Generate real-time threads

**LinkedIn API:**
- Track viral posts about email/productivity
- Generate professional content

---

## Philosophy

**2016:** Generate content and hope people care
**2026:** See what people care about, then generate content

**Your content is always relevant because it responds to real signals.**

---

Ready to start? Run `npm run intelligence` and let the internet tell you what to write about. 🚀
