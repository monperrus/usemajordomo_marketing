# Quick Start: Next 48 Hours

## Your Mission
Get first customers for Majordomo with $100/month budget.

## TODAY (Day 1) - 4-6 hours

### Hour 1: Content Publishing (HIGH PRIORITY)
**Goal:** Get 3 blog posts live for SEO

- [x] **Set up blog** (if not already done)
  - Option 1: WordPress on usemajordomo.com/blog (free with hosting)
  - Option 2: Medium.com/@majordomo (free, fast, SEO benefits)
  - Option 3: Substack (free, builds email list)

- [x] **Publish 3 blog posts** (already written in `/content/blog/`)
  1. "How to Manage 100+ Emails Per Day" - `/content/blog/01-manage-100-emails-per-day.md`
  2. "AI Email Assistant Under $10" - `/content/blog/02-ai-email-assistant-under-10-dollars.md`
  3. "Email Bankruptcy Guide" - `/content/blog/03-email-bankruptcy-what-it-is-how-to-prevent.md`

- [x] **Add CTAs to each post**
  - Bottom: "Try Majordomo free for 7 days: https://usemajordomo.com"
  - Inline: "[mention product naturally]"

### Hour 2: Social Media Setup
**Goal:** Establish presence, start building audience

- [x] **Twitter/X Setup**
  - Create account: @usemajordomo (or @majordomoai if taken)
  - Bio: "Never reply to an email again. Autonomous AI email agent. $9/month. Built by bootstrappers for bootstrappers. 🤖"
  - Profile pic: Logo
  - Banner: "AI Email Agent - $9/month - 500 Replies Included"
  - Pinned tweet: "Spending 3hrs/day on email? Majordomo is AI that handles responses for you. $9/month. Try free: [link]"

- [x] **LinkedIn Company Page**
  - Create: Majordomo
  - Add: Description, logo, website
  - First post: Introduce the product (use content from `/content/social/linkedin-week-1.md`)

- [x] **LinkedIn Personal (Founder Account)**
  - Update bio to mention Majordomo
  - Post first founder story (from LinkedIn week 1 content)

