# RoleOffer.com - MVP Build Progress

## Date: 2026-02-25 (Night Build Session)

---

## ✅ Completed (While Bill Sleeps)

### 1. Infrastructure Setup
- [x] **GitHub Repo Created** - https://github.com/LeadingOT/roleoffer
- [x] **Project Structure Planned** - /app, /components, /lib, /types folders

### 2. Data Layer
- [x] **H1B Salary Data** - 15 mock benchmark entries (6 roles × 5 cities)
  - File: `roleoffer-data/h1b_salaries.json`
  - Note: Using mock data for MVP, real scraping script created
  
- [x] **Equity Benchmarks** - 10 equity benchmark entries
  - File: `roleoffer-data/equity-benchmarks.json`
  - Source: Carta public reports, SaaStr data
  - Covers: IC2-IC5, M1-M2 across Seed/A/B stages

- [x] **Supabase Schema** - Complete database design
  - File: `roleoffer-data/supabase-schema.sql`
  - Tables: roles, locations, stages, comp_data, generated_offers, free_tool_usage
  - Ready to execute once Supabase project is created

### 3. Research & Strategy
- [x] **Competitor Analysis** - Deep dive on Pave & Carta
  - File: `roleoffer-data/competitor-analysis.md`
  - Key findings:
    - Pave: $10-25K/year, requires HRIS, 2+ weeks setup
    - Carta: $25K+/year, bundled with cap table
    - **Gap:** No instant, affordable, privacy-focused tool exists
  - Our attack vector: Speed (30s), Price ($49), Privacy (no data sharing)

- [x] **Landing Page Copy** - Complete marketing messages
  - File: `roleoffer-data/landing-page-copy.md`
  - Includes: Hero, features, comparison table, pricing, FAQ, CTAs
  - Messaging: "The $49 alternative to Pave ($10K+)"

### 4. Code Development (In Progress)
- [⏳] **Next.js MVP Build** - Coding agent spawned (session: roleoffer-build)
  - Status: Building in /tmp/roleoffer-mvp
  - Features: Landing page, benchmark form, results display, free calculator
  - Will auto-announce when complete
  - Expected completion: ~30-60 minutes

---

## ⏳ In Progress

### Coding Agent Tasks
Building Next.js 14 app with:
- TypeScript + Tailwind + shadcn/ui
- Comp benchmark form (role/level/location/stage inputs)
- Results display with charts (P25/P50/P75)
- Free calculator page
- Landing page with hero + pricing
- Mock data integration (no real Supabase yet)

**Working in:** `/tmp/roleoffer-mvp`  
**Delivery:** Clean code, README, git repo ready to push

---

## 🚧 Blocked (Needs Bill)

### Supabase Setup
- [ ] Create Supabase project for RoleOffer
- [ ] Get Supabase URL + anon key + service key
- [ ] Execute schema SQL (roleoffer-data/supabase-schema.sql)
- [ ] Import initial data (roles, locations, stages)

### Airwallex Payment
- [ ] Setup Airwallex merchant account
- [ ] Get payment link API credentials
- [ ] Configure webhook endpoints

### Domain & Deployment
- [ ] Verify roleoffer.com DNS is pointing to Vercel
- [ ] Create Vercel project for roleoffer (separate from directories)
- [ ] Deploy Next.js app to roleoffer.com

### OpenAI API
- [ ] Confirm OpenAI API key for GPT-4o-mini (offer letter generation)
- [ ] Add to env vars

---

## 📋 Next Tasks (After Coding Agent Completes)

### Immediate (Tonight/Tomorrow Morning)
1. Review & test generated Next.js code
2. Push code to GitHub repo
3. Fix any critical bugs
4. Add real data from roleoffer-data/h1b_salaries.json

### Phase 2 (Tomorrow - if Bill approves)
1. Supabase integration (once credentials available)
2. Import mock data to Supabase
3. Connect Next.js to real database
4. Deploy to Vercel staging
5. Add GA4 tracking
6. GSC verification

### Phase 3 (Day 3-4)
1. PDF generation (React-PDF or Puppeteer)
2. Airwallex payment integration (once setup)
3. Email delivery (SendGrid/Resend)
4. Free tools polish
5. Landing page polish

### Phase 4 (Day 5-7)
1. pSEO page generation (first 1,000 pages)
2. SEO meta tags + schema markup
3. Sitemap generation
4. IndexNow submission
5. Pre-launch testing

---

## 📊 Metrics & Goals

### Week 1 Target (Build Phase)
- [x] GitHub repo created
- [⏳] Next.js MVP built (in progress)
- [ ] Supabase connected
- [ ] 1,000 benchmark data points
- [ ] Landing page deployed
- [ ] 3 free tools working

### Week 2 Target (Polish & Deploy)
- [ ] Payment integration working
- [ ] PDF generation working
- [ ] First 5,000 pSEO pages generated
- [ ] GA4 + GSC tracking
- [ ] Pre-launch checklist complete

### Week 3 Target (Launch)
- [ ] Product Hunt launch
- [ ] YC Launch submission
- [ ] Blog post: "Why we built RoleOffer"
- [ ] First 10 paying customers
- [ ] Revenue: $490+

---

## 🔍 Observations & Learnings

### What's Going Well
- **Clear differentiation** - Pave/Carta left huge gap for $49 instant tool
- **Data is available** - H1B, levels.fyi, BLS, Carta reports all public
- **Tech stack proven** - Next.js + Supabase + pSEO worked for Directory Factory
- **MVP scope manageable** - Can ship v1 in 7-10 days

### Risks to Watch
1. **Data quality** - Mock data for MVP OK, but need real scraping soon
2. **Payment integration** - Airwallex might be slower than Stripe (backup plan?)
3. **PDF generation** - Complex feature, might need more time
4. **Supabase limits** - Free tier might not be enough for 20K pSEO pages

### Decisions Needed
1. Should we use Stripe as backup if Airwallex is slow?
2. PDF generation: React-PDF (client) or Puppeteer (server)?
3. Email delivery: SendGrid, Resend, or Supabase Edge Functions?
4. pSEO: Generate all 20K pages upfront or incremental (ISR)?

---

## 💡 Ideas for Tomorrow

### Quick Wins
- Add "Compare to Pave/Carta" calculator on landing page
- Twitter thread: "I built a $49 alternative to Pave ($10K)"
- Submit to Indie Hackers while building

### Content Ideas
- Blog: "Why startup comp tools cost $10K (and why ours costs $49)"
- Guide: "How to make your first startup offer (free template)"
- Comparison: "Pave vs Carta vs RoleOffer (honest breakdown)"

### Growth Hacks
- Free tool: "Equity value calculator" → sharable results page
- "Is my offer fair?" → candidate checks → shares with founder
- pSEO: Own "software engineer compensation series a san francisco" etc.

---

## 📞 Questions for Bill (Tomorrow 6pm)

1. Airwallex vs Stripe for payment - your preference?
2. Supabase credentials - can you create project tonight/tomorrow?
3. OpenAI API key - confirmed available?
4. Launch timeline - still targeting Week 3 (Feb 10-14)?
5. Budget - OK to spend ~$50 on tools (Supabase Pro, email service)?

---

**Status Summary:**  
✅ Infrastructure + Research complete  
⏳ Coding in progress (auto-notify when done)  
🚧 Blocked on Supabase + Airwallex setup  
🎯 On track for Week 1 goals

**Next Session:** Review code, fix bugs, integrate real data, prepare deploy
