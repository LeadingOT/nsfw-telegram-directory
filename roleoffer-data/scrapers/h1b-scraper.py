#!/usr/bin/env python3
"""
H1B Salary Data Scraper
Source: https://h1bdata.info (公开政府数据)
"""

import requests
import json
import time
from datetime import datetime

# Target roles
ROLES = [
    'Software Engineer',
    'Senior Software Engineer', 
    'Staff Software Engineer',
    'Principal Software Engineer',
    'Engineering Manager',
    'Senior Engineering Manager',
    'Product Manager',
    'Senior Product Manager',
    'Data Scientist',
    'Senior Data Scientist'
]

# Target cities
CITIES = [
    'San Francisco',
    'New York',
    'Seattle',
    'Boston',
    'Austin',
    'Los Angeles',
    'Chicago',
    'Denver',
    'San Jose',
    'Palo Alto'
]

def scrape_h1b_data(role, city, year=2024):
    """Scrape H1B salary data for a specific role and city"""
    
    # h1bdata.info API endpoint
    base_url = "https://h1bdata.info/api/search"
    
    params = {
        'year': year,
        'job_title': role,
        'city': city,
        'employer': '',  # All employers
        'page': 1
    }
    
    try:
        response = requests.get(base_url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if not data or 'data' not in data:
            return None
        
        salaries = []
        for record in data['data']:
            try:
                salary = int(record.get('base_salary', 0))
                if salary > 30000 and salary < 500000:  # Filter outliers
                    salaries.append(salary)
            except (ValueError, TypeError):
                continue
        
        if len(salaries) < 5:  # Need minimum sample size
            return None
        
        # Calculate percentiles
        salaries.sort()
        n = len(salaries)
        
        result = {
            'role': role,
            'city': city,
            'year': year,
            'sample_size': n,
            'p25': salaries[int(n * 0.25)],
            'p50': salaries[int(n * 0.50)],
            'p75': salaries[int(n * 0.75)],
            'p90': salaries[int(n * 0.90)],
            'min': salaries[0],
            'max': salaries[-1],
            'source': 'h1bdata.info',
            'scraped_at': datetime.now().isoformat()
        }
        
        print(f"✓ {role} @ {city}: {n} samples, P50=${result['p50']:,}")
        return result
        
    except requests.exceptions.RequestException as e:
        print(f"✗ Error scraping {role} @ {city}: {e}")
        return None
    except Exception as e:
        print(f"✗ Unexpected error for {role} @ {city}: {e}")
        return None

def main():
    all_data = []
    total = len(ROLES) * len(CITIES)
    count = 0
    
    print(f"Starting H1B scraper for {len(ROLES)} roles × {len(CITIES)} cities = {total} combinations\n")
    
    for role in ROLES:
        for city in CITIES:
            count += 1
            print(f"[{count}/{total}] Scraping {role} @ {city}...", end=' ')
            
            result = scrape_h1b_data(role, city)
            if result:
                all_data.append(result)
            else:
                print(f"✗ No data")
            
            # Rate limiting: be nice to the server
            time.sleep(1)
    
    # Save results
    output_file = '/home/bill/.openclaw/workspace/roleoffer-data/h1b_scraped_data.json'
    with open(output_file, 'w') as f:
        json.dump(all_data, f, indent=2)
    
    print(f"\n✅ Scraping complete!")
    print(f"   Collected: {len(all_data)} valid data points")
    print(f"   Saved to: {output_file}")
    print(f"   Coverage: {len(all_data)}/{total} ({len(all_data)*100//total}%)")

if __name__ == '__main__':
    main()
