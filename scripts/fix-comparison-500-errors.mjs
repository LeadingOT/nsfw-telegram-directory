#!/usr/bin/env node
// Fix comparison pages 500 errors by adding safe property access

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

function fixComparisonPage(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix features[0] access
  content = content.replace(
    /\$\{toolA\.features\[0\]\.toLowerCase\(\)\}/g,
    '${toolA.features?.[0]?.toLowerCase() || toolA.category?.toLowerCase() || "its features"}'
  );
  
  content = content.replace(
    /\$\{toolB\.features\[0\]\.toLowerCase\(\)\}/g,
    '${toolB.features?.[0]?.toLowerCase() || toolB.category?.toLowerCase() || "its features"}'
  );
  
  // Fix features.slice access
  content = content.replace(
    /\$\{toolA\.features\.slice\(0, 2\)\.join\(' and '\)\.toLowerCase\(\)\}/g,
    '${(toolA.features?.slice(0, 2) || [toolA.category || "features"]).join(" and ").toLowerCase()}'
  );
  
  content = content.replace(
    /\$\{toolB\.features\.slice\(0, 2\)\.join\(' and '\)\.toLowerCase\(\)\}/g,
    '${(toolB.features?.slice(0, 2) || [toolB.category || "features"]).join(" and ").toLowerCase()}'
  );
  
  // Fix pricing.model access
  content = content.replace(
    /\$\{toolA\.pricing\.model\}/g,
    '${toolA.pricing?.model || "flexible"}'
  );
  
  content = content.replace(
    /\$\{toolB\.pricing\.model\}/g,
    '${toolB.pricing?.model || "flexible"}'
  );
  
  fs.writeFileSync(filePath, content);
  return true;
}

function fixAlternativesPage(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix features[0] access in alternatives
  content = content.replace(
    /tool\.features\[0\]\.toLowerCase\(\)/g,
    'tool.features?.[0]?.toLowerCase() || tool.category?.toLowerCase() || "its features"'
  );
  
  content = content.replace(
    /tool\.features\.slice\(0, 2\)\.join\(' and '\)\.toLowerCase\(\)/g,
    '(tool.features?.slice(0, 2) || [tool.category || "features"]).join(" and ").toLowerCase()'
  );
  
  fs.writeFileSync(filePath, content);
  return true;
}

console.log('🔧 Fixing comparison & alternatives pages...\n');

for (const site of SITES) {
  const basePath = `/home/bill/.openclaw/workspace/${site}/src/pages`;
  
  // Fix comparison [slug].astro
  const comparisonFile = path.join(basePath, 'compare/[slug].astro');
  if (fs.existsSync(comparisonFile)) {
    fixComparisonPage(comparisonFile);
    console.log(`✅ Fixed ${site}/compare/[slug].astro`);
  }
  
  // Fix alternatives [slug].astro  
  const alternativesFile = path.join(basePath, 'alternatives/[slug].astro');
  if (fs.existsSync(alternativesFile)) {
    fixAlternativesPage(alternativesFile);
    console.log(`✅ Fixed ${site}/alternatives/[slug].astro`);
  }
}

console.log('\n🎉 All pages fixed!');