- [x] **Reddit Account**
  - Create account (don't use "majordomo" - be personal)
  - Subscribe to: r/entrepreneur, r/productivity, r/startups, r/SaaS, r/solopreneur
  - **Don't post yet** - just read and understand communities

### Hour 3: Cold Email Infrastructure Setup
**Goal:** Get email system ready to send

- [ ] **Buy domain for cold email**
  - Go to Namecheap.com
  - Buy: getmajordomo.com or trymajordomo.com (~$12/year)
  - Purpose: Separate from main domain to protect reputation

- [x] **Sign up for Instantly.ai**
  - Go to instantly.ai
  - Sign up: $37/month plan (unlimited sending)
  - Connect your new domain
  - **Important:** Start email warmup (takes 7-14 days before sending)

- [ ] **Sign up for Hunter.io**
  - Go to hunter.io
  - Sign up: $49/month plan (500 searches)
  - Purpose: Find email addresses of leads

### Hour 4: Lead List Building (First 100)
**Goal:** Build your first cold email list

**Segment 1: Founders (50 leads)**
- [ ] Go to LinkedIn
- [ ] Search: "Founder" + "Startup" + Location (US/UK)
- [ ] Filter: Companies 1-20 employees
- [ ] For each, get:
  - First name
  - Company name
  - Recent milestone (funding, launch, etc.)
  - Use Hunter.io to find email

**Segment 2: Consultants (50 leads)**
- [ ] LinkedIn search: "Consultant" or "Fractional"
- [ ] Look for: Active on LinkedIn, has website
- [ ] Get email via Hunter.io or from their website

**Export to CSV with columns:**
- FirstName
- CompanyName
- Email
- RecentMilestone (for personalization)

### Hour 5-6: Content Creation for Week 1
**Goal:** Prepare content so you can schedule and forget

- [ ] **Create 7 days of tweets** (already written in `/content/social/twitter-week-1.md`)
  - Copy content to a Google Doc or Notion
  - Make minor edits for your personal voice
  - Add links to your actual website

- [ ] **Create 5 LinkedIn posts** (already written in `/content/social/linkedin-week-1.md`)
  - Same process as tweets
  - Prepare any images/graphics needed

- [ ] **Set up Buffer or Hootsuite (FREE)**
  - Go to buffer.com (free plan)
  - Connect Twitter and LinkedIn
  - Schedule Week 1 content (Mon-Sun)
  - Time slots:
    - Twitter: 8am, 12pm, 5pm, 8pm (4x/day)
    - LinkedIn: 10am, 2pm (2x/day)

---

## TOMORROW (Day 2) - 4-6 hours

### Hour 1: MCP Setup (If you want automation)
**Goal:** Install tools for automated posting

- [ ] **Install SEO MCP** (for keyword research)
  ```bash
  npm install -g @cnych/seo-mcp
  ```

- [ ] **Try Twitter MCP** (for automated posting)
  - Check PulseMCP for installation
  - Get Twitter API keys
  - Test with one tweet

- [ ] **Optional:** LinkedIn MCP
  - Usually takes longer to get API access
  - Can skip and use Buffer instead

**If MCPs are complex, SKIP and just use Buffer. Don't let this block you.**

### Hour 2: Cold Email Sequence Setup
**Goal:** Get first campaign ready to send (after warmup)

- [ ] **Upload lead list to Instantly.ai**
  - Import your CSV (100 leads)
  - Verify emails (Instantly does this automatically)

- [ ] **Set up Sequence #1: Founders**
  - Copy sequence from `/content/email/cold-email-sequences.md`
  - Personalize for your voice
  - Add personalization tokens ({{firstName}}, etc.)
  - Set timing: Day 0, Day 3, Day 7, Day 12, Day 18

- [ ] **Configure sending**
  - Limit: 20 emails/day to start
  - Sending hours: Mon-Fri, 9am-5pm
  - **Don't send yet** - warmup needs to complete (7-14 days)

### Hour 3: Analytics Setup
**Goal:** Track what's working

- [ ] **Google Analytics**
  - Add GA4 to usemajordomo.com
  - Set up goals: Sign-ups, trial starts
  - Track blog post views

- [ ] **Simple spreadsheet for tracking**
  - Create Google Sheet: "Majordomo Marketing Metrics"
  - Columns: Date | Website Visitors | Social Followers | Email Sent | Trials Started | Paying Customers | MRR
  - Update weekly

### Hour 4: Reddit Engagement (Start Building Karma)
**Goal:** Become helpful member before promoting

- [ ] **Find 10 relevant posts** in:
  - r/entrepreneur
  - r/productivity
  - r/startups

- [ ] **Leave helpful comments** (NO product mentions yet)
  - Answer questions
  - Share genuine advice
  - Build karma and history

**Rule:** 10 helpful comments for every 1 promotional mention

### Hour 5: Customer Interview Process
**Goal:** Get testimonials and case studies

- [ ] **Create interview guide**
  - Questions listed in `bootstrap-plan.md` under "Customer Interview Questions"

- [ ] **Email existing customers**
  ```
  Subject: Quick favor? 15-min interview for a case study

  Hey [Name],

  Hope you're loving Majordomo! Quick favor to ask:

  Would you be open to a 15-minute interview about your experience?
  I'm building case studies to help other founders/consultants who
  are drowning in email like you were.

  In exchange: I'll give you 3 months free ($27 value).

  If yes, here's my calendar: [link]

  Thanks!
  [Your name]
  ```

- [ ] **Schedule 3-5 interviews** for this week

### Hour 6: Week 2 Planning
**Goal:** Don't lose momentum

- [ ] **Review what's done:**
  - ✅ Blog posts published
  - ✅ Social media active
  - ✅ Email infrastructure ready
  - ✅ First lead list built

- [ ] **Plan next week:**
  - Write 2-3 more blog posts
  - Build next 100-lead email list
  - Start Reddit promotion (after building karma)
  - Analyze what content performed best

- [ ] **Set calendar reminders:**
  - Mon: Build 20 new leads
  - Wed: Write 1 blog post
  - Fri: Review metrics, plan next week

---

## Week 1 Checklist (Days 3-7)

### Daily Tasks (30 min/day):
- [ ] Post to Twitter (if not scheduled)
- [ ] Post to LinkedIn (if not scheduled)
- [ ] Make 3-5 Reddit comments (be helpful)
- [ ] Build 10-20 new email leads
- [ ] Check for social media engagement, reply to all comments

### By End of Week:
- [ ] 5+ blog posts published
- [ ] 100+ Twitter followers
- [ ] 50+ LinkedIn connections
- [ ] 100+ karma on Reddit
- [ ] 500 leads in email list (ready for when warmup completes)
- [ ] 2-3 customer interviews completed
- [ ] First draft of case study written

---

## When Email Warmup Completes (Day 7-14)

### Start Cold Outreach:
- [ ] **Day 1:** Send 20 emails (Founder sequence)
- [ ] **Day 2:** Send 20 emails (Consultant sequence)
- [ ] **Day 3-7:** Ramp up to 50-100 emails/day
- [ ] **Monitor:** Open rate (40%+), reply rate (5%+)
- [ ] **Adjust:** If rates are low, improve copy

---

## Success Metrics - Week 1 Goals

**Website:**
- [ ] 100-200 visitors
- [ ] 5-10 trial signups

**Social Media:**
- [ ] Twitter: 50-100 followers
- [ ] LinkedIn: 30-50 connections
- [ ] Engagement: 10+ comments/replies

**Email:**
- [ ] 500 leads built
- [ ] Warmup in progress
- [ ] 0 sent yet (waiting for warmup)

**Content:**
- [ ] 5 blog posts published
- [ ] 20+ social posts scheduled/published
- [ ] 2-3 case studies in progress

**Revenue:**
- [ ] 1-3 trials started
- [ ] 0-1 paying customers (🤞)

---

## What to Do If You Get Stuck

**Stuck on blog setup?**
→ Use Medium.com - takes 5 minutes, free, good SEO

**Stuck on MCP installation?**
→ Skip it, use Buffer instead for scheduling

**Stuck on lead generation?**
→ Start smaller: 20 leads instead of 100

**Stuck on cold email copy?**
→ Use templates as-is, personalize later

**Stuck on anything else?**
→ Ask me (Claude) - I'm here to help!

---

## Time Investment Summary

**Week 1:**
- Setup (Day 1-2): 8-12 hours
- Daily maintenance (Day 3-7): 30-60 min/day
- **Total:** 10-15 hours

**Week 2+:**
- Daily: 30-60 minutes
- Content creation: 2-3 hours/week
- Lead building: 2-3 hours/week
- **Total:** 5-7 hours/week

**This is very manageable while building the product.**

---

## Motivation Reminder

**You're charging $9/month.**

You only need:
- 10 customers = $90/month (covers marketing budget)
- 20 customers = $180/month (can increase budget)
- 50 customers = $450/month (quit your job territory starts)
- 100 customers = $900/month (profitable side business)

Every founder/consultant you help is someone who gets 10+ hours/week back.

**This isn't just marketing. You're literally giving people their lives back.**

Now go execute. 🚀

---

## Emergency Shortcuts (If You're Really Time-Crunched)

**Minimum viable marketing (2 hours):**
1. Publish 1 blog post on Medium (30 min)
2. Create Twitter account, post 5 tweets (30 min)
3. Post to r/entrepreneur: "I built AI email automation for $9/month, AMA" (30 min)
4. Email 10 friends/connections asking them to try it (30 min)

**This won't scale, but it's better than nothing.**

Then build from there week by week.
