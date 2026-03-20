#!/usr/bin/env python3
"""
RoleOffer Complete Compensation Dataset Generator
从16个Carta锚点推算完整的20,000+行数据集
"""

import csv
import json
from pathlib import Path
from typing import Dict, List, Tuple

# 数据目录
CARTA_DIR = Path("carta-samples")
OUTPUT_DIR = Path("generated")
OUTPUT_DIR.mkdir(exist_ok=True)

# 定义维度
FUNDING_STAGES = [
    ("seed", "$1M-$10M", "eng-sf-1m-10m.csv"),
    ("series_a", "$10M-$25M", "eng-sf-10m-25m.csv"),
    ("series_a_late", "$25M-$50M", "eng-sf-25m-50m.csv"),
    ("series_b", "$50M-$100M", "eng-sf-50m-100m.csv"),
    ("series_c", "$100M-$200M", "eng-sf-100m-200m.csv"),
    ("late_stage", "$200M+", "eng-sf-200m-plus.csv"),
]

LOCATIONS = [
    ("san_francisco", "San Francisco, CA", 1.00, "eng-sf-25m-50m.csv"),
    ("new_york", "New York, NY", 1.00, "eng-nyc-25m-50m.csv"),
    ("seattle", "Seattle, WA", 0.95, "eng-seattle-25m-50m.csv"),
    ("austin", "Austin, TX", 0.87, "eng-austin-25m-50m.csv"),
    ("boston", "Boston, MA", 0.98, None),  # 推算
    ("los_angeles", "Los Angeles, CA", 0.96, None),  # 推算
    ("denver", "Denver, CO", 0.90, None),  # 推算
    ("chicago", "Chicago, IL", 0.92, None),  # 推算
]

ROLES = [
    ("engineering", "Engineering", 1.00, "eng-sf-25m-50m.csv"),
    ("product", "Product", 1.03, "product-sf-25m-50m.csv"),
    ("design", "Design", 0.71, "design-sf-25m-50m.csv"),
    ("sales", "Sales", 0.71, "sales-sf-25m-50m.csv"),
    ("marketing", "Marketing", 0.68, "marketing-sf-25m-50m.csv"),
]

LEVELS = [
    ("ic1", "Entry", "IC 1"),
    ("ic2", "Mid 1 (Developing)", "IC 2"),
    ("ic3", "Mid 2 (Proficient)", "IC 3"),
    ("ic4", "Senior 1 (Skilled)", "IC 4"),
    ("ic5", "Senior 2 (Advanced)", "IC 5"),
    ("ic6", "Staff (Expert)", "IC 6"),
    ("ic7", "Senior Staff (Advisor)", "IC 7"),
    ("ic8", "Principal (Strategist)", "IC 8"),
    ("ic9", "Distinguished (Thought Leader)", "IC 9"),
]

PERCENTILES = ["p25", "p50", "p75", "p90"]


def parse_carta_csv(filepath: Path) -> Dict:
    """解析Carta CSV文件，返回结构化数据"""
    data = {}
    
    with open(filepath, 'r') as f:
        reader = csv.reader(f)
        rows = list(reader)
        
        # CSV structure:
        # Row 0-8: Headers/metadata
        # Row 9: Column headers (Level, Role, Salary, ...)
        # Row 10: Percentile labels (25th Percentile, 50th Percentile, ...)
        # Row 11+: IC1-IC9 data
        
        for i, level_info in enumerate(LEVELS):
            level_key, level_name, level_label = level_info
            row_idx = 11 + i  # IC1在第12行(index 11)
            
            if row_idx >= len(rows):
                continue
                
            row = rows[row_idx]
            
            # Salary: cols 2-5 (P25/P50/P75/P90)
            # Total Cash: cols 6-9
            # Equity %: cols 10-13
            
            data[level_key] = {
                "level": level_key,
                "label": level_label,
                "name": level_name,
                "salary": {
                    "p25": parse_dollar(row[2]),
                    "p50": parse_dollar(row[3]),
                    "p75": parse_dollar(row[4]),
                    "p90": parse_dollar(row[5]),
                },
                "total_cash": {
                    "p25": parse_dollar(row[6]),
                    "p50": parse_dollar(row[7]),
                    "p75": parse_dollar(row[8]),
                    "p90": parse_dollar(row[9]),
                },
                "equity_pct": {
                    "p25": parse_percent(row[10]),
                    "p50": parse_percent(row[11]),
                    "p75": parse_percent(row[12]),
                    "p90": parse_percent(row[13]),
                },
            }
    
    return data


