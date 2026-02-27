#!/usr/bin/env node

/**
 * Generate actual content from top content ideas
 * Run after content-intelligence.js identifies trends
 */

const OpenAI = require('openai');
const fs = require('fs').promises;

// Using OpenRouter for cheaper, multi-model access
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://usemajordomo.com',
    'X-Title': 'Majordomo Marketing',
  }
});

async function generateContent(idea) {
  console.log(`\n✍️  Generating: ${idea.title}\n`);

  const prompt = `Generate a complete, SEO-optimized blog post:

TOPIC: ${idea.title}

CONTEXT: This responds to a trending discussion/question we found online:
${idea.signal_context}

TARGET KEYWORDS: ${idea.keywords.join(', ')}

OUTLINE: ${idea.outline}

Requirements:
- 2000-3000 words
- Conversational, helpful tone (like talking to a founder friend)
- Include real examples and statistics where relevant
- Mention Majordomo naturally ($9/month AI email automation)
- Include actionable tips readers can use immediately
- Write for busy professionals (founders, consultants, sales pros)
- Add FAQ section at end
- Include CTA: "Try Majordomo free for 7 days"

Output as clean Markdown with proper headings (## for H2, ### for H3).`;

  const completion = await openai.chat.completions.create({
    model: 'anthropic/claude-3.5-sonnet', // Via OpenRouter
    messages: [
      {
        role: 'system',
        content: 'You are a skilled content writer for Majordomo. Write helpful, authentic content that solves real problems.'
      },
      { role: 'user', content: prompt }
    ],
    max_tokens: 8000,
  });

  return completion.choices[0].message.content;
}

async function generateTweets(idea) {
  console.log(`\n🐦 Generating Twitter thread: ${idea.title}\n`);

  const prompt = `Generate a Twitter thread (5-7 tweets) based on:

TOPIC: ${idea.title}
CONTEXT: ${idea.signal_context}

Requirements:
- First tweet: Hook (problem statement or surprising stat)
- Middle tweets: Value (tips, insights, examples)
- Last tweet: CTA (link to blog or try Majordomo)
- Each tweet max 280 characters
- Conversational, not salesy
- Include relevant hashtags (max 2 per tweet)

Format as JSON array of tweet objects with "text" field.`;

  const completion = await openai.chat.completions.create({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 2000,
  });

  return completion.choices[0].message.content;
}

async function generateRedditComments(idea) {
  console.log(`\n💬 Generating Reddit comment strategy: ${idea.title}\n`);

  const prompt = `Generate helpful Reddit comments for engaging in discussions about:

TOPIC: ${idea.title}
CONTEXT: ${idea.signal_context}

Generate 3 comment templates for different scenarios:
1. Someone asking for advice on this topic
2. Someone complaining about the problem
3. Someone sharing their solution (build on their idea)

Requirements:
- Helpful first, promotional never
- Mention Majordomo only if directly relevant
- 100-300 words each
- Conversational Reddit tone
- Include personal experience ("I struggled with this too...")

Format as JSON array with "scenario" and "comment" fields.`;

  const completion = await openai.chat.completions.create({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 3000,
  });

  return completion.choices[0].message.content;
}

async function saveContent(content, idea, type = 'blog') {
  const timestamp = new Date().toISOString().split('T')[0];
  const slug = idea.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  let filename, fullContent;

  if (type === 'blog') {
    filename = `../content/blog/${timestamp}-${slug}.md`;
    fullContent = `---
title: "${idea.title}"
date: ${timestamp}
generated_from: ${idea.source}
signal_context: "${idea.signal_context}"
keywords: [${idea.keywords.map(k => `"${k}"`).join(', ')}]
trending: true
---

${content}

---

**Ready to stop spending hours on email?** [Try Majordomo free for 7 days](https://usemajordomo.com) — AI email automation for $9/month.
`;
  } else if (type === 'twitter') {
    filename = `../content/social/${timestamp}-twitter-thread-${slug}.json`;
    fullContent = content;
  } else if (type === 'reddit') {
    filename = `../content/social/${timestamp}-reddit-comments-${slug}.json`;
    fullContent = content;
  }

  await fs.writeFile(filename, fullContent);
  console.log(`💾 Saved: ${filename}`);

  return filename;
}

async function main() {
  try {
    // Load content ideas from intelligence system
    const ideasRaw = await fs.readFile('content-ideas.json', 'utf8');
    const ideasData = JSON.parse(ideasRaw);

    // Parse ideas (handle if it's wrapped in markdown code blocks)
    let ideas;
    if (typeof ideasData === 'string') {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = ideasData.match(/```json\n([\s\S]*?)\n```/) ||
                       ideasData.match(/```\n([\s\S]*?)\n```/);
      ideas = JSON.parse(jsonMatch ? jsonMatch[1] : ideasData);
    } else {
      ideas = ideasData;
    }

    console.log(`📋 Found ${ideas.length} content ideas\n`);

    // Generate content for top 3 ideas
    const topIdeas = Array.isArray(ideas) ? ideas.slice(0, 3) : [ideas];

    for (const idea of topIdeas) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Processing: ${idea.title}`);
      console.log('='.repeat(60));

      // Generate blog post
      const blogContent = await generateContent(idea);
      await saveContent(blogContent, idea, 'blog');

      // Generate Twitter thread
      const tweets = await generateTweets(idea);
      await saveContent(tweets, idea, 'twitter');

      // Generate Reddit comments
      const redditComments = await generateRedditComments(idea);
      await saveContent(redditComments, idea, 'reddit');

      console.log('\n✅ Complete!\n');

      // Wait a bit to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n🎉 All content generated successfully!');
    console.log('\nNext steps:');
    console.log('1. Review generated content in content/ directory');
    console.log('2. Edit if needed (AI gets you 80% there)');
    console.log('3. Publish to blog');
    console.log('4. Post to social media');
    console.log('5. Engage on Reddit\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateContent, generateTweets, generateRedditComments };
