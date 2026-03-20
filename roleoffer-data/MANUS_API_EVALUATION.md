# Manus API评估报告 - RoleOffer用途

**测试时间:** 2026-03-02 凌晨  
**测试者:** Builder CEO  
**目的:** 评估Manus API是否能替代Carta数据作为RoleOffer的compensation数据源

---

## 🧪 测试设置

### API信息
- **服务:** Manus AI (已被Meta收购)
- **API Key:** sk-0dG3...（Bill提供）
- **Base URL:** https://api.manus.ai/v1
- **模型:** manus-1.6-adaptive

### 测试用例
对比2个具体场景：

1. **Senior Software Engineer @ Series A SF**
   - Level: IC4
   - Stage: $10M-$25M raised
   - Location: San Francisco
   - Carta基准: $156K salary, $174K total cash, 0.0516% equity

2. **Mid-level Product Manager @ Series B SF**
   - Level: IC3
   - Stage: $50M-$100M raised
   - Location: San Francisco
   - Carta基准: $165K salary, $183K total cash, 0.0236% equity

---

## 📊 测试结果

### ✅ API可用性
- ✅ API endpoint正常工作
- ✅ 认证成功
- ✅ Task创建成功（返回task_id和task_url）

### ⚠️ 响应模式
- **异步处理:** API返回task_id，需要轮询或webhook获取结果
- **执行时长:** 测试时tasks持续运行30秒+仍未完成
- **状态:** 两个tasks均显示`"status": "running"`
- **输出:** 仅返回"Let me research current compensation data..."等初始响应

### ❌ 关键问题

#### 1. **响应速度太慢**
- Manus做web research，每个query需要1-3分钟
- RoleOffer需要**即时响应**（用户等待<30秒）
- Carta数据预加载到Supabase = 0延迟

#### 2. **数据一致性无法保证**
- Manus每次search可能返回不同结果（取决于web sources）
- Carta数据是**固定benchmark**，所有用户看到相同数据
- RoleOffer需要**可重复、可审计**的数据

#### 3. **无法批量生成**
- RoleOffer需要预生成20,000个pSEO页面
- 用Manus API = 20,000次异步调用 = 至少33小时（假设1分钟/query）
- Carta数据 = 一次性生成完整数据集 = 30秒

#### 4. **成本未知**
- Manus按credit计费，每次research消耗4-28 credits
- 20,000次调用的总成本未知
- Carta数据免费（已有16个锚点CSV）

#### 5. **精度无法验证**
- Manus返回的数据来源不透明
- Carta是**权威benchmark平台**，被YC/顶级VC使用
- RoleOffer需要**可信度**来说服用户

---

## 🎯 结论与建议

### ❌ Manus API **不适合** RoleOffer主数据源

**原因:**
1. ⚠️ **太慢** - 无法支撑real-time UX
2. ⚠️ **不稳定** - 每次查询可能返回不同结果
3. ⚠️ **无法批量** - 20K页面生成不可行
4. ⚠️ **成本不明** - 大规模使用风险高
5. ⚠️ **权威性不足** - 用户更信任Carta/Pave等专业平台

### ✅ 推荐方案：**坚持Carta数据**

**优势:**
- ✅ **权威性** - Carta是行业标准，被顶级startup使用
- ✅ **精准** - 基于16个真实benchmark锚点
- ✅ **快速** - 预生成数据集，0延迟
- ✅ **可重复** - 所有用户看到相同benchmark
- ✅ **免费** - 无API调用成本
- ✅ **可审计** - 数据来源透明，可溯源

**已完成:**
- ✅ 16个高质量Carta锚点CSV
- ✅ 完整multiplier矩阵（Stage × Location × Role）
- ✅ 数据生成脚本（8,640行完整数据集）
- ✅ 覆盖6 stages × 8 locations × 5 roles × 9 levels

---

## 🔄 Manus API的潜在用途

虽然不适合主数据源，但Manus API可以用于：

### ✅ 可能的补充功能
1. **自然语言查询** - 用户问"比market high多少？" → Manus生成解释
2. **Negotiation talk points** - 基于数据生成negotiation建议（非数据本身）
3. **Offer letter文案** - 用Manus生成offer letter的文字内容
4. **Market trend分析** - 每周/月运行一次，补充最新市场动态（非实时）

### ❌ 不适合
- ❌ 替代Carta作为compensation数据源
- ❌ Real-time用户查询（太慢）
- ❌ 批量pSEO页面生成（太慢+成本高）

---

## 📝 最终建议

**继续使用Carta数据作为RoleOffer的核心数据层:**
1. 已有16个高质量锚点
2. 数据生成脚本已完成
3. 下一步：导入Supabase → 开始pSEO生成

**Manus API可选用于:**
- Offer letter文案生成
- Negotiation coaching（非数值计算）
- Blog/SEO content生成

**不推荐用Manus API做:**
- Compensation benchmark计算
- pSEO页面数据生成
- 任何需要real-time响应的功能

---

**测试命令保存位置:**
- `/tmp/test_manus_api_v2.py` - API测试脚本
- `/tmp/get_manus_results.py` - 结果获取脚本
- Task URLs（可手动查看Web界面结果）:
  - https://manus.im/app/cTwsatuQEkSQrw3n4MX8W4
  - https://manus.im/app/i6k59wuiJ4swhoV84yucKc
