#!/bin/bash
# Create src/content/config.ts for all directory sites using content collections

SITES=(
  "accountingai-directory"
  "aigirlfriend-directory"
  "hrai-directory"
  "legalai-directory"
  "realestate-ai-directory"
  "bestnootropics-directory"
  "bestonlyfans-directory"
  "bestanime-directory"
  "mattressrank-directory"
  "bestofpodcasts-directory"
  "nsfw-telegram-directory"
)

CONFIG_CONTENT='import { defineCollection, z } from '\''astro:content'\'';

const listingsCollection = defineCollection({
  type: '\''data'\'',
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    tagline: z.string().optional(),
    description: z.string(),
    category: z.string(),
    url: z.string(),
    pricing: z.object({
      model: z.string(),
      startingPrice: z.string().optional(),
    }).optional(),
    features: z.array(z.string()).optional(),
    pros: z.array(z.string()).optional(),
    cons: z.array(z.string()).optional(),
    rating: z.number().optional(),
    lastUpdated: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  listings: listingsCollection,
};
'

for site in "${SITES[@]}"; do
  CONFIG_FILE="/home/bill/.openclaw/workspace/$site/src/content/config.ts"
  
  if [ -f "$CONFIG_FILE" ]; then
    echo "✅ $site already has config.ts"
    continue
  fi
  
  echo "$CONFIG_CONTENT" > "$CONFIG_FILE"
  echo "✅ Created $site/src/content/config.ts"
done

echo ""
echo "🎉 All content configs created!"