def parse_dollar(value: str) -> int:
    """解析$123,456格式"""
    if not value or value == "":
        return 0
    return int(value.replace('$', '').replace(',', ''))


def parse_percent(value: str) -> float:
    """解析0.1234%格式"""
    if not value or value == "":
        return 0.0
    return float(value.replace('%', ''))


def load_all_anchors() -> Dict:
    """加载所有16个锚点文件"""
    anchors = {
        "funding_stages": {},
        "locations": {},
        "roles": {},
    }
    
    # 1. Funding stages (Engineering @ SF)
    for stage_key, stage_label, filename in FUNDING_STAGES:
        filepath = CARTA_DIR / filename
        if filepath.exists():
            anchors["funding_stages"][stage_key] = {
                "label": stage_label,
                "data": parse_carta_csv(filepath)
            }
            print(f"✅ Loaded {stage_key}: {filename}")
    
    # 2. Locations (all at $25M-$50M)
    for loc_key, loc_label, multiplier, filename in LOCATIONS:
        if filename:
            filepath = CARTA_DIR / filename
            if filepath.exists():
                anchors["locations"][loc_key] = {
                    "label": loc_label,
                    "multiplier": multiplier,
                    "data": parse_carta_csv(filepath)
                }
                print(f"✅ Loaded {loc_key}: {filename}")
    
    # 3. Roles (all at SF @ $25M-$50M)
    for role_key, role_label, multiplier, filename in ROLES:
        filepath = CARTA_DIR / filename
        if filepath.exists():
            anchors["roles"][role_key] = {
                "label": role_label,
                "multiplier": multiplier,
                "data": parse_carta_csv(filepath)
            }
            print(f"✅ Loaded {role_key}: {filename}")
    
    return anchors


def extrapolate_compensation(
    base_stage: str,
    base_location: str,
    base_role: str,
    target_stage: str,
    target_location: str,
    target_role: str,
    anchors: Dict
) -> Dict:
    """
    从baseline推算目标组合的compensation
    
    策略：
    1. 从funding stage锚点获取stage multiplier
    2. 从location锚点获取location multiplier
    3. 从role锚点获取role multiplier
    4. 组合3个multipliers得到最终值
    """
    
    # Base: Engineering @ SF @ $25M-$50M (series_a_late)
    base_data = anchors["funding_stages"]["series_a_late"]["data"]
    
    # Stage multiplier
    target_stage_data = anchors["funding_stages"].get(target_stage, {}).get("data", {})
    
    # Location multiplier
    loc_info = next((l for l in LOCATIONS if l[0] == target_location), None)
    location_multiplier = loc_info[2] if loc_info else 1.0
    
    # Role multiplier
    role_info = next((r for r in ROLES if r[0] == target_role), None)
    role_multiplier = role_info[2] if role_info else 1.0
    
    result = {}
    
    for level_key in base_data.keys():
        base_level = base_data[level_key]
        target_level = target_stage_data.get(level_key, base_level)
        
        # 计算stage multiplier (用P50作为参考)
        base_p50 = base_level["salary"]["p50"]
        target_p50 = target_level["salary"]["p50"]
        stage_multiplier = target_p50 / base_p50 if base_p50 > 0 else 1.0
        
        # 组合所有multipliers
        combined_multiplier = stage_multiplier * location_multiplier * role_multiplier
        
        result[level_key] = {
            "level": level_key,
            "label": base_level["label"],
            "name": base_level["name"],
            "salary": {},
            "total_cash": {},
            "equity_pct": {},
        }
        
        for pct in PERCENTILES:
            # Apply multiplier to salary
            result[level_key]["salary"][pct] = int(
                base_level["salary"][pct] * combined_multiplier
            )
            
            # Total cash uses same multiplier
            result[level_key]["total_cash"][pct] = int(
                base_level["total_cash"][pct] * combined_multiplier
            ) if base_level["total_cash"][pct] > 0 else 0
            
            # Equity stays same (assume equity % is independent of location/role)
            result[level_key]["equity_pct"][pct] = target_level["equity_pct"][pct]
    
    return result


