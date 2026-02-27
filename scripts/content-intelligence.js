#!/usr/bin/env node

/**
 * Reactive Content Intelligence System
 *
 * Monitors the internet for signals and generates timely, relevant content
 * Runs continuously, generates content based on real-time trends
 */

// Load environment variables from .env file
require('dotenv').config();

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
    'X-Title': 'usemajordomo.com',
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

// Load signal sources from configuration file
const SOURCES = require('./sources.json');

// Load JSON schema for content ideas output
const CONTENT_SCHEMA = require('./schema.json');

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
      // Handle 402 Payment Required error
      if (error.code === 402 || error.message.includes('402')) {
        console.log('⚠️  Twitter requires paid API ($100/mo) for search');
        console.log('   → Disabling Twitter monitoring');
        console.log('   → Remove TWITTER_BEARER_TOKEN from .env to hide this message\n');
        twitterClient = null; // Disable for future runs
        break; // Stop trying other queries
      }
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
        // console.log(SOURCES.reddit.keywords)
        const isRelevant = SOURCES.reddit.keywords.some(kw => text.includes(kw));
        if (isRelevant && data.score > 100) {
          console.log(data.permalink)
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
      return `Twitter (${s.engagement} engagement): "${s.text}"\nURL: ${s.url}`;
    } else if (s.source === 'reddit') {
      return `Reddit r/${s.subreddit} (${s.score} upvotes, ${s.comments} comments): "${s.title}"\nURL: ${s.url}`;
    } else if (s.source === 'hackernews') {
      return `HN (${s.score} points, ${s.comments} comments): "${s.title}"\nURL: ${s.url}`;
    }
    return JSON.stringify(s);
  }).join('\n\n');

  // - A blog post topic (2000+ words) that addresses a trending pain point
