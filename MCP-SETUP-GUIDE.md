# MCP Servers Setup Guide for Marketing Automation

## Priority 1: Install Immediately (Customer Acquisition Impact)

### 1. SEO MCP Server (FREE)
**Why:** Keyword research for blog posts, content optimization
**Install:**
```bash
npm install -g @cnych/seo-mcp
```

**Usage with Claude Code:**
- "Find keyword ideas for 'email automation'"
- "What's the search volume for 'ai email assistant'?"
- "Show me keyword difficulty for these terms"

**Sources:**
- GitHub: https://github.com/cnych/seo-mcp
- Based on Ahrefs data (free tier)

---

### 2. Smartlead MCP Server (If using Smartlead for cold email)
**Why:** Manage cold email campaigns programmatically
**Cost:** Requires Smartlead account ($47/month) - SKIP for now, use Instantly.ai instead

**Alternative: Instantly.ai**
- No MCP server yet, but has API
- Can create custom MCP if needed
- For now: Use web interface

---

### 3. LinkedIn MCP Server
**Why:** Automate LinkedIn posting
**Install:**
```bash
# Installation instructions from PulseMCP
# Visit: https://www.pulsemcp.com/servers/alinaqi-linkedin
```

**Usage:**
- "Post this to LinkedIn: [content]"
- "Schedule this LinkedIn post for tomorrow at 10am"
- "Check engagement on my last LinkedIn post"

---

### 4. Twitter/X MCP Server
**Why:** Automate Twitter posting
**Install:**
```bash
# Installation instructions from PulseMCP
# Visit: https://www.pulsemcp.com/servers/taazkareem-twitter
```

**Usage:**
- "Tweet this: [content]"
- "Schedule 5 tweets for this week based on this thread"
- "Reply to mentions about 'email automation'"

---

## Priority 2: Install Week 2 (Productivity & Organization)

### 5. Notion MCP Server
**Why:** Organize content calendar, track campaigns
**Install:**
```bash
# Check Claude Code MCP directory or Notion's developer docs
```

**Usage:**
- "Create a content calendar in Notion for next week"
- "Add this blog post idea to my Notion content database"
- "Show me all pending marketing tasks"

---

### 6. Google Drive MCP
**Why:** Store marketing assets, graphics, documents
**Install:**
```bash
# Standard Google Drive MCP from MCP directory
```

**Usage:**
- "Upload this graphic to the marketing folder"
- "Find all social media images from last month"
- "Share this document with [email]"

---

## Priority 3: Nice to Have (Install When Budget Increases)

### 7. Mailchimp MCP Server
**Why:** Email newsletter automation (when you start building email list)
**Install when:** You have 500+ subscribers

---

### 8. HubSpot MCP Server
**Why:** CRM + marketing automation
**Install when:** Budget allows ($50+/month for HubSpot)

---

## Quick Setup Instructions

### Step 1: Check Available MCPs in Claude Code
```bash
# In Claude Code, ask:
"What MCP servers are currently available?"
```

### Step 2: Install via Claude Code Settings
Most MCPs can be installed through Claude Code's MCP management:
1. Open Claude Code settings
2. Navigate to MCP servers section
3. Search for and install desired servers
4. Authenticate where needed (API keys, OAuth)

### Step 3: Alternative - Manual Installation

**For npm-based MCPs:**
```bash
# Install globally
npm install -g [package-name]

# Or add to Claude Code config
nano ~/.claude/config.json
```

**Add MCP to config:**
```json
{
  "mcpServers": {
    "seo-mcp": {
      "command": "npx",
      "args": ["-y", "@cnych/seo-mcp"]
    }
  }
}
```

---

## Testing Your MCPs

After installation, test each one:

**SEO MCP:**
```
Ask Claude: "Using SEO MCP, find keyword ideas for 'email automation for founders'"
```

**LinkedIn MCP:**
```
Ask Claude: "Using LinkedIn MCP, schedule a post for tomorrow: [your content]"
```

**Twitter MCP:**
```
Ask Claude: "Using Twitter MCP, draft 5 tweets about email productivity"
```

---

## Troubleshooting

**MCP not found:**
- Check installation: `npm list -g`
- Verify config file: `cat ~/.claude/config.json`
- Restart Claude Code

**Authentication errors:**
- Get API keys from respective platforms (Twitter, LinkedIn, etc.)
- Add to MCP config or authenticate via OAuth
- Check API rate limits

**Permission errors:**
- Ensure API keys have correct permissions
- For social media: Usually need "write" permissions

---

## API Keys You'll Need

**Twitter/X:**
1. Go to developer.twitter.com
2. Create app
3. Generate API keys (need read + write)
4. Add to MCP config

**LinkedIn:**
1. Go to linkedin.com/developers
2. Create app
3. Request access for posting (may take 1-2 days)
4. Generate access token

**SEO MCP:**
- No API key needed (uses free Ahrefs data)

---

## Cost Summary

**Free:**
- SEO MCP: $0
- Twitter MCP: $0 (just need Twitter account)
- LinkedIn MCP: $0 (just need LinkedIn account)
- Notion MCP: $0 (if you have free Notion account)

**Paid (later):**
- Mailchimp MCP: When you need email lists
- HubSpot MCP: When budget allows

**Total cost of MCP automation: $0 for Phase 1**

---

## Alternative: Manual Posting (If MCPs Don't Work)

If MCP setup is challenging, use these tools instead:

**Social Media Scheduling:**
- Buffer (free plan: 10 posts/channel)
- Hootsuite (free plan: 2 social accounts)
- Later (free plan: 10 posts/month)

**Process:**
1. Ask Claude to generate social media content
2. Copy-paste to Buffer/Hootsuite
3. Schedule manually
4. Still saves massive time vs. writing content yourself

---

## Sources & Documentation

- **MCP Server Directory:** https://mcp.so/
- **Claude Code MCP Docs:** https://code.claude.com/docs/en/mcp
- **PulseMCP (MCP marketplace):** https://www.pulsemcp.com/
- **SEO MCP GitHub:** https://github.com/cnych/seo-mcp
- **Smartlead MCP GitHub:** https://github.com/LeadMagic/smartlead-mcp-server

---

## What to Tell Me (for Custom MCP Development)

If standard MCPs don't exist for a tool you need, let me know:
1. What tool/platform?
2. What do you want to automate?
3. Does it have an API?

I can create custom MCP servers for your specific needs.

---

## Next Steps After MCP Setup

1. ✅ Install SEO MCP → Use for keyword research on blog posts
2. ✅ Install Twitter MCP → Schedule week 1 content
3. ✅ Install LinkedIn MCP → Schedule week 1 content
4. ✅ Test each MCP with sample content
5. ✅ Set up posting schedule (automate via cron or Claude Code)
6. 🚀 Start executing marketing plan!
