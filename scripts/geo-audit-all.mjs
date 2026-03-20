#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const workspace = process.env.HOME + '/.openclaw/workspace';
const skillPath = process.env.HOME + '/.claude/skills/geo';

const sites = [
  { domain: 'accountingai.tools', name: 'AccountingAI', listings: 15 },
  { domain: 'aigirlfriend.tools', name: 'AIGirlfriend', listings: 28 },
  { domain: 'aihumanizer.tools', name: 'AI Humanizer', listings: 18 },
  { domain: 'bestaidetector.tools', name: 'Best AI Detector', listings: 18 },
  { domain: 'bestanime.info', name: 'Best Anime', listings: 20 },
  { domain: 'bestnootropics.info', name: 'Best Nootropics', listings: 15 },
  { domain: 'bestofpodcasts.com', name: 'Best Podcasts', listings: 25 },
  { domain: 'bestonlyfans.info', name: 'Best OnlyFans', listings: 30 },
  { domain: 'bestwriting.tools', name: 'Best Writing', listings: 20 },
  { domain: 'hrai.tools', name: 'HRAI', listings: 15 },
  { domain: 'legalai.tools', name: 'LegalAI', listings: 15 },
  { domain: 'mattressrank.info', name: 'Mattress Rank', listings: 12 },
  { domain: 'nsfwtelegrambot.com', name: 'NSFW Telegram', listings: 20 },
  { domain: 'realestateai.tools', name: 'RealEstateAI', listings: 15 },
];

// Quick GEO audit for each site
async function quickAudit(site) {
  const url = `https://${site.domain}`;
  
  console.log(`\n🔍 Auditing ${site.name} (${site.domain})...`);
  
  try {
    // Fetch page metadata
    const fetchCmd = `python3 ${skillPath}/scripts/fetch_page.py ${url}`;
    const pageData = JSON.parse(execSync(fetchCmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }));
    
    // Check robots.txt
    const robotsTxt = execSync(`curl -s https://${site.domain}/robots.txt`, { encoding: 'utf-8' }).trim();
    const hasAICrawlers = robotsTxt.includes('GPTBot') && robotsTxt.includes('ClaudeBot');
    
    // Check llms.txt
    let hasLlmsTxt = false;
    try {
      const llmsTxt = execSync(`curl -s https://${site.domain}/llms.txt`, { encoding: 'utf-8' }).trim();
      hasLlmsTxt = llmsTxt.length > 50 && llmsTxt.includes('#');
    } catch (e) {}
    
    // Check schema
    const hasOrgSchema = pageData.meta_tags && JSON.stringify(pageData).includes('"@type":"Organization"');
    
    // Canonical check
    const canonicalOK = pageData.canonical && pageData.canonical.includes(site.domain);
    
    // Calculate GEO score (simplified)
    let score = 0;
    if (hasAICrawlers) score += 20;
    if (hasLlmsTxt) score += 25;
    if (hasOrgSchema) score += 15;
    if (canonicalOK) score += 15;
    if (pageData.status_code === 200) score += 10;
    if (pageData.headers && pageData.headers['Strict-Transport-Security']) score += 5;
    if (site.listings >= 20) score += 10; // Content depth
    
    return {
      domain: site.domain,
      name: site.name,
      score: score,
      checks: {
        aiCrawlers: hasAICrawlers,
        llmsTxt: hasLlmsTxt,
        orgSchema: hasOrgSchema,
        canonical: canonicalOK,
        https: pageData.status_code === 200,
        listings: site.listings
      },
      meta: {
        title: pageData.title || 'N/A',
        description: pageData.description || 'N/A',
        h1: pageData.h1_tags?.[0] || 'N/A'
      }
    };
  } catch (error) {
    console.error(`  ❌ Error auditing ${site.domain}:`, error.message);
    return {
      domain: site.domain,
      name: site.name,
      score: 0,
      error: error.message
    };
  }
}