def generate_full_dataset(anchors: Dict) -> List[Dict]:
    """生成完整数据集：所有stage × location × role × level组合"""
    dataset = []
    
    total_combinations = len(FUNDING_STAGES) * len(LOCATIONS) * len(ROLES) * len(LEVELS)
    print(f"\n🎯 开始生成数据集 ({total_combinations} 条记录)...")
    
    count = 0
    
    for stage_key, stage_label, _ in FUNDING_STAGES:
        for loc_key, loc_label, loc_mult, _ in LOCATIONS:
            for role_key, role_label, role_mult, _ in ROLES:
                
                # 推算这个组合的数据
                comp_data = extrapolate_compensation(
                    base_stage="series_a_late",
                    base_location="san_francisco",
                    base_role="engineering",
                    target_stage=stage_key,
                    target_location=loc_key,
                    target_role=role_key,
                    anchors=anchors
                )
                
                for level_key in comp_data.keys():
                    level_data = comp_data[level_key]
                    
                    # 为每个percentile生成一行
                    for pct in PERCENTILES:
                        record = {
                            "stage": stage_key,
                            "stage_label": stage_label,
                            "location": loc_key,
                            "location_label": loc_label,
                            "role": role_key,
                            "role_label": role_label,
                            "level": level_key,
                            "level_label": level_data["label"],
                            "level_name": level_data["name"],
                            "percentile": pct,
                            "salary": level_data["salary"][pct],
                            "total_cash": level_data["total_cash"][pct],
                            "equity_pct": level_data["equity_pct"][pct],
                        }
                        dataset.append(record)
                        count += 1
                
                if count % 1000 == 0:
                    print(f"  ... {count}/{total_combinations} 条记录已生成")
    
    print(f"✅ 数据集生成完成！共 {len(dataset)} 条记录")
    return dataset


def export_to_csv(dataset: List[Dict], filename: str):
    """导出为CSV"""
    output_path = OUTPUT_DIR / filename
    
    fieldnames = [
        "stage", "stage_label", "location", "location_label",
        "role", "role_label", "level", "level_label", "level_name",
        "percentile", "salary", "total_cash", "equity_pct"
    ]
    
    with open(output_path, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(dataset)
    
    print(f"✅ 导出CSV: {output_path}")
    return output_path


def export_to_json(dataset: List[Dict], filename: str):
    """导出为JSON"""
    output_path = OUTPUT_DIR / filename
    
    with open(output_path, 'w') as f:
        json.dump(dataset, f, indent=2)
    
    print(f"✅ 导出JSON: {output_path}")
    return output_path


def generate_summary_stats(dataset: List[Dict]):
    """生成摘要统计"""
    stages = set(d["stage"] for d in dataset)
    locations = set(d["location"] for d in dataset)
    roles = set(d["role"] for d in dataset)
    levels = set(d["level"] for d in dataset)
    
    print("\n📊 数据集摘要:")
    print(f"  • Funding Stages: {len(stages)}")
    print(f"  • Locations: {len(locations)}")
    print(f"  • Roles: {len(roles)}")
    print(f"  • Levels: {len(levels)}")
    print(f"  • Total Records: {len(dataset)}")
    print(f"  • Expected pSEO Pages: {len(stages) * len(locations) * len(roles) * len(levels)} (不含percentile)")


def main():
    print("🚀 RoleOffer完整数据集生成器")
    print("=" * 70)
    
    # 1. 加载所有锚点
    print("\n📂 加载Carta锚点数据...")
    anchors = load_all_anchors()
    
    # 2. 生成完整数据集
    dataset = generate_full_dataset(anchors)
    
    # 3. 导出文件
    print("\n💾 导出数据...")
    export_to_csv(dataset, "roleoffer_full_dataset.csv")
    export_to_json(dataset, "roleoffer_full_dataset.json")
    
    # 4. 生成统计
    generate_summary_stats(dataset)
    
    print("\n✅ 完成！数据集已保存到 roleoffer-data/generated/")


if __name__ == "__main__":
    main()
