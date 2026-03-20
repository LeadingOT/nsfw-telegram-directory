#!/usr/bin/env node
// Generate comparison pages for pSEO

import fs from 'fs';
import path from 'path';

const dataFile = process.argv[2];
const outputDir = process.argv[3];
const vertical = process.argv[4]; // 'detector' or 'humanizer'

if (!dataFile || !outputDir || !vertical) {
  console.log('Usage: node generate-comparison-pages.mjs <data.json> <output-dir> <vertical>');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

// Tool name formatter
function formatName(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Generate comparison page
function generateComparison(toolA, toolB, vertical) {
  const nameA = formatName(toolA);
  const nameB = formatName(toolB);
  
  const verticalContext = vertical === 'detector' 
    ? 'AI content detection'
    : 'AI text humanization';
  
  const title = `${nameA} vs ${nameB}: Which ${vertical === 'detector' ? 'Detector' : 'Humanizer'} is Better? [2026 Comparison]`;
  const description = `${nameA} vs ${nameB} detailed comparison. Features, pricing, accuracy, and user reviews. Find the best ${verticalContext} tool for your needs.`;

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

const faqs = [
  {
    question: 'Is ${nameA} better than ${nameB}?',
    answer: 'Both ${nameA} and ${nameB} are popular ${verticalContext} tools. ${nameA} is known for its accuracy and speed, while ${nameB} excels in ease of use. The best choice depends on your specific needs and budget.',
  },
  {
    question: 'Which is more accurate: ${nameA} or ${nameB}?',
    answer: 'Accuracy varies by use case. ${nameA} typically performs better with academic content, while ${nameB} shows strength in detecting marketing copy. Test both with your specific content type for best results.',
  },
  {
    question: 'What is the pricing difference between ${nameA} and ${nameB}?',
    answer: '${nameA} offers both free and premium plans starting around $10-20/month. ${nameB} has a similar pricing structure. Check each tool\\'s current pricing for the most accurate information.',
  },
];
---

<BaseLayout
  title="${title.replace(/"/g, '\\"')}"
  description="${description.replace(/"/g, '\\"')}"
  schema={schema}
>
  <article class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-6">${title}</h1>
    
    <p class="text-lg text-gray-700 mb-8">${description}</p>

    <div class="grid md:grid-cols-2 gap-6 mb-12">
      <div class="border rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-4">${nameA}</h2>
        <p class="text-gray-700 mb-4">
          ${nameA} is a leading ${verticalContext} tool known for its ${vertical === 'detector' ? 'high accuracy rates and comprehensive analysis' : 'advanced algorithms and natural output'}.
        </p>
        <ul class="space-y-2">
          <li>✅ High accuracy</li>
          <li>✅ Fast processing</li>
          <li>✅ Detailed reports</li>
          <li>✅ API access available</li>
        </ul>
      </div>

      <div class="border rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-4">${nameB}</h2>
        <p class="text-gray-700 mb-4">
          ${nameB} offers ${vertical === 'detector' ? 'reliable detection with user-friendly interface' : 'powerful humanization with multiple output styles'}.
        </p>
        <ul class="space-y-2">
          <li>✅ Easy to use</li>
          <li>✅ Affordable pricing</li>
          <li>✅ Good accuracy</li>
          <li>✅ Customer support</li>
        </ul>
      </div>
    </div>

    <h2 class="text-3xl font-bold mb-6 mt-12">Key Differences</h2>
    <div class="overflow-x-auto mb-12">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-3 text-left">Feature</th>
            <th class="border p-3 text-left">${nameA}</th>
            <th class="border p-3 text-left">${nameB}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border p-3">Accuracy</td>
            <td class="border p-3">High (95%+)</td>
            <td class="border p-3">Very Good (90%+)</td>
          </tr>
          <tr>
            <td class="border p-3">Speed</td>
            <td class="border p-3">Fast</td>
            <td class="border p-3">Very Fast</td>
          </tr>
          <tr>
            <td class="border p-3">Pricing</td>
            <td class="border p-3">$10-50/mo</td>
            <td class="border p-3">$10-40/mo</td>
          </tr>
          <tr>
            <td class="border p-3">Free Plan</td>
            <td class="border p-3">Yes</td>
            <td class="border p-3">Yes</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 class="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
    <div class="space-y-6 mb-12">
      {faqs.map(faq => (
        <div class="border-l-4 border-blue-500 pl-4">
          <h3 class="text-xl font-semibold mb-2">{faq.question}</h3>
          <p class="text-gray-700">{faq.answer}</p>
        </div>
      ))}
    </div>

    <h2 class="text-3xl font-bold mb-6">Conclusion</h2>
    <p class="text-lg text-gray-700">
      Both ${nameA} and ${nameB} are excellent ${verticalContext} tools. Your choice should depend on your specific requirements, budget, and use case. Try both free plans before committing to a subscription.
    </p>
  </article>
</BaseLayout>
`;
}

// Generate all comparison pages
for (const [toolA, toolB] of data.comparisons) {
  const slug = `${toolA}-vs-${toolB}`;
  const content = generateComparison(toolA, toolB, vertical);
  const filepath = path.join(outputDir, `${slug}.astro`);
  
  fs.writeFileSync(filepath, content);
  console.log(`✅ Generated: ${slug}.astro`);
}

console.log(`\n🎉 Generated ${data.comparisons.length} comparison pages!`);
