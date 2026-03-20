#!/usr/bin/env python3
"""
Process DOL H1B Disclosure Data (Excel) → Clean JSON for Supabase
"""

import pandas as pd
import json
from datetime import datetime

# Target roles and their variations
ROLE_MAPPING = {
    'Software Engineer': ['SOFTWARE ENGINEER', 'SOFTWARE DEVELOPER', 'ENGINEER SOFTWARE', 'DEVELOPER'],
    'Senior Software Engineer': ['SENIOR SOFTWARE ENGINEER', 'SR SOFTWARE ENGINEER', 'SENIOR ENGINEER', 'SR ENGINEER', 'LEAD ENGINEER'],
    'Staff Software Engineer': ['STAFF SOFTWARE ENGINEER', 'STAFF ENGINEER', 'PRINCIPAL ENGINEER I'],
    'Principal Software Engineer': ['PRINCIPAL SOFTWARE ENGINEER', 'PRINCIPAL ENGINEER', 'DISTINGUISHED ENGINEER'],
    'Engineering Manager': ['ENGINEERING MANAGER', 'SOFTWARE ENGINEERING MANAGER', 'MANAGER SOFTWARE'],
    'Product Manager': ['PRODUCT MANAGER', 'PM '],
    'Senior Product Manager': ['SENIOR PRODUCT MANAGER', 'SR PRODUCT MANAGER', 'LEAD PRODUCT MANAGER'],
    'Data Scientist': ['DATA SCIENTIST', 'ML ENGINEER', 'MACHINE LEARNING ENGINEER'],
}

# Target cities
TARGET_CITIES = {
    'San Francisco': ['SAN FRANCISCO', 'SF'],
    'New York': ['NEW YORK', 'NYC'],
    'Seattle': ['SEATTLE'],
    'Boston': ['BOSTON'],
    'Austin': ['AUSTIN'],
    'Los Angeles': ['LOS ANGELES', 'LA'],
    'Chicago': ['CHICAGO'],
    'Denver': ['DENVER'],
    'San Jose': ['SAN JOSE'],
    'Palo Alto': ['PALO ALTO'],
}

def match_role(job_title):
    """Match job title to canonical role"""
    if not job_title:
        return None
    job_title = str(job_title).upper()
    for canonical, variations in ROLE_MAPPING.items():
        for variant in variations:
            if variant in job_title:
                return canonical
    return None

def match_city(worksite_city):
    """Match worksite city to canonical city"""
    if not worksite_city:
        return None
    worksite_city = str(worksite_city).upper()
    for canonical, variations in TARGET_CITIES.items():
        for variant in variations:
            if variant in worksite_city:
                return canonical
    return None

def process_h1b_data(excel_path):
    """Process H1B Excel file and extract salary data"""
    
    print(f"Loading {excel_path}...")
    
    try:
        # Read Excel (might take a minute for 79MB file)
        df = pd.read_excel(excel_path, engine='openpyxl')
        print(f"Loaded {len(df)} rows")
        
        # Relevant columns (adjust if column names differ)
        # Common DOL columns: JOB_TITLE, WORKSITE_CITY, WORKSITE_STATE, WAGE_RATE_OF_PAY_FROM, WAGE_UNIT_OF_PAY
        
        print("\nColumn names in file:")
        print(df.columns.tolist()[:20])  # Show first 20 columns
        
        # Filter: only full-time annual wages
        if 'WAGE_UNIT_OF_PAY' in df.columns:
            df = df[df['WAGE_UNIT_OF_PAY'].isin(['Year', 'Yearly', 'Annual'])]
        
        # Convert salary to numeric
        salary_col = 'WAGE_RATE_OF_PAY_FROM' if 'WAGE_RATE_OF_PAY_FROM' in df.columns else 'PREVAILING_WAGE'
        df[salary_col] = pd.to_numeric(df[salary_col], errors='coerce')
        
        # Filter outliers
        df = df[(df[salary_col] >= 40000) & (df[salary_col] <= 500000)]
        
        # Add matched role and city columns
        df['matched_role'] = df['JOB_TITLE'].apply(match_role)
        df['matched_city'] = df['WORKSITE_CITY'].apply(match_city) if 'WORKSITE_CITY' in df.columns else df['EMPLOYER_CITY'].apply(match_city)
        
        # Filter to only matched roles and cities
        df = df[df['matched_role'].notna() & df['matched_city'].notna()]
        
        print(f"\nFiltered to {len(df)} relevant rows")
        
        # Group by role and city, calculate percentiles
        results = []
        for role in ROLE_MAPPING.keys():
            for city in TARGET_CITIES.keys():
                subset = df[(df['matched_role'] == role) & (df['matched_city'] == city)]
                
                if len(subset) < 5:  # Need minimum sample size
                    continue
                
                salaries = subset[salary_col].values
                
                result = {
                    'role': role,
                    'city': city,
                    'sample_size': len(salaries),
                    'p10': int(salaries.quantile(0.10)) if len(salaries) > 10 else None,
                    'p25': int(salaries.quantile(0.25)),
                    'p50': int(salaries.quantile(0.50)),
                    'p75': int(salaries.quantile(0.75)),
                    'p90': int(salaries.quantile(0.90)),
                    'mean': int(salaries.mean()),
                    'min': int(salaries.min()),
                    'max': int(salaries.max()),
                    'source': 'DOL H1B FY2024',
                    'processed_at': datetime.now().isoformat()
                }
                
                results.append(result)
                print(f"✓ {role:30s} @ {city:15s}: {len(salaries):4d} samples, P50=${result['p50']:,}")
        
        return results
        
    except Exception as e:
        print(f"Error processing Excel: {e}")
        import traceback
        traceback.print_exc()
        return []

def main():
    excel_path = '/home/bill/.openclaw/workspace/roleoffer-data/raw-data/h1b_fy2024.xlsx'
    output_path = '/home/bill/.openclaw/workspace/roleoffer-data/h1b_real_data.json'
    
    results = process_h1b_data(excel_path)
    
    if results:
        # Save results
        with open(output_path, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\n✅ Processing complete!")
        print(f"   Extracted: {len(results)} role × city combinations")
        print(f"   Saved to: {output_path}")
        
        # Summary statistics
        total_samples = sum(r['sample_size'] for r in results)
        print(f"   Total H1B records: {total_samples:,}")
        print(f"   Coverage: {len(results)} / {len(ROLE_MAPPING) * len(TARGET_CITIES)} possible combinations")
    else:
        print("\n❌ No data extracted. Check column names and filters.")

if __name__ == '__main__':
    main()