async function main() {
  console.log('📊 GEO Audit — Directory Factory (14 Sites)\n');
  console.log('Running quick audits on all sites...\n');
  
  const results = [];
  
  for (const site of sites) {
    const result = await quickAudit(site);
    results.push(result);
    
    if (!result.error) {
      const grade = result.score >= 90 ? 'A' : result.score >= 80 ? 'B' : result.score >= 70 ? 'C' : result.score >= 60 ? 'D' : 'F';
      console.log(`  Score: ${result.score}/100 (${grade})`);
      console.log(`  ✓ AI Crawlers: ${result.checks.aiCrawlers ? 'Yes' : 'No'}`);
      console.log(`  ✓ llms.txt: ${result.checks.llmsTxt ? 'Yes' : 'No'}`);
      console.log(`  ✓ Schema: ${result.checks.orgSchema ? 'Yes' : 'No'}`);
      console.log(`  ✓ Canonical: ${result.checks.canonical ? 'Yes' : 'No'}`);
    }
  }
  
  // Generate summary report
  const report = generateReport(results);
  
  // Save to memory
  const memoryPath = path.join(workspace, 'memory/geo-audit-2026-03-10.md');
  fs.writeFileSync(memoryPath, report, 'utf-8');
  
  console.log(`\n✅ Audit complete! Report saved to memory/geo-audit-2026-03-10.md`);
  console.log(`\n📊 Overall Stats:`);
  
  const avgScore = results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length;
  console.log(`  Average GEO Score: ${avgScore.toFixed(1)}/100`);
  
  const sitesWithLlms = results.filter(r => r.checks?.llmsTxt).length;
  console.log(`  Sites with llms.txt: ${sitesWithLlms}/14`);
  
  const sitesWithSchema = results.filter(r => r.checks?.orgSchema).length;
  console.log(`  Sites with Schema: ${sitesWithSchema}/14`);
}

function generateReport(results) {
  const now = new Date().toISOString().split('T')[0];
  
  let report = `# GEO Audit Report — Directory Factory\n`;
  report += `**Date:** ${now}\n`;
  report += `**Sites Audited:** ${results.length}\n`;
  report += `**Tool:** GEO-SEO Claude Code Skill\n\n`;
  report += `---\n\n`;
  
  report += `## Executive Summary\n\n`;
  
  const avgScore = results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length;
  const gradeCount = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  
  results.forEach(r => {
    const grade = r.score >= 90 ? 'A' : r.score >= 80 ? 'B' : r.score >= 70 ? 'C' : r.score >= 60 ? 'D' : 'F';
    gradeCount[grade]++;
  });
  
  report += `**Average GEO Score:** ${avgScore.toFixed(1)}/100\n\n`;
  report += `**Grade Distribution:**\n`;
  report += `- A (90-100): ${gradeCount.A} sites\n`;
  report += `- B (80-89): ${gradeCount.B} sites\n`;
  report += `- C (70-79): ${gradeCount.C} sites\n`;
  report += `- D (60-69): ${gradeCount.D} sites\n`;
  report += `- F (<60): ${gradeCount.F} sites\n\n`;
  
  report += `---\n\n`;
  report += `## Site-by-Site Results\n\n`;
  
  // Sort by score
  const sorted = [...results].sort((a, b) => (b.score || 0) - (a.score || 0));
  
  sorted.forEach((site, i) => {
    const grade = site.score >= 90 ? 'A' : site.score >= 80 ? 'B' : site.score >= 70 ? 'C' : site.score >= 60 ? 'D' : 'F';
    
    report += `### ${i + 1}. ${site.name} (${site.domain})\n\n`;
    report += `**Score:** ${site.score}/100 (Grade ${grade})\n\n`;
    
    if (site.checks) {
      report += `**GEO Checklist:**\n`;
      report += `- ${site.checks.aiCrawlers ? '✅' : '❌'} AI Crawler Rules (robots.txt)\n`;
      report += `- ${site.checks.llmsTxt ? '✅' : '❌'} llms.txt File\n`;
      report += `- ${site.checks.orgSchema ? '✅' : '❌'} Organization Schema\n`;
      report += `- ${site.checks.canonical ? '✅' : '❌'} Canonical URL\n`;
      report += `- ${site.checks.https ? '✅' : '❌'} HTTPS + Security\n`;
      report += `- Content: ${site.checks.listings} listings\n\n`;
      
      if (site.meta) {
        report += `**SEO Metadata:**\n`;
        report += `- Title: ${site.meta.title}\n`;
        report += `- H1: ${site.meta.h1}\n\n`;
      }
    }
    
    if (site.error) {
      report += `**Error:** ${site.error}\n\n`;
    }
    
    report += `---\n\n`;
  });
  
  report += `## Top 3 Priority Actions\n\n`;
  report += `1. **Add llms.txt to all sites** — Only ${results.filter(r => r.checks?.llmsTxt).length}/14 have it\n`;
  report += `2. **Complete schema markup** — Add ItemList + Article schemas\n`;
  report += `3. **Create AI-citable content blocks** — 134-167 word passages\n\n`;
  
  report += `---\n\n`;
  report += `**Generated by:** GEO-SEO Claude Code Skill\n`;
  report += `**GitHub:** https://github.com/zubair-trabzada/geo-seo-claude\n`;
  
  return report;
}

main().catch(console.error);
