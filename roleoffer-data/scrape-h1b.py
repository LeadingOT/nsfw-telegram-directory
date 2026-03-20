#!/usr/bin/env python3
"""
Scrape H1B salary data from h1bdata.info
Target: Top 50 tech roles × top 20 cities = 1000 data points for MVP
"""
import requests
import json
import time
from datetime import datetime

# Top tech roles to scrape
ROLES = [
    "Software Engineer",
    "Senior Software Engineer", 
    "Staff Software Engineer",
    "Principal Software Engineer",
    "Engineering Manager",
    "Senior Engineering Manager",
    "Product Manager",
    "Senior Product Manager",
    "Data Scientist",
    "Senior Data Scientist",
    "DevOps Engineer",
    "Frontend Engineer",
    "Backend Engineer",
    "Full Stack Engineer",
    "Mobile Engineer",
    "Machine Learning Engineer",
    "Data Engineer",
    "Security Engineer",
    "Solutions Architect",
    "Technical Program Manager",
]

# Top startup cities
CITIES = [
    "San Francisco",
    "New York",
    "Seattle",
    "Austin",
    "Boston",
    "Los Angeles",
    "Chicago",
    "Denver",
    "Portland",
    "San Diego",
]

def scrape_h1b_public():
    """
    Scrape public H1B data
    Note: h1bdata.info might require different approach, this is placeholder
    """
    data = []
    
    # Mock data for now (will replace with real scraping)
    # In production, would use Selenium or API if available
    print("⚠️  Using mock H1B data for MVP")
    print("TODO: Implement real scraping from h1bdata.info or similar source")
    
    # Generate mock benchmark data
    base_salaries = {
        "Software Engineer": {"p25": 110000, "p50": 135000, "p75": 165000},
        "Senior Software Engineer": {"p25": 145000, "p50": 175000, "p75": 210000},
        "Staff Software Engineer": {"p25": 180000, "p50": 215000, "p75": 260000},
        "Product Manager": {"p25": 120000, "p50": 150000, "p75": 185000},
        "Senior Product Manager": {"p25": 155000, "p50": 190000, "p75": 230000},
        "Data Scientist": {"p25": 115000, "p50": 140000, "p75": 170000},
    }
    
    city_multipliers = {
        "San Francisco": 1.25,
        "New York": 1.20,
        "Seattle": 1.15,
        "Austin": 0.95,
        "Boston": 1.10,
    }
    
    for role in ROLES[:6]:  # MVP: just 6 roles
        for city in CITIES[:5]:  # MVP: just 5 cities
            if role in base_salaries:
                base = base_salaries[role]
                mult = city_multipliers.get(city, 1.0)
                
                data.append({
                    "role": role,
                    "location": city,
                    "p25": int(base["p25"] * mult),
                    "p50": int(base["p50"] * mult),
                    "p75": int(base["p75"] * mult),
                    "source": "mock_h1b_data",
                    "updated_at": datetime.now().isoformat()
                })
    
    return data

if __name__ == "__main__":
    print("🔄 Scraping H1B salary data...")
    data = scrape_h1b_public()
    
    output_file = "/home/bill/.openclaw/workspace/roleoffer-data/h1b_salaries.json"
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"✅ Scraped {len(data)} salary data points")
    print(f"📁 Saved to: {output_file}")
