#!/usr/bin/env node
// Convert markdown blog posts to Astro pages

import fs from 'fs';
import path from 'path';

const mdDir = process.argv[2];
const astroDir = process.argv[3];

if (!mdDir || !astroDir) {
  console.log('Usage: node convert-md-to-astro-blog.mjs <md-dir> <astro-output-dir>');
  process.exit(1);
}

const mdFiles = fs.readdirSync(mdDir).filter(f => f.endsWith('.md'));

for (const file of mdFiles) {
  const mdPath = path.join(mdDir, file);
  const content = fs.readFileSync(mdPath, 'utf8');
  
  // Extract frontmatter and content
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    console.log(`⚠️  Skipping ${file}: No frontmatter found`);
    continue;
  }
  
  const frontmatter = frontmatterMatch[1];
  const markdown = frontmatterMatch[2];
  
  // Parse frontmatter
  const titleMatch = frontmatter.match(/title: "(.*)"/);
  const descMatch = frontmatter.match(/description: "(.*)"/);
  const dateMatch = frontmatter.match(/pubDate: (.*)/);
  
  const title = titleMatch ? titleMatch[1] : '';
  const description = descMatch ? descMatch[1] : '';
  const pubDate = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];
  
  // Convert markdown to HTML-like format (simple conversion)
  let html = markdown
    .replace(/^# (.+)$/gm, '<h1 class="text-4xl font-bold mb-6">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-3xl font-bold mt-8 mb-4">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-2xl font-semibold mt-6 mb-3">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p>\n<p class="mb-4">')
    .replace(/^(?!<[h|l|p])/gm, '<p class="mb-4">');
  
  // Wrap lists
  html = html.replace(/(<li>.*?<\/li>)/gs, '<ul class="list-disc pl-6 mb-4 space-y-2">\n$1\n</ul>');
  
  // Create Astro file
  const astroContent = `---
import BaseLayout from '../../layouts/BaseLayout.astro';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: '${title.replace(/'/g, "\\'")}',
  datePublished: '${pubDate}',
  dateModified: '${pubDate}',
  description: '${description.replace(/'/g, "\\'")}',
};
---

<BaseLayout
  title="${title.replace(/"/g, '\\"')}"
  description="${description.replace(/"/g, '\\"')}"
  schema={schema}
>
  <article class="max-w-4xl mx-auto px-4 py-8">
    <div class="prose prose-lg max-w-none">
      ${html}
    </div>
  </article>
</BaseLayout>
`;

  const astroFile = file.replace('.md', '.astro');
  const astroPath = path.join(astroDir, astroFile);
  
  fs.writeFileSync(astroPath, astroContent);
  console.log(`✅ Converted: ${file} → ${astroFile}`);
}

console.log(`\n🎉 Converted ${mdFiles.length} blog posts!`);
