#!/usr/bin/env python3
"""
Generate pSEO pages for RoleOffer.com
URL pattern: /compensation/{role}-{level}-{stage}-{location}
Example: /compensation/senior-software-engineer-series-a-san-francisco
"""

import json
import os
from pathlib import Path

# Supabase credentials
SUPABASE_URL = "https://nzlzknqmdvclgqdernkw.supabase.co"
SUPABASE_KEY = "sb_publishable_rQ9aSxjLGP7NHPsgAbguVA_FLg-RgwX"

def slugify(text):
    """Convert text to URL-friendly slug"""
    return text.lower().replace(' ', '-').replace(',', '').replace('.', '')

def generate_page_content(role, level, stage, location, benchmark_data=None):
    """Generate SEO-optimized page content"""
    
    # Page title and meta
    title = f"{role} Compensation at {stage} Startups in {location} (2026)"
    slug = f"/compensation/{slugify(role)}-{slugify(level)}-{slugify(stage)}-{slugify(location)}"
    
    # If we have real benchmark data, use it; otherwise use placeholders
    if benchmark_data:
        p50_salary = f"${benchmark_data['base_salary_p50']:,}"
        p25_salary = f"${benchmark_data['base_salary_p25']:,}"
        p75_salary = f"${benchmark_data['base_salary_p75']:,}"
        equity_p50 = f"{benchmark_data['equity_pct_p50']:.2%}"
    else:
        p50_salary = "$XXX,XXX"
        p25_salary = "$XXX,XXX"
        p75_salary = "$XXX,XXX"
        equity_p50 = "X.XX%"
    
    # Generate markdown content
    content = f"""---
title: "{title}"
description: "Comprehensive compensation data for {role} ({level}) at {stage} companies in {location}. Real salary ranges, equity, and total comp benchmarks."
slug: "{slug}"
role: "{role}"
level: "{level}"
stage: "{stage}"
location: "{location}"
---

# {title}

## Compensation Overview

**Role:** {role} ({level})  
**Company Stage:** {stage}  
**Location:** {location}

### Salary Range

- **25th percentile:** {p25_salary}
- **Median (50th):** {p50_salary}
- **75th percentile:** {p75_salary}

### Equity

- **Typical equity:** {equity_p50}
- **Vesting:** 4 years with 1-year cliff (industry standard)

## Why This Data Matters

Making competitive offers is critical for {stage} startups. Our data comes from real job postings and H1B disclosures, ensuring you're offering market-rate compensation.

### Key Insights for {role} in {location}

1. **Market dynamics:** {location} has {f"high demand" if location in ["San Francisco", "New York"] else "growing demand"} for {role.lower()}s
2. **Stage considerations:** {stage} companies typically offer {"higher equity, lower cash" if stage in ["Pre-Seed", "Seed"] else "more balanced comp"}
3. **Level expectations:** {level} candidates expect {"foundational" if "IC1" in level or "IC2" in level else "experienced" if "IC3" in level or "IC4" in level else "senior leadership"} responsibilities

## Generate Your Offer Package

Get a complete compensation package including:

- Detailed benchmark report (P25/P50/P75/P90)
- Customized offer letter
- Equity scenarios (1yr/2yr/4yr projections)
- Negotiation talk points

[Generate Offer Package →](/benchmark)

## Related Compensation Data

- [All {role} roles](/compensation?role={slugify(role)})
- [All {stage} companies](/compensation?stage={slugify(stage)})
- [All {location} jobs](/compensation?location={slugify(location)})

## FAQ

### How accurate is this data?

Our benchmarks are based on:
- H1B salary disclosures (government data)
- Job posting salary ranges (CA/CO/NY/WA transparency laws)
- Industry reports (Carta, OpenComp, Pave)

### How often is data updated?

We refresh our benchmarks monthly to reflect market changes.

### What's included in "total compensation"?

Base salary + annual bonus + equity value (at current valuation).

---

*Last updated: 2026*  
*Data sources: H1B disclosures, job postings, industry benchmarks*
"""
    
    return {
        'slug': slug,
        'title': title,
        'content': content,
        'role': role,
        'level': level,
        'stage': stage,
        'location': location
    }

def main():
    """Generate initial batch of pSEO pages"""
    
    # For MVP, generate top 100 high-traffic combinations
    # Later will expand to full 20,000
    
    TOP_ROLES = [
        'Software Engineer',
        'Senior Software Engineer',
        'Product Manager',
        'Engineering Manager',
        'Data Scientist'
    ]
    
    TOP_LEVELS = ['IC3', 'IC4', 'M1']  # Mid, Senior, Manager
    
    TOP_STAGES = ['Seed', 'Series A', 'Series B']
    
    TOP_LOCATIONS = [
        'San Francisco',
        'New York',
        'Seattle',
        'Boston',
        'Austin'
    ]
    
    pages = []
    
    print(f"Generating pSEO pages...")
    print(f"  Roles: {len(TOP_ROLES)}")
    print(f"  Levels: {len(TOP_LEVELS)}")
    print(f"  Stages: {len(TOP_STAGES)}")
    print(f"  Locations: {len(TOP_LOCATIONS)}")
    print(f"  Total: {len(TOP_ROLES) * len(TOP_LEVELS) * len(TOP_STAGES) * len(TOP_LOCATIONS)} pages\n")
    
    for role in TOP_ROLES:
        for level in TOP_LEVELS:
            for stage in TOP_STAGES:
                for location in TOP_LOCATIONS:
                    page = generate_page_content(role, level, stage, location)
                    pages.append(page)
    
    # Save pages list
    output_file = '~/.openclaw/workspace/roleoffer-data/pseo/pages-manifest.json'
    output_path = os.path.expanduser(output_file)
    
    with open(output_path, 'w') as f:
        json.dump(pages, f, indent=2)
    
    print(f"✅ Generated {len(pages)} pages")
    print(f"   Manifest: {output_path}")
    print(f"\n📋 Sample URLs:")
    for page in pages[:5]:
        print(f"   {page['slug']}")
    
    print(f"\n🎯 Next steps:")
    print(f"   1. Copy pages to Next.js app/compensation/")
    print(f"   2. Deploy to Vercel")
    print(f"   3. Submit sitemap to GSC")

if __name__ == '__main__':
    main()