// - A Twitter thread (5-7 tweets) responding to a popular discussion

  const prompt = `You are analyzing internet signals to generate timely, relevant content ideas for Majordomo (AI email agent at $9/month).

SIGNALS FROM THE INTERNET (last 24 hours):
${signalSummary}

Based on these real conversations and trends, generate a Reddit comment strategy for engaging in these conversations meaningfully. We DO NOT write AI slop. We are Helpful & experienced rather than sales-focused.

For each conversation, include:
- The specific signal it responds to (with URL)
- Punchline (core insight)
- Content outline (hook, story, insight, value_prop, discussion)
- Actual content (the full Reddit comment)
- Estimated impact

IMPORTANT: Return ONLY valid JSON matching this exact schema:
${JSON.stringify(CONTENT_SCHEMA, null, 2)}

Do not include markdown code blocks or any text outside the JSON. Return raw JSON only.`;

  const completion = await openai.chat.completions.create({
    model: 'anthropic/claude-sonnet-4-6', // Via OpenRouter, cheaper
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
 * Load processed signals history to avoid duplicates
 */
async function loadProcessedSignals() {
  try {
    const data = await fs.readFile('processed-signals.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return []; // File doesn't exist yet
  }
}

/**
 * Save processed signals
 */
async function saveProcessedSignals(signals) {
  const processed = await loadProcessedSignals();
  const newProcessed = signals.map(s => ({
    url: s.url,
    source: s.source,
    processedAt: new Date().toISOString()
  }));

  // Merge with existing, keep last 1000 to avoid file growing forever
  const merged = [...processed, ...newProcessed].slice(-1000);

  await fs.writeFile(
    'processed-signals.json',
    JSON.stringify(merged, null, 2)
  );
}

/**
 * Filter out already processed signals
 */
function filterNewSignals(signals, processed) {
  const processedUrls = new Set(processed.map(p => p.url));
  return signals.filter(s => !processedUrls.has(s.url));
}

/**
 * Main intelligence loop
 */
async function runIntelligenceLoop() {
  console.log('🚀 Starting content intelligence system...\n');

  try {
    // Gather signals from all sources
    const [redditSignals, hnSignals] = await Promise.all([
      monitorReddit(),
      monitorHackerNews(),
    ]);

    const allSignals = [
      ...redditSignals,
      ...hnSignals,
    ];

    console.log(`\n📊 Total signals collected: ${allSignals.length}`);

    // Filter out already processed signals
    const processedSignals = await loadProcessedSignals();
    console.log(processedSignals)
    const newSignals = filterNewSignals(allSignals, processedSignals);

    console.log(`📊 New signals (not processed before): ${newSignals.length}`);
    console.log(`⏭️  Already processed: ${allSignals.length - newSignals.length}\n`);

    if (newSignals.length === 0) {
      console.log('⚠️  No new signals found. All signals already processed.');
      return;
    }

    // Generate ISO timestamp for filenames
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    const signalsFile = `signals-${timestamp}.json`;
    const ideasFile = `content-ideas-${timestamp}.json`;

    // Save NEW signals for analysis (with timestamp and as latest)
    await fs.writeFile(
      signalsFile,
      JSON.stringify(newSignals, null, 2)
    );
    await fs.writeFile(
      'signals-latest.json',
      JSON.stringify(newSignals, null, 2)
    );

    // Analyze and generate content ideas from NEW signals only
    const contentIdeas = await analyzeSignals(newSignals);

    // Mark these signals as processed
    await saveProcessedSignals(newSignals);

    await fs.writeFile(
      ideasFile,
      contentIdeas
    );
    await fs.writeFile(
      'content-ideas-latest.json',
      contentIdeas
    );

    console.log(`\n📝 Content ideas generated and saved:`);
    console.log(`   - ${signalsFile}`);
    console.log(`   - ${ideasFile}`);
    console.log('\nReview ideas and run: npm run generate\n');

    // Optionally: Auto-generate content from top idea
    // const topIdea = JSON.parse(contentIdeas)[0];
    // const content = await generateContent(topIdea);
    // await saveContent(content, topIdea);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

/**
 * Process a single Reddit URL and generate content
 */
async function processRedditUrl(url) {
  console.log(`🔍 Processing Reddit URL: ${url}\n`);

  try {
    // Extract post ID from URL
    const match = url.match(/comments\/([a-z0-9]+)/i);
    if (!match) {
      throw new Error('Invalid Reddit URL. Expected format: https://reddit.com/r/subreddit/comments/POST_ID/...');
    }

    const postId = match[1];

    // Fetch the post data
    const response = await axios.get(
      `https://www.reddit.com/comments/${postId}.json`,
      { headers: { 'User-Agent': 'Majordomo-Content-Bot/1.0' } }
    );

    const postData = response.data[0].data.children[0].data;

    // Create signal from post
    const signal = {
      source: 'reddit',
      subreddit: postData.subreddit,
      title: postData.title,
      text: postData.selftext || '',
      score: postData.score,
      comments: postData.num_comments,
      url: `https://reddit.com${postData.permalink}`,
      timestamp: new Date()
    };

    console.log('📊 Signal extracted:');
    console.log(`   Subreddit: r/${signal.subreddit}`);
    console.log(`   Title: ${signal.title}`);
    console.log(`   Score: ${signal.score} upvotes`);
    console.log(`   Comments: ${signal.comments}\n`);

    // Generate content ideas for this single signal
    console.log('🧠 Generating content idea...\n');
    const contentIdeas = await analyzeSignals([signal]);

    // Parse the ideas
    let ideas;
    try {
      ideas = JSON.parse(contentIdeas);
    } catch {
      // Try extracting from markdown code block
      const jsonMatch = contentIdeas.match(/```json\n([\s\S]*?)\n```/) ||
                       contentIdeas.match(/```\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        ideas = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Could not parse AI response as JSON');
      }
    }

    if (!Array.isArray(ideas)) {
      ideas = [ideas];
    }

    // Output results
    console.log('=' .repeat(80));
    console.log('GENERATED CONTENT');
    console.log('='.repeat(80));
    console.log('\n📄 Full JSON:\n');
    console.log(JSON.stringify(ideas, null, 2));

    if (ideas.length > 0 && ideas[0].actual_content) {
      console.log('\n' + '='.repeat(80));
      console.log('📝 RAW COMMENT (ready to post):\n');
      console.log('-'.repeat(80));
      console.log(ideas[0].actual_content);
      console.log('-'.repeat(80));
    }

    console.log('\n✅ Done!\n');

  } catch (error) {
    console.error('❌ Error processing URL:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  // Check if a Reddit URL was provided as argument
  const redditUrl = process.argv[2];

  if (redditUrl && redditUrl.includes('reddit.com')) {
    // Single URL mode
    processRedditUrl(redditUrl)
      .then(() => process.exit(0))
      .catch(error => {
        console.error('❌ Fatal error:', error);
        process.exit(1);
      });
  } else if (redditUrl) {
    console.error('❌ Invalid URL. Please provide a Reddit URL.');
    console.error('Usage: node content-intelligence.js https://reddit.com/r/subreddit/comments/...\n');
    process.exit(1);
  } else {
    // Normal intelligence loop
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
}

module.exports = { runIntelligenceLoop, processRedditUrl };
