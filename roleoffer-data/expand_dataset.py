#!/usr/bin/env python3
"""
扩展RoleOffer数据集 - 添加更多城市和roles
基于现有16个锚点的multipliers推算
"""

import csv
import json
from pathlib import Path

INPUT_FILE = Path("generated/roleoffer_full_dataset.csv")
OUTPUT_DIR = Path("generated")

# 扩展城市列表（基于主要tech hub和Tier 2/3城市）
EXTENDED_LOCATIONS = [
    # Tier 1 (1.00x - existing)
    ("san_francisco", "San Francisco, CA", 1.00),
    ("new_york", "New York, NY", 1.00),
    
    # Tier 1.5 (0.95-0.98x)
    ("seattle", "Seattle, WA", 0.95),
    ("boston", "Boston, MA", 0.98),
    ("los_angeles", "Los Angeles, CA", 0.96),
    
    # Tier 2 (0.87-0.92x)
    ("austin", "Austin, TX", 0.87),
    ("chicago", "Chicago, IL", 0.92),
    ("denver", "Denver, CO", 0.90),
    ("san_diego", "San Diego, CA", 0.94),
    ("washington_dc", "Washington, DC", 0.97),
    
    # Tier 3 (0.80-0.85x)
    ("portland", "Portland, OR", 0.88),
    ("atlanta", "Atlanta, GA", 0.85),
    ("miami", "Miami, FL", 0.84),
    ("dallas", "Dallas, TX", 0.85),
    ("phoenix", "Phoenix, AZ", 0.82),
    ("philadelphia", "Philadelphia, PA", 0.89),
    ("minneapolis", "Minneapolis, MN", 0.88),
    ("boulder", "Boulder, CO", 0.89),
    ("raleigh", "Raleigh, NC", 0.83),
    ("nashville", "Nashville, TN", 0.81),
]

# 扩展roles（基于常见startup职能）
EXTENDED_ROLES = [
    # Core - existing
    ("engineering", "Engineering", 1.00),
    ("product", "Product", 1.03),
    
    # Design & UX
    ("design", "Design", 0.71),
    ("ux_research", "UX Research", 0.73),
    
    # GTM
    ("sales", "Sales", 0.71),
    ("marketing", "Marketing", 0.68),
    ("customer_success", "Customer Success", 0.65),
    ("sales_engineering", "Sales Engineering", 0.88),
    
    # Ops & Support
    ("operations", "Operations", 0.75),
    ("finance", "Finance", 0.82),
    ("hr", "People & HR", 0.70),
    ("legal", "Legal", 0.85),
    
    # Data & Analytics
    ("data_science", "Data Science", 0.95),
    ("analytics", "Analytics", 0.78),
    
    # Other Technical
    ("security", "Security", 0.98),
    ("devops", "DevOps", 0.92),
]


def expand_dataset():
    """扩展数据集到更多城市和roles"""
    
    # 读取现有数据
    print("📂 读取基础数据集...")
    base_data = []
    with open(INPUT_FILE, 'r') as f:
        reader = csv.DictReader(f)
        base_data = list(reader)
    
    print(f"   基础数据: {len(base_data)} 条记录")
    
    # 创建SF Engineering baseline索引（用于推算新组合）
    baseline_index = {}
    for record in base_data:
        if record['location'] == 'san_francisco' and record['role'] == 'engineering':
            key = (record['stage'], record['level'], record['percentile'])
            baseline_index[key] = int(record['salary'])
    
    print(f"   Baseline索引: {len(baseline_index)} 个参考点")
    
    # 生成扩展数据
    expanded_data = list(base_data)  # 保留原有数据
    
    print("\n🎯 生成扩展数据...")
    
    # 对每个新location
    existing_locations = set(r['location'] for r in base_data)
    new_locations = [loc for loc in EXTENDED_LOCATIONS if loc[0] not in existing_locations]
    
    print(f"   新增城市: {len(new_locations)}")
    
    for loc_key, loc_label, loc_mult in new_locations:
        for record in base_data:
            # 只扩展Engineering role（其他roles会后面统一扩展）
            if record['role'] == 'engineering' and record['location'] == 'san_francisco':
                new_record = record.copy()
                new_record['location'] = loc_key
                new_record['location_label'] = loc_label
                new_record['salary'] = str(int(int(record['salary']) * loc_mult))
                new_record['total_cash'] = str(int(int(record['total_cash']) * loc_mult)) if record['total_cash'] else '0'
                expanded_data.append(new_record)
    
    # 对每个新role
    existing_roles = set(r['role'] for r in base_data)
    new_roles = [role for role in EXTENDED_ROLES if role[0] not in existing_roles]
    
    print(f"   新增roles: {len(new_roles)}")
    
    all_locations = [(r['location'], r['location_label']) for r in expanded_data]
    all_locations = list(set(all_locations))
    
    for role_key, role_label, role_mult in new_roles:
        # 为每个location和stage生成这个role的数据
        for record in expanded_data:
            if record['role'] == 'engineering':
                new_record = record.copy()
                new_record['role'] = role_key
                new_record['role_label'] = role_label
                new_record['salary'] = str(int(int(record['salary']) * role_mult))
                new_record['total_cash'] = str(int(int(record['total_cash']) * role_mult)) if record['total_cash'] else '0'
                expanded_data.append(new_record)
    
    print(f"\n✅ 扩展完成！")
    print(f"   原始数据: {len(base_data)} 条")
    print(f"   扩展后: {len(expanded_data)} 条")
    
    # 导出扩展数据
    output_path = OUTPUT_DIR / "roleoffer_extended_dataset.csv"
    
    fieldnames = [
        "stage", "stage_label", "location", "location_label",
        "role", "role_label", "level", "level_label", "level_name",
        "percentile", "salary", "total_cash", "equity_pct"
    ]
    
    with open(output_path, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(expanded_data)
    
    print(f"✅ 导出扩展数据: {output_path}")
    
    # 统计
    stages = set(r['stage'] for r in expanded_data)
    locations = set(r['location'] for r in expanded_data)
    roles = set(r['role'] for r in expanded_data)
    levels = set(r['level'] for r in expanded_data)
    
    print("\n📊 扩展数据集摘要:")
    print(f"   Funding Stages: {len(stages)}")
    print(f"   Locations: {len(locations)}")
    print(f"   Roles: {len(roles)}")
    print(f"   Levels: {len(levels)}")
    print(f"   Total Unique Pages: {len(stages) * len(locations) * len(roles) * len(levels):,}")
    print(f"   Total Records: {len(expanded_data):,}")
    
    return expanded_data


if __name__ == "__main__":
    print("🚀 RoleOffer数据集扩展器")
    print("=" * 70)
    expand_dataset()
    print("\n✅ 完成！")
