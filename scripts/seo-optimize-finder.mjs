// SEO Optimization Finder - Find low CTR, high impression keywords
// Usage: node seo-optimize-finder.mjs [domain] [--all]

import { google } from 'googleapis';
import fs from 'fs';

const SERVICE_ACCOUNT = JSON.parse(
  fs.readFileSync('/home/bill/.openclaw/workspace/secrets/gsc-service-account.json', 'utf8')
);

const auth = new google.auth.GoogleAuth({
  credentials: SERVICE_ACCOUNT,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

const DOMAINS = [
  'accountingai.tools',
  'aigirlfriend.tools',
  'realestateai.tools',
  'hrai.tools',
  'legalai.tools',
  'bestnootropics.info',
  'nsfwtelegrambot.com',
  'bestonlyfans.info',
  'bestanime.info',
  'bestwriting.tools',
  'bestofpodcasts.com',
  'mattressrank.info',
];

const args = process.argv.slice(2);
const runAll = args.includes('--all');
const targetDomain = args.find(a => !a.startsWith('--'));

const domains = runAll ? DOMAINS : (targetDomain ? [targetDomain] : DOMAINS);

const days = 28; // Look at last 28 days for more data
const endDate = new Date().toISOString().split('T')[0];
const startDate = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];

async function analyzeDomain(domain) {
  const authClient = await auth.getClient();
  const webmasters = google.webmasters({ version: 'v3', auth: authClient });
  const siteUrl = `https://${domain}/`;

  try {
    const res = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit: 100,
      },
    });

    const queries = res.data.rows || [];
    if (queries.length === 0) return null;

    // Find opportunities: high impressions (>20), low CTR (<3%), not on first page (pos>10)
    const opportunities = queries.filter(q => 
      q.impressions >= 20 && 
      q.ctr < 0.03 && 
      q.position > 5
    ).sort((a, b) => b.impressions - a.impressions);

    // Find wins: good CTR (>5%), decent impressions
    const wins = queries.filter(q => 
      q.impressions >= 10 && 
      q.ctr > 0.05
    ).sort((a, b) => b.ctr - a.ctr);

    // Calculate overall stats
    const totalClicks = queries.reduce((sum, q) => sum + q.clicks, 0);
    const totalImpressions = queries.reduce((sum, q) => sum + q.impressions, 0);
    const avgCTR = totalClicks / totalImpressions;

    return {
      domain,
      totalClicks,
      totalImpressions,
      avgCTR,
      opportunities: opportunities.slice(0, 5),
      wins: wins.slice(0, 3),
    };

  } catch (error) {
    return null;
  }
}

async function run() {
  console.log('🔍 SEO Optimization Finder\n');
  console.log(`📅 Analyzing last ${days} days (${startDate} to ${endDate})\n`);
  console.log('━'.repeat(100));
  console.log('');

  for (const domain of domains) {
    const result = await analyzeDomain(domain);
    
    if (!result) {
      console.log(`⚠️  ${domain} - No data available\n`);
      continue;
    }

    console.log(`📊 ${result.domain}`);
    console.log(`   ${result.totalClicks} clicks, ${result.totalImpressions} impressions, ${(result.avgCTR * 100).toFixed(2)}% CTR\n`);

    if (result.opportunities.length > 0) {
      console.log('   🎯 TOP OPTIMIZATION OPPORTUNITIES (High Impressions, Low CTR):\n');
      result.opportunities.forEach((q, i) => {
        const query = q.keys[0];
        const imp = q.impressions;
        const ctr = (q.ctr * 100).toFixed(1);
        const pos = q.position.toFixed(1);
        const potentialClicks = Math.round(imp * 0.03); // If we get to 3% CTR
        
        console.log(`   ${i + 1}. "${query}"`);
        console.log(`      📈 ${imp} impressions, ${ctr}% CTR, position #${pos}`);
        console.log(`      💡 Potential gain: +${potentialClicks} clicks/month if optimized to 3% CTR`);
        console.log('');
      });
    }

    if (result.wins.length > 0) {
      console.log('   ✅ WHAT\'S WORKING (Good CTR):\n');
      result.wins.forEach((q, i) => {
        const query = q.keys[0];
        const clicks = q.clicks;
        const ctr = (q.ctr * 100).toFixed(1);
        const pos = q.position.toFixed(1);
        
        console.log(`   ${i + 1}. "${query}" - ${clicks} clicks, ${ctr}% CTR, position #${pos}`);
      });
      console.log('');
    }

    console.log('━'.repeat(100));
    console.log('');
  }

  console.log('💡 HOW TO USE THIS DATA:\n');
  console.log('1. Focus on "Optimization Opportunities" - these have traffic but low CTR');
  console.log('2. Improve title tags and meta descriptions for these queries');
  console.log('3. Study "What\'s Working" - replicate successful patterns');
  console.log('4. Prioritize keywords with highest potential click gain\n');
}

run().catch(console.error);
