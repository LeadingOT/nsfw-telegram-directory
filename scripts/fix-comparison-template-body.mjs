#!/usr/bin/env node
// Fix remaining unsafe property access in comparison template body

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

function fixComparisonTemplate(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix pricing.model access in template body
  if (content.includes('{toolA.pricing.model}') || content.includes('{toolB.pricing.model}')) {
    content = content.replace(/\{toolA\.pricing\.model\}/g, '{toolA.pricing?.model || "Custom"}');
    content = content.replace(/\{toolB\.pricing\.model\}/g, '{toolB.pricing?.model || "Custom"}');
    modified = true;
  }
  
  // Fix features.map() without safety check
  if (content.includes('toolA.features.map(') && !content.includes('(toolA.features || []).map(')) {
    content = content.replace(/toolA\.features\.map\(/g, '(toolA.features || []).map(');
    modified = true;
  }
  
  if (content.includes('toolB.features.map(') && !content.includes('(toolB.features || []).map(')) {
    content = content.replace(/toolB\.features\.map\(/g, '(toolB.features || []).map(');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  
  return false;
}

function fixAlternativesTemplate(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix any remaining unsafe accesses in alternatives
  if (content.includes('.features.map(') && !content.includes('|| []).map(')) {
    content = content.replace(/\.features\.map\(/g, '?.features || []).map(');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  
  return false;
}

console.log('🔧 Fixing template body unsafe property access...\n');

let fixedCount = 0;

for (const site of SITES) {
  const basePath = `/home/bill/.openclaw/workspace/${site}/src/pages`;
  
  // Fix comparison [slug].astro
  const comparisonFile = path.join(basePath, 'compare/[slug].astro');
  if (fixComparisonTemplate(comparisonFile)) {
    console.log(`✅ Fixed ${site}/compare/[slug].astro`);
    fixedCount++;
  }
  
  // Fix alternatives [slug].astro
  const alternativesFile = path.join(basePath, 'alternatives/[slug].astro');
  if (fixAlternativesTemplate(alternativesFile)) {
    console.log(`✅ Fixed ${site}/alternatives/[slug].astro`);
    fixedCount++;
  }
}

console.log(`\n🎉 Fixed ${fixedCount} files!`);
