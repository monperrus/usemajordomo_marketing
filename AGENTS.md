# Agent Instructions: Majordomo Marketing

## Mission
Get paying customers for https://usemajordomo.com/ through AI-first, fully automated marketing.

---

## Single Source of Truth

**ONE PLAN ONLY:** `AI-FIRST-MARKETING.md`

- This is the authoritative marketing strategy
- All other files support this plan (content, scripts, assets)
- Do NOT create alternative plans, quick-starts, or bootstrap guides
- Do NOT create "plan.md", "START-HERE.md", "QUICK-START.md", etc.

**If the plan needs updating:** Edit `AI-FIRST-MARKETING.md` directly. Don't create new files.

---

## Core Principles

### 1. AI-First, Always
- ✅ Write code and automation scripts
- ✅ Use APIs, bots, and cron jobs
- ✅ Build systems that run autonomously
- ❌ NO manual processes ("go to LinkedIn and find 10 leads")
- ❌ NO copy-paste workflows
- ❌ NO "bootstrap" or "manual" alternatives

### 2. Code Over Prose
- ✅ Working scripts > lengthy explanations
- ✅ API examples > theoretical approaches
- ✅ Runnable automation > instructions to run manually
- Example: Don't say "use Buffer to schedule posts" — write the API script

### 3. One File Per Purpose
```
AI-FIRST-MARKETING.md     → Strategy & implementation plan (THE plan)
README.md                 → Index/navigation only
content/                  → Actual content (blogs, tweets, emails)
scripts/                  → Automation scripts (when created)
bots/                     → Bot code (when created)
```

### 4. No Redundancy
Before creating a file, check:
- Does this duplicate existing content?
- Could this be added to an existing file?
- Is this truly necessary or just reorganizing?

**When in doubt:** Edit existing files rather than creating new ones.

---

## File Creation Rules

### ✅ ALLOWED to create:
- **Content files:** `content/blog/post-name.md`, `content/social/week-X.md`
- **Scripts:** `scripts/twitter-bot.js`, `scripts/generate-content.sh`
- **Bots:** `bots/engagement-bot.py`, `bots/reddit-bot.js`
- **Assets:** `images/`, `profile.svg`, `banner.svg`
- **Documentation:** Only if highly specific (e.g., `API-SETUP-GUIDE.md` for complex API config)

### ❌ FORBIDDEN to create:
- ❌ Alternative plans: `bootstrap-plan.md`, `manual-marketing.md`, `quick-start.md`
- ❌ Meta files: `START-HERE.md`, `CHOOSE-YOUR-PATH.md`, `OPTIONS.md`
- ❌ Duplicate guides: Multiple versions of the same thing
- ❌ "Simple" versions: If something needs simplifying, simplify the original

---

## User Context

**Tech level:** Highly technical, can code, understands APIs and automation
**Preferences:**
- Wants full automation with minimal supervision
- Open to installing MCPs, skills, and tools
- Values AI agents and API-driven workflows
- Does NOT want manual "hustle" marketing

**Budget:** $100/month initially, scales with revenue

**Product:** Majordomo - AI email agent at $9/month, 500 replies included

---

## When User Asks for Changes

### If they want a new approach:
1. **First:** Check if it can be added to `AI-FIRST-MARKETING.md`
2. **If yes:** Edit that file, don't create a new one
3. **If no:** Confirm with user before creating new file

### If they want simplification:
1. **Don't create** `SIMPLE-VERSION.md`
2. **Do:** Simplify `AI-FIRST-MARKETING.md` or create a `TLDR` section within it

### If they want quick start:
1. **Don't create** `QUICK-START.md`
2. **Do:** Add "Quick Start" section to `AI-FIRST-MARKETING.md` or `README.md`

---

## Acceptable File Structure

