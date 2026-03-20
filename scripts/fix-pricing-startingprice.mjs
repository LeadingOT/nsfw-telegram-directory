#!/usr/bin/env node
// Fix all pricing.startingPrice accesses to use optional chaining

import fs from 'fs';
import path from 'path';

const SITES = [
  'accountingai-directory',
  'aigirlfriend-directory',
  'hrai-directory',
  'legalai-directory',
  'realestate-ai-directory',
  'bestwriting-directory',
  'bestnootropics-directory',
  'bestonlyfans-directory',
  'bestanime-directory',
  'mattressrank-directory',
  'bestofpodcasts-directory',
  'nsfw-telegram-directory',
];

function fixPricingAccess(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix toolA.pricing.startingPrice → toolA.pricing?.startingPrice
  // But only in conditional checks, not where it's already after ?.
  // Pattern: pricing.startingPrice ? (where pricing is not followed by ?)
  
  const patterns = [
    // In ternary/conditional expressions
    [/\{(tool[AB])\.pricing\.startingPrice \?/g, '{$1.pricing?.startingPrice ?'],
    [/\{(tool)\.pricing\.startingPrice \?/g, '{$1.pricing?.startingPrice ?'],
    // In template literals within answer strings
    [/\$\{(tool[AB])\.pricing\.startingPrice\}/g, '${$1.pricing?.startingPrice}'],
    [/\$\{(tool)\.pricing\.startingPrice\}/g, '${$1.pricing?.startingPrice}'],
  ];
  
  for (const [pattern, replacement] of patterns) {
    if (content.match(pattern)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  
  return false;
}

console.log('🔧 Fixing pricing.startingPrice accesses...\n');

let fixedCount = 0;

for (const site of SITES) {
  const basePath = `/home/bill/.openclaw/workspace/${site}/src/pages`;
  
  // Fix comparison [slug].astro
  const comparisonFile = path.join(basePath, 'compare/[slug].astro');
  if (fixPricingAccess(comparisonFile)) {
    console.log(`✅ Fixed ${site}/compare/[slug].astro`);
    fixedCount++;
  }
  
  // Fix alternatives [slug].astro
  const alternativesFile = path.join(basePath, 'alternatives/[slug].astro');
  if (fixPricingAccess(alternativesFile)) {
    console.log(`✅ Fixed ${site}/alternatives/[slug].astro`);
    fixedCount++;
  }
}

console.log(`\n🎉 Fixed ${fixedCount} files!`);
