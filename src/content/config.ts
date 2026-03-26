import { defineCollection, z } from 'astro:content';

const listingsCollection = defineCollection({
  type: 'data',
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
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = {
  listings: listingsCollection,
};

