#!/usr/bin/env node

/**
 * Reactive Content Intelligence System
 *
 * Monitors the internet for signals and generates timely, relevant content
 * Runs continuously, generates content based on real-time trends
 */

const OpenAI = require('openai');
const { TwitterApi } = require('twitter-api-v2');
const axios = require('axios');
const fs = require('fs').promises;

// Initialize APIs - Using OpenRouter for cheaper, multi-model access
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://usemajordomo.com',
    'X-Title': 'Majordomo Marketing',
  }
});

// Twitter is optional (free tier for monitoring, or skip entirely)
let twitterClient = null;
if (process.env.TWITTER_BEARER_TOKEN) {
  // Use bearer token (free tier - read only)
  twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
  console.log('✅ Twitter monitoring enabled (read-only)');
} else if (process.env.TWITTER_API_KEY) {
  // Use OAuth 1.0 (requires paid API for posting)
  twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });
  console.log('✅ Twitter monitoring enabled (OAuth 1.0)');
} else {
  console.log('⚠️  Twitter monitoring disabled (no API keys)');
}

// Signal sources
const SOURCES = {
  twitter: {
    queries: [
      'email overload',
      'too many emails',
      'inbox zero impossible',
      'drowning in email',
      'email bankruptcy',
      'productivity tips email'
    ]
  },
  reddit: {
    subreddits: ['productivity', 'entrepreneur', 'startups', 'SaaS', 'solopreneur'],
    keywords: ['email', 'inbox', 'productivity', 'automation']
  },
  hackernews: {
    keywords: ['email', 'productivity', 'automation', 'AI']
  },
  googleTrends: {
    topics: ['email automation', 'AI email', 'productivity tools']
  }
};

/**
 * Monitor Twitter for trending discussions
 */
async function monitorTwitter() {
  if (!twitterClient) {
    console.log('⏭️  Skipping Twitter (no API access)');
    return [];
  }

  console.log('📊 Monitoring Twitter trends...');

  const signals = [];

  for (const query of SOURCES.twitter.queries) {
    try {
      const tweets = await twitterClient.v2.search(query, {
        'tweet.fields': ['public_metrics', 'created_at'],
        max_results: 10,
      });

      for (const tweet of tweets.data || []) {
        // High engagement = strong signal
        const engagement = tweet.public_metrics.like_count +
                          tweet.public_metrics.retweet_count;

        if (engagement > 50) {
          signals.push({
            source: 'twitter',
            query,
            text: tweet.text,
            engagement,
            url: `https://twitter.com/i/web/status/${tweet.id}`,
            timestamp: new Date()
          });
        }
      }
    } catch (error) {
      console.error(`Twitter error for "${query}":`, error.message);
    }
  }

  console.log(`✅ Found ${signals.length} Twitter signals`);
  return signals;
}

/**
 * Monitor Reddit for popular questions and discussions
 */
async function monitorReddit() {
  console.log('📊 Monitoring Reddit discussions...');

  const signals = [];

  for (const subreddit of SOURCES.reddit.subreddits) {
    try {
      const response = await axios.get(
        `https://www.reddit.com/r/${subreddit}/hot.json?limit=25`,
        { headers: { 'User-Agent': 'Majordomo-Content-Bot/1.0' } }
      );

      const posts = response.data.data.children;

      for (const post of posts) {
        const data = post.data;
        const text = `${data.title} ${data.selftext}`.toLowerCase();

        // Check if related to our topics
        const isRelevant = SOURCES.reddit.keywords.some(kw => text.includes(kw));

        if (isRelevant && data.score > 100) {
          signals.push({
            source: 'reddit',
            subreddit,
            title: data.title,
            text: data.selftext,
            score: data.score,
            comments: data.num_comments,
            url: `https://reddit.com${data.permalink}`,
            timestamp: new Date()
          });
        }
      }
    } catch (error) {
      console.error(`Reddit error for r/${subreddit}:`, error.message);
    }
  }

  console.log(`✅ Found ${signals.length} Reddit signals`);
  return signals;
}

/**
 * Monitor HackerNews for relevant discussions
 */
async function monitorHackerNews() {
  console.log('📊 Monitoring HackerNews...');

  const signals = [];

  try {
    // Get top stories
    const topResponse = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
    const topStories = topResponse.data.slice(0, 30);

    for (const storyId of topStories) {
      const storyResponse = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
      const story = storyResponse.data;

      if (!story.title) continue;

      const text = `${story.title} ${story.text || ''}`.toLowerCase();
      const isRelevant = SOURCES.hackernews.keywords.some(kw => text.includes(kw));

      if (isRelevant && story.score > 50) {
        signals.push({
          source: 'hackernews',
          title: story.title,
          text: story.text || '',
          score: story.score,
          comments: story.descendants || 0,
          url: story.url || `https://news.ycombinator.com/item?id=${storyId}`,
          timestamp: new Date()
        });
      }
    }
  } catch (error) {
    console.error('HackerNews error:', error.message);
  }

  console.log(`✅ Found ${signals.length} HackerNews signals`);
  return signals;
}

/**
 * Check Google Trends (simplified - would need proper API)
 */
