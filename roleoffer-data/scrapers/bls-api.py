#!/usr/bin/env python3
"""
BLS (Bureau of Labor Statistics) API Integration
Source: https://www.bls.gov/developers/ (官方免费API)
"""

import requests
import json
from datetime import datetime

# BLS occupation codes (SOC codes)
OCCUPATION_CODES = {
    'Software Engineer': '15-1252',  # Software Developers
    'Senior Software Engineer': '15-1252',
    'Staff Software Engineer': '15-1252',
    'Principal Software Engineer': '15-1252',
    'Engineering Manager': '11-9041',  # Engineering Managers
    'Senior Engineering Manager': '11-9041',
    'Product Manager': '11-2021',  # Marketing Managers (closest match)
    'Senior Product Manager': '11-2021',
    'Data Scientist': '15-2051',  # Data Scientists
    'Senior Data Scientist': '15-2051'
}

# Metro area codes
METRO_AREAS = {
    'San Francisco': '41860',  # SF-Oakland-Hayward, CA
    'New York': '35620',  # NYC-Newark-Jersey City
    'Seattle': '42660',  # Seattle-Tacoma-Bellevue, WA
    'Boston': '14460',  # Boston-Cambridge-Newton
    'Austin': '12420',  # Austin-Round Rock, TX
    'Los Angeles': '31080',  # LA-Long Beach-Anaheim
    'Chicago': '16980',  # Chicago-Naperville-Elgin
    'Denver': '19740',  # Denver-Aurora-Lakewood
    'San Jose': '41940',  # San Jose-Sunnyvale-Santa Clara
}

def fetch_bls_salary(occupation_code, metro_area_code, metro_name):
    """Fetch salary data from BLS API"""
    
    # BLS OEWS API endpoint (no registration needed for public data)
    # Using latest year available (2023 data)
    url = f"https://api.bls.gov/publicAPI/v2/timeseries/data/OEUM{metro_area_code}000000{occupation_code}03"
    
    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        data = response.json()
        
        if data['status'] != 'REQUEST_SUCCEEDED':
            return None
        
        # Extract latest year data
        series = data['Results']['series'][0]
        if not series['data']:
            return None
        
        latest = series['data'][0]  # Most recent period
        
        # BLS provides annual mean wage
        annual_mean = float(latest['value']) if latest['value'] != '-' else None
        
        if not annual_mean or annual_mean < 30000:
            return None
        
        # Estimate percentiles from mean (rough approximation)
        # Typical tech salary distribution: P50 ≈ mean, P25 ≈ 0.75×mean, P75 ≈ 1.25×mean
        result = {
            'metro_area': metro_name,
            'metro_code': metro_area_code,
            'occupation_code': occupation_code,
            'annual_mean': int(annual_mean),
            'p25_est': int(annual_mean * 0.75),
            'p50_est': int(annual_mean),
            'p75_est': int(annual_mean * 1.25),
            'p90_est': int(annual_mean * 1.50),
            'year': latest['year'],
            'period': latest['period'],
            'source': 'BLS OEWS API',
            'scraped_at': datetime.now().isoformat()
        }
        
        print(f"✓ {metro_name} ({occupation_code}): Mean ${annual_mean:,.0f}")
        return result
        
    except Exception as e:
        print(f"✗ Error: {metro_name} - {e}")
        return None

def main():
    all_data = []
    
    print("Fetching BLS salary data...\n")
    
    # Fetch data for each metro area and occupation
    for metro_name, metro_code in METRO_AREAS.items():
        for role, occ_code in OCCUPATION_CODES.items():
            print(f"Fetching {role} @ {metro_name}...", end=' ')
            
            result = fetch_bls_salary(occ_code, metro_code, metro_name)
            if result:
                result['role'] = role
                all_data.append(result)
    
    # Save results
    output_file = '/home/bill/.openclaw/workspace/roleoffer-data/bls_salary_data.json'
    with open(output_file, 'w') as f:
        json.dump(all_data, f, indent=2)
    
    print(f"\n✅ BLS data fetch complete!")
    print(f"   Collected: {len(all_data)} data points")
    print(f"   Saved to: {output_file}")

if __name__ == '__main__':
    main()
