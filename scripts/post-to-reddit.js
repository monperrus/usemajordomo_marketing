#!/usr/bin/env node

/**
 * Interactive Reddit Comment Poster
 *
 * Loads generated content ideas and posts them to Reddit
 * with user validation before each post
 */

require('dotenv').config();

const Snoowrap = require('snoowrap');
const fs = require('fs').promises;
const readline = require('readline');

// Initialize Reddit client
let reddit = null;
if (process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET) {
  reddit = new Snoowrap({
    userAgent: process.env.REDDIT_USER_AGENT || 'Majordomo-Marketing-Bot/1.0',
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD
  });
  console.log('✅ Reddit API initialized');
} else {
  console.log('❌ Reddit API credentials missing');
  console.log('   Add to .env:');
  console.log('   REDDIT_CLIENT_ID=...');
  console.log('   REDDIT_CLIENT_SECRET=...');
  console.log('   REDDIT_USERNAME=...');
  console.log('   REDDIT_PASSWORD=...\n');
  process.exit(1);
}

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Ask user a question and wait for response
 */
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
}

/**
 * Load posted comments log to avoid duplicates
 */
async function loadPostedLog() {
  try {
    const data = await fs.readFile('posted-comments.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return []; // File doesn't exist yet
  }
}

/**
 * Save posted comment to log
 */
async function saveToLog(idea, commentUrl) {
  const log = await loadPostedLog();
  log.push({
    url: idea.url,
    commentUrl,
    postedAt: new Date().toISOString(),
    signal: idea.signal,
    punchline: idea.punchline
  });
  await fs.writeFile('posted-comments.json', JSON.stringify(log, null, 2));
}

/**
 * Extract post ID from Reddit URL
 */
function extractPostId(url) {
  // Reddit URLs: https://reddit.com/r/subreddit/comments/POST_ID/title
  const match = url.match(/comments\/([a-z0-9]+)/i);
  return match ? match[1] : null;
}

/**
 * Post comment to Reddit
 */
async function postComment(postId, commentText) {
  try {
    const submission = await reddit.getSubmission(postId);
    const comment = await submission.reply(commentText);
    return `https://reddit.com${comment.permalink}`;
  } catch (error) {
    throw new Error(`Failed to post: ${error.message}`);
  }
}

/**
 * Display content idea for review
 */
function displayIdea(idea, index, total) {
  console.log('\n' + '='.repeat(80));
  console.log(`CONTENT IDEA ${index + 1} of ${total}`);
  console.log('='.repeat(80));
  console.log(`\n📍 URL: ${idea.url}`);
  console.log(`\n💡 Signal: ${idea.signal}`);
  console.log(`\n🎯 Punchline: ${idea.punchline}`);
  console.log(`\n📊 Estimated Impact:`);
  console.log(`   - Upvotes: ${idea.estimated_impact.expected_upvotes}`);
  console.log(`   - Replies: ${idea.estimated_impact.expected_replies}`);
  console.log(`   - Visibility: ${idea.estimated_impact.visibility}`);
  console.log(`   - Lead Potential: ${idea.estimated_impact.lead_potential}`);
  console.log(`\n📝 COMMENT TO POST:\n`);
  console.log('-'.repeat(80));
  console.log(idea.actual_content);
  console.log('-'.repeat(80));
}

/**
 * Main posting flow
 */
async function main() {
  try {
    console.log('🚀 Reddit Comment Poster\n');

    // Load content ideas
    let ideasFile = 'content-ideas-latest.json';
    try {
      await fs.access(ideasFile);
    } catch {
      console.log('❌ No content-ideas-latest.json found');
      console.log('   Run: npm run intelligence\n');
      process.exit(1);
    }

    const ideasRaw = await fs.readFile(ideasFile, 'utf8');

    // Parse ideas (handle markdown code blocks)
    let ideas;
    try {
      ideas = JSON.parse(ideasRaw);
    } catch {
      // Try extracting from markdown code block
      const jsonMatch = ideasRaw.match(/```json\n([\s\S]*?)\n```/) ||
                       ideasRaw.match(/```\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        ideas = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Could not parse content ideas JSON');
      }
    }

    if (!Array.isArray(ideas)) {
      ideas = [ideas];
    }

    console.log(`📋 Found ${ideas.length} content ideas\n`);

    // Load posted log to skip duplicates
    const postedLog = await loadPostedLog();
    const postedUrls = new Set(postedLog.map(p => p.url));

    let posted = 0;
    let skipped = 0;

    for (let i = 0; i < ideas.length; i++) {
      const idea = ideas[i];

      // Skip if already posted
      if (postedUrls.has(idea.url)) {
        console.log(`⏭️  Skipping (already posted): ${idea.url}`);
        skipped++;
        continue;
      }

      // Display the idea
      displayIdea(idea, i, ideas.length);

      // Ask for user approval
      const answer = await askQuestion(
        '\n❓ Post this comment? (y=yes, n=no, e=edit, q=quit): '
      );

      if (answer === 'q' || answer === 'quit') {
        console.log('\n👋 Exiting...');
        break;
      }

      if (answer === 'n' || answer === 'no') {
        console.log('⏭️  Skipped');
        skipped++;
        continue;
      }

      if (answer === 'e' || answer === 'edit') {
        console.log('\n✏️  Open content-ideas-latest.json to edit, then re-run this script');
        console.log('   File location: scripts/content-ideas-latest.json\n');
        skipped++;
        continue;
      }

      if (answer === 'y' || answer === 'yes') {
        // Extract post ID and post comment
        const postId = extractPostId(idea.url);
        if (!postId) {
          console.log('❌ Could not extract post ID from URL');
          skipped++;
          continue;
        }

        try {
          console.log('📤 Posting comment...');
          const commentUrl = await postComment(postId, idea.actual_content);
          await saveToLog(idea, commentUrl);
          console.log(`✅ Posted! ${commentUrl}`);
          posted++;

          // Wait a bit between posts to avoid rate limits
          if (i < ideas.length - 1) {
            console.log('\n⏳ Waiting 10 seconds before next post...');
            await new Promise(resolve => setTimeout(resolve, 10000));
          }
        } catch (error) {
          console.error(`❌ Error posting: ${error.message}`);
          skipped++;
        }
      } else {
        console.log('⏭️  Invalid input, skipping');
        skipped++;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 SUMMARY');
    console.log('='.repeat(80));
    console.log(`✅ Posted: ${posted}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`📝 Total: ${ideas.length}`);
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  main();
}

module.exports = { postComment };