async function checkGoogleTrends() {
  console.log('📊 Checking Google Trends...');

  // Note: Google Trends doesn't have official API
  // Options: Use google-trends-api npm package or scrape
  // For now, returning mock structure

  const signals = [
    {
      source: 'google_trends',
      topic: 'email automation',
      trend: 'rising',
      relatedQueries: [
        'best email automation software',
        'how to automate email responses',
        'AI email automation'
      ]
    }
  ];

  console.log(`✅ Found ${signals.length} trend signals`);
  return signals;
}

/**
 * Analyze signals and generate content ideas
 */
async function analyzeSignals(signals) {
  console.log('🧠 Analyzing signals with AI...');

  // Prepare signals summary
  const signalSummary = signals.map(s => {
    if (s.source === 'twitter') {
      return `Twitter (${s.engagement} engagement): "${s.text}"`;
    } else if (s.source === 'reddit') {
      return `Reddit r/${s.subreddit} (${s.score} upvotes): "${s.title}"`;
    } else if (s.source === 'hackernews') {
      return `HN (${s.score} points): "${s.title}"`;
    }
    return JSON.stringify(s);
  }).join('\n\n');

  const prompt = `You are analyzing internet signals to generate timely, relevant content ideas for Majordomo (AI email automation at $9/month).

SIGNALS FROM THE INTERNET (last 24 hours):
${signalSummary}

Based on these real conversations and trends, generate 3 content ideas:

1. A blog post topic (2000+ words) that addresses a trending pain point
2. A Twitter thread (5-7 tweets) responding to a popular discussion
3. A Reddit comment strategy for engaging in these conversations

For each idea, include:
- The specific signal it responds to
- Why it's timely (reference the trend/discussion)
- Target keywords for SEO
- Content outline
- Estimated reach/impact

Format as JSON.`;

  const completion = await openai.chat.completions.create({
    model: 'anthropic/claude-3.5-sonnet', // Via OpenRouter, cheaper
    messages: [{
      role: 'user',
      content: prompt
    }],
    max_tokens: 4000,
  });

  const ideas = completion.choices[0].message.content;
  console.log('✅ Generated content ideas');

  return ideas;
}

/**
 * Generate actual content from top idea
 */
async function generateContent(contentIdea) {
  console.log('✍️  Generating content...');

  const prompt = `Generate a complete, SEO-optimized blog post based on this content idea:

${contentIdea}

Requirements:
- 2000+ words
- Conversational, helpful tone
- Include real examples
- Target the keywords mentioned
- Mention Majordomo naturally (not salesy)
- Include actionable tips
- Write for busy professionals (founders, consultants)

Output as Markdown with proper headings, bullets, and formatting.`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 8000,
    messages: [{
      role: 'user',
      content: prompt
    }],
    // Use prompt caching to reduce costs
    system: [{
      type: 'text',
      text: 'You are a content writer for Majordomo, an AI email automation tool for $9/month.',
      cache_control: { type: 'ephemeral' }
    }]
  });

  const content = message.content[0].text;
  console.log('✅ Content generated');

  return content;
}

/**
 * Save content with metadata
 */
async function saveContent(content, metadata) {
  const timestamp = new Date().toISOString().split('T')[0];
  const slug = metadata.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const filename = `content/blog/${timestamp}-${slug}.md`;

  const fullContent = `---
title: ${metadata.title}
date: ${timestamp}
generated_from: ${metadata.source}
keywords: ${metadata.keywords.join(', ')}
---

${content}
`;

  await fs.writeFile(filename, fullContent);
  console.log(`💾 Saved: ${filename}`);

  return filename;
}

/**
 * Main intelligence loop
 */
async function runIntelligenceLoop() {
  console.log('🚀 Starting content intelligence system...\n');

  try {
    // Gather signals from all sources
    const [twitterSignals, redditSignals, hnSignals, trendSignals] = await Promise.all([
      monitorTwitter(),
      monitorReddit(),
      monitorHackerNews(),
      checkGoogleTrends()
    ]);

    const allSignals = [
      ...twitterSignals,
      ...redditSignals,
      ...hnSignals,
      ...trendSignals
    ];

    console.log(`\n📊 Total signals collected: ${allSignals.length}\n`);

    if (allSignals.length === 0) {
      console.log('⚠️  No signals found. Will retry in 1 hour.');
      return;
    }

    // Save signals for analysis
    await fs.writeFile(
      'signals.json',
      JSON.stringify(allSignals, null, 2)
    );

    // Analyze and generate content ideas
    const contentIdeas = await analyzeSignals(allSignals);

    await fs.writeFile(
      'content-ideas.json',
      contentIdeas
    );

    console.log('\n📝 Content ideas generated and saved to content-ideas.json');
    console.log('Review ideas and run: npm run generate-content\n');

    // Optionally: Auto-generate content from top idea
    // const topIdea = JSON.parse(contentIdeas)[0];
    // const content = await generateContent(topIdea);
    // await saveContent(content, topIdea);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

// Run if called directly
if (require.main === module) {
  runIntelligenceLoop()
    .then(() => {
      console.log('✅ Intelligence loop complete');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { runIntelligenceLoop };
