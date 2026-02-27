#!/usr/bin/env node

/**
 * Test if configuration is correct
 */

require('dotenv').config();

console.log('\n🔍 Checking configuration...\n');

// Check OpenRouter
if (process.env.OPENROUTER_API_KEY) {
  console.log('✅ OPENROUTER_API_KEY is set');
  console.log(`   Value: ${process.env.OPENROUTER_API_KEY.substring(0, 15)}...`);
} else {
  console.log('❌ OPENROUTER_API_KEY is missing');
  console.log('   Add to .env: OPENROUTER_API_KEY=sk-or-v1-xxxxx');
}

// Check Twitter (optional)
if (process.env.TWITTER_BEARER_TOKEN) {
  console.log('✅ TWITTER_BEARER_TOKEN is set (optional)');
} else if (process.env.TWITTER_API_KEY) {
  console.log('✅ TWITTER_API_KEY is set (optional)');
} else {
  console.log('⚠️  Twitter API not configured (optional - monitoring will skip Twitter)');
}

console.log('\n📋 Required:');
console.log('  - OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? '✅' : '❌');

// Check Reddit (optional)
const redditConfigured = process.env.REDDIT_CLIENT_ID &&
                        process.env.REDDIT_CLIENT_SECRET &&
                        process.env.REDDIT_USERNAME &&
                        process.env.REDDIT_PASSWORD;
if (redditConfigured) {
  console.log('✅ REDDIT API is configured (optional - for posting comments)');
} else {
  console.log('⚠️  Reddit API not configured (optional - needed for posting comments)');
}

console.log('\n📋 Required:');
console.log('  - OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? '✅' : '❌');

console.log('\n📋 Optional:');
console.log('  - TWITTER_BEARER_TOKEN:', process.env.TWITTER_BEARER_TOKEN ? '✅' : '⏭️  (skipped)');
console.log('  - REDDIT_API:', redditConfigured ? '✅' : '⏭️  (skipped)');

if (!process.env.OPENROUTER_API_KEY) {
  console.log('\n❌ Missing required configuration!\n');
  console.log('Create .env file with:');
  console.log('OPENROUTER_API_KEY=sk-or-v1-your-key-here\n');
  process.exit(1);
}

console.log('\n✅ Configuration looks good!\n');
console.log('Next step: npm run intelligence\n');
