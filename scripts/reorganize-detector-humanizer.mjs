#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const workspace = process.env.HOME + '/.openclaw/workspace';

// Update all existing detector listings to "Text Detection"
function updateDetectorCategories() {
  const dir = path.join(workspace, 'bestaidetector-directory/src/content/listings');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    content.category = 'Text Detection';
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
  });
  
  console.log(`✅ Updated ${files.length} detector tools → "Text Detection"`);
}

// Update all existing humanizer listings to "Text Humanizer"
function updateHumanizerCategories() {
  const dir = path.join(workspace, 'aihumanizer-directory/src/content/listings');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    content.category = 'Text Humanizer';
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
  });
  
  console.log(`✅ Updated ${files.length} humanizer tools → "Text Humanizer"`);
}

// Add image detection tools
function addImageDetectors() {
  const dir = path.join(workspace, 'bestaidetector-directory/src/content/listings');
  
  const imageTools = [
    {
      name: "Hive Moderation",
      slug: "hive-moderation-image",
      tagline: "AI-powered image content moderation",
      category: "Image Detection",
      description: "Enterprise-grade AI image detection for synthetic media, deepfakes, and AI-generated images. Used by major platforms.",
      url: "https://hivemoderation.com",
      pricing: { model: "enterprise" },
      features: ["Deepfake detection", "AI-generated image detection", "Real-time API", "99.9% uptime SLA"],
      rating: 4.7,
      tags: ["Enterprise", "API", "Real-time"],
      lastUpdated: "2026-03-10"
    },
    {
      name: "Illuminarty",
      slug: "illuminarty",
      tagline: "Detect AI-generated images instantly",
      category: "Image Detection",
      description: "Free AI image detector that identifies AI-generated images from Midjourney, DALL-E, Stable Diffusion with visual heatmaps.",
      url: "https://illuminarty.ai",
      pricing: { model: "freemium", startingPrice: "$9/mo" },
      features: ["Visual heatmaps", "Multi-model detection", "Browser extension", "Batch upload"],
      rating: 4.3,
      tags: ["Free", "Visual", "Browser Extension"],
      lastUpdated: "2026-03-10"
    },
    {
      name: "Optic AI",
      slug: "optic-ai",
      tagline: "AI image authenticity verification",
      category: "Image Detection",
      description: "Verify image authenticity with AI detection for photoshop edits, deepfakes, and AI-generated content. Trusted by newsrooms.",
      url: "https://optic.xyz",
      pricing: { model: "paid", startingPrice: "$29/mo" },
      features: ["Edit detection", "Source tracking", "Metadata analysis", "Forensic tools"],
      rating: 4.5,
      tags: ["Professional", "Forensics", "Newsroom"],
      lastUpdated: "2026-03-10"
    }
  ];
  
  imageTools.forEach(tool => {
    const filePath = path.join(dir, `${tool.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(tool, null, 2) + '\n');
  });
  
  console.log(`✅ Added ${imageTools.length} image detection tools`);
}

// Add image bypass tools (including bypassimage.ai)
function addImageBypassTools() {
  const dir = path.join(workspace, 'aihumanizer-directory/src/content/listings');
  
  const bypassTools = [
    {
      name: "BypassImage.ai",
      slug: "bypassimage-ai",
      tagline: "Make AI images undetectable",
      category: "Image Bypass",
      description: "Transform AI-generated images to bypass detection tools. Uses advanced post-processing to make Midjourney, DALL-E, Stable Diffusion images appear authentic.",
      url: "https://bypassimage.com",
      pricing: { model: "freemium", startingPrice: "$19/mo" },
      features: ["Multi-model support", "Batch processing", "Quality preservation", "Fast API"],
      rating: 4.8,
      tags: ["Featured", "Fast", "High Quality"],
      lastUpdated: "2026-03-10"
    },
    {
      name: "AI Image Enhancer",
      slug: "ai-image-enhancer",
      tagline: "Enhance and humanize AI images",
      category: "Image Bypass",
      description: "Add natural imperfections and textures to AI-generated images to bypass detectors while maintaining quality.",
      url: "https://aiimageenhancer.io",
      pricing: { model: "paid", startingPrice: "$15/mo" },
      features: ["Texture overlay", "Natural grain", "Color grading", "Metadata editing"],
      rating: 4.2,
      tags: ["Enhancement", "Textures", "Professional"],
      lastUpdated: "2026-03-10"
    },
    {
      name: "RealPic AI",
      slug: "realpic-ai",
      tagline: "Make AI photos look real",
      category: "Image Bypass",
      description: "Post-process AI-generated portraits to add realistic skin textures, lighting variations, and camera artifacts.",
      url: "https://realpic.ai",
      pricing: { model: "freemium", startingPrice: "$12/mo" },
      features: ["Portrait specialization", "Skin texture", "Camera effects", "One-click processing"],
      rating: 4.4,
      tags: ["Portraits", "Free Tier", "Easy"],
      lastUpdated: "2026-03-10"
    }
  ];
  
  bypassTools.forEach(tool => {
    const filePath = path.join(dir, `${tool.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(tool, null, 2) + '\n');
  });
  
  console.log(`✅ Added ${bypassTools.length} image bypass tools (including BypassImage.ai)`);
}

async function main() {
  console.log('🔧 Reorganizing detector & humanizer sites by media type...\n');
  
  updateDetectorCategories();
  updateHumanizerCategories();
  addImageDetectors();
  addImageBypassTools();
  
  console.log('\n✅ Reorganization complete!');
  console.log('\n📊 New structure:');
  console.log('  bestaidetector.tools: 15 Text + 3 Image = 18 tools');
  console.log('  aihumanizer.tools: 15 Text + 3 Image = 18 tools');
  console.log('\n🚀 Next: Update navigation links in BaseLayout.astro');
}

main().catch(console.error);
