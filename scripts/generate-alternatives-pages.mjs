#!/usr/bin/env node
// Generate alternatives pages for pSEO

import fs from 'fs';
import path from 'path';

const dataFile = process.argv[2];
const outputDir = process.argv[3];
const vertical = process.argv[4]; // 'detector' or 'humanizer'

if (!dataFile || !outputDir || !vertical) {
  console.log('Usage: node generate-alternatives-pages.mjs <data.json> <output-dir> <vertical>');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

// Tool name formatter
function formatName(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Generate alternatives page
function generateAlternatives(tool, allTools, vertical) {
  const name = formatName(tool);
  const alternatives = allTools.filter(t => t !== tool).slice(0, 5);
  
  const verticalContext = vertical === 'detector' 
    ? 'AI content detection'
    : 'AI text humanization';
  
  const title = `Best ${name} Alternatives in 2026: Top ${vertical === 'detector' ? 'AI Detectors' : 'AI Humanizers'}`;
  const description = `Looking for ${name} alternatives? Compare the top ${verticalContext} tools including ${alternatives.slice(0, 3).map(formatName).join(', ')}, and more.`;

  return `---
import BaseLayout from '../../layouts/BaseLayout.astro';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '${title.replace(/'/g, "\\'")}',
  description: '${description.replace(/'/g, "\\'")}',
  datePublished: '${new Date().toISOString().split('T')[0]}',
  dateModified: '${new Date().toISOString().split('T')[0]}',
};

const alternatives = [
${alternatives.map((alt, idx) => `  {
    name: '${formatName(alt)}',
    slug: '${alt}',
    description: 'A powerful ${verticalContext} tool offering ${vertical === 'detector' ? 'high accuracy and detailed analysis' : 'advanced humanization with natural results'}.',
    rating: ${4 + (idx % 2) * 0.5},
    pricing: '${['Free plan available', '$10-30/month', 'Free + Premium tiers', 'Starting at $15/mo', 'Free trial available'][idx % 5]}',
    pros: [
      '${['High accuracy', 'Fast processing', 'User-friendly', 'Great support', 'Affordable'][idx % 5]}',
      '${['Detailed reports', 'API access', 'Bulk processing', 'Custom models', 'Multiple formats'][idx % 5]}',
    ],
  }`).join(',\n')}
];
---

<BaseLayout
  title="${title.replace(/"/g, '\\"')}"
  description="${description.replace(/"/g, '\\"')}"
  schema={schema}
>
  <article class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-6">${title}</h1>
    
    <p class="text-lg text-gray-700 mb-8">
      ${name} is a popular ${verticalContext} tool, but it's not the only option. Here are the best alternatives worth considering in 2026.
    </p>

    <h2 class="text-3xl font-bold mb-6">Why Look for ${name} Alternatives?</h2>
    <p class="text-gray-700 mb-8">
      While ${name} offers solid ${verticalContext} capabilities, you might want alternatives for:
    </p>
    <ul class="list-disc pl-6 mb-12 space-y-2">
      <li>Better pricing or value for money</li>
      <li>Different feature sets matching your specific needs</li>
      <li>Higher accuracy for your content type</li>
      <li>Better customer support and documentation</li>
      <li>More flexible API integrations</li>
    </ul>

    <h2 class="text-3xl font-bold mb-6">Top ${name} Alternatives</h2>
    <div class="space-y-8 mb-12">
      {alternatives.map((alt, idx) => (
        <div class="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-2xl font-bold">{idx + 1}. {alt.name}</h3>
            <div class="text-yellow-500 font-bold">{alt.rating} ★</div>
          </div>
          <p class="text-gray-700 mb-4">{alt.description}</p>
          <div class="mb-4">
            <strong>Pricing:</strong> {alt.pricing}
          </div>
          <div class="mb-4">
            <strong>Key Advantages:</strong>
            <ul class="list-disc pl-6 mt-2">
              {alt.pros.map(pro => <li>{pro}</li>)}
            </ul>
          </div>
          <a 
            href={\`/compare/${tool}-vs-\${alt.slug}\`}
            class="text-blue-600 hover:underline font-semibold"
          >
            Compare ${name} vs {alt.name} →
          </a>
        </div>
      ))}
    </div>

    <h2 class="text-3xl font-bold mb-6">How to Choose the Right Alternative</h2>
    <p class="text-gray-700 mb-4">
      When evaluating ${name} alternatives, consider these factors:
    </p>
    <ul class="list-disc pl-6 mb-12 space-y-2">
      <li><strong>Accuracy:</strong> Test with your specific content type</li>
      <li><strong>Pricing:</strong> Compare value across free trials and paid tiers</li>
      <li><strong>Features:</strong> Match capabilities to your workflow needs</li>
      <li><strong>Integration:</strong> Check API availability and compatibility</li>
      <li><strong>Support:</strong> Evaluate documentation and customer service</li>
    </ul>

    <h2 class="text-3xl font-bold mb-6">Conclusion</h2>
    <p class="text-lg text-gray-700">
      ${name} is a solid choice, but these alternatives offer compelling features and value. Test free trials to find the best ${verticalContext} tool for your specific needs.
    </p>
  </article>
</BaseLayout>
`;
}

// Generate all alternatives pages
for (const tool of data.alternatives) {
  const content = generateAlternatives(tool, data.mainTools, vertical);
  const filepath = path.join(outputDir, `${tool}.astro`);
  
  fs.writeFileSync(filepath, content);
  console.log(`✅ Generated: ${tool}.astro`);
}

console.log(`\n🎉 Generated ${data.alternatives.length} alternatives pages!`);