```
marketing/
├── AGENTS.md                       # This file (agent instructions)
├── README.md                       # Index only
├── AI-FIRST-MARKETING.md          # THE plan
│
├── content/                        # Content ready to publish
│   ├── blog/
│   ├── social/
│   └── email/
│
├── scripts/                        # Automation scripts (create as needed)
│   ├── generate-content.sh
│   ├── publish-blog.sh
│   └── find-leads.sh
│
├── bots/                           # Bot code (create as needed)
│   ├── twitter-bot.js
│   ├── reddit-bot.py
│   └── engagement-bot.py
│
└── assets/                         # Images, logos, etc.
    ├── profile.svg
    └── banner.svg
```

---

## What to Do Instead of Creating Files

### User says: "This is too complex, give me a simpler version"
❌ **Don't:** Create `SIMPLE-PLAN.md`
✅ **Do:** Add a "Quick Start" or "Simplified Path" section to `AI-FIRST-MARKETING.md`

### User says: "I need a quick reference"
❌ **Don't:** Create `QUICK-REFERENCE.md`
✅ **Do:** Add a "TL;DR" or "Command Reference" section to existing file

### User says: "Can we try manual approach first?"
❌ **Don't:** Create `MANUAL-MARKETING.md`
✅ **Do:** Ask: "AI-first approach isn't working? What specific issue should we solve?" Then fix the automation.

### User says: "I want step-by-step for beginners"
❌ **Don't:** Create `BEGINNER-GUIDE.md`
✅ **Do:** Add "Step-by-Step Setup" section with numbered steps to `AI-FIRST-MARKETING.md`

---

## Response Guidelines

### When providing help:
1. **Write actual code** (not just suggestions)
2. **Provide runnable scripts** (not pseudo-code)
3. **Use real APIs** (not hypothetical examples)
4. **Assume technical competence** (user can code)

### When user is stuck:
1. **Debug the automation** (don't fall back to manual)
2. **Improve the code** (don't suggest workarounds)
3. **Build better tools** (don't suggest manual alternatives)

### Default stance:
- "Let me write that script for you" ✅
- "You could manually do X..." ❌

---

## Content Strategy

**Content lives in `/content/`** organized by type:
- `/content/blog/` → Blog posts (markdown + HTML)
- `/content/social/` → Social media posts
- `/content/email/` → Email sequences

**Don't create:** Alternative content folders, staging areas, draft folders
**Do create:** New content files within these folders

---

## Anti-Patterns to Avoid

### 1. The "Multiple Plans" Trap
Creating: `plan.md`, `plan-v2.md`, `plan-final.md`, `plan-ACTUALLY-FINAL.md`
**Solution:** Version control (git) handles versions. One plan file only.

### 2. The "Choose Your Path" Trap
Creating: `MANUAL.md`, `AUTOMATED.md`, `HYBRID.md`, `START-HERE.md`
**Solution:** User already chose. They want AI-first. One path only.

### 3. The "Simplification" Trap
Creating: `SIMPLE-VERSION.md`, `QUICK-START.md`, `TLDR.md`
**Solution:** Add sections to main file, don't fragment.

### 4. The "Helper Files" Trap
Creating: `TIPS.md`, `NOTES.md`, `IDEAS.md`, `TODO.md`
**Solution:** Use comments in code, sections in main file, or git issues.

---

## Emergency Override

If user explicitly says:
> "Create a new file called X"

Then create it. But first confirm:
> "I can add this to [existing file] instead. Create new file anyway?"

Give them the chance to keep things clean.

---

## Success Metrics

**Good agent behavior:**
- ✅ Writes working code immediately
- ✅ Edits existing files rather than creating new ones
- ✅ Provides runnable automation scripts
- ✅ Keeps file structure clean
- ✅ Assumes user is technical

**Bad agent behavior:**
- ❌ Creates "quick start" or "simple version" files
- ❌ Suggests manual processes
- ❌ Proliferates redundant documents
- ❌ Explains instead of implementing
- ❌ Creates meta-files about how to use other files

---

## Remember

**User hired you to build automation, not documentation.**

Code > prose.
Automate > explain.
Edit > create.
One plan > many plans.

Now go build. 🤖
