# OPERATIONS-PLAYBOOK.md 维护指南

## 核心原则：边做边记录 (Document as You Go)

❌ **错误做法:**
- 完成工作后创建独立的日志文件
- 工作和文档分离
- 信息分散在多个文件

✅ **正确做法:**
- 做修复时，立即更新相应章节
- 保持单一真相源 (Single Source of Truth)
- 所有信息集中在 OPERATIONS-PLAYBOOK.md

---

## 文档更新流程

### Step 1: 做工作时立即记录

**做了修复/优化/新功能？**
```bash
# 1. 先完成技术工作
git add . && git commit -m "Fix: ..." && git push

# 2. 立即打开 OPERATIONS-PLAYBOOK.md
code ~/.openclaw/workspace/OPERATIONS-PLAYBOOK.md
```

### Step 2: 更新对应章节

**根据工作类型，更新对应位置:**

#### 如果是Critical Fix（紧急修复）
```markdown
## Change Log

### YYYY-MM-DD - [简短标题]
**Duration:** X hours
**Impact:** [影响范围]

**✅ [产品名] [问题类型]**
- **Problem:** [具体问题]
- **Root Cause:** [根本原因]
- **Solution:** [解决方案]
- **Git Commits:** [commit hash]
- **Expected Result:** [预期结果]
```

#### 如果是新功能/优化
更新对应产品章节（Directory Factory 或 RoleOffer）

#### 如果是配置/部署变更
更新 Technical Architecture 章节

#### 如果学到了教训
更新 Critical Fixes & Lessons Learned > Key Lessons Summary

#### 如果改变了流程
更新 Maintenance & Monitoring 章节

### Step 3: 更新元数据

```markdown
*Last Updated: YYYY-MM-DD*
```

### Step 4: Commit文档更新

```bash
cd ~/.openclaw/workspace
git add OPERATIONS-PLAYBOOK.md
git commit -m "docs: Update playbook - [简短描述]"
git push
```

---

## Change Log 格式规范

### 标题格式
```
### YYYY-MM-DD - [类型] [简短标题]
```

**类型选项:**
- Major Fix（重大修复）
- Feature（新功能）
- Optimization（优化）
- Config Change（配置变更）
- Documentation（文档更新）

### 完整条目模板

```markdown
### YYYY-MM-DD - [类型] [标题]
**Duration:** [时间]
**Impact:** [影响评估]

**✅ [工作项1]**
- **Problem:** [问题描述]
- **Root Cause:** [根本原因]
- **Solution:** [解决方案，可以多行]
  - Sub-point 1
  - Sub-point 2
- **Technical Details:** [可选，技术细节]
- **Git Commits:** [commit hashes]
- **Expected Result:** [预期结果 + timeline]

**✅ [工作项2]**
[同样格式...]

**🎓 Key Lessons:**
1. [教训1]
2. [教训2]

**Files Modified:** 
- [文件路径]: [变更描述]

**Metrics:**
- [相关指标]
```

---

## 实际案例：今天的修复

### 做错的地方 ❌
1. 完成所有工作后才开始写文档
2. 创建了独立的日志文件 `2026-03-19-complete-overhaul.md`
3. 信息重复（Change Log + 独立日志）

### 应该怎么做 ✅
1. 修复aigirlfriend流量问题
   → 立即在 Change Log 添加条目
   → 记录问题、原因、解决方案

2. 修复RoleOffer内链问题
   → 在同一个 Change Log 条目继续记录
   → 不创建新文件

3. 学到教训
   → 更新 Critical Fixes > Key Lessons Summary
   → 添加到已有的7条教训中

4. 文档完成
   → 不需要单独的"overhaul日志"
   → 所有信息已经在 OPERATIONS-PLAYBOOK.md

---

## 日常维护检查清单

### 每次做工作后
- [ ] 更新 Change Log（如果是fix/feature）
- [ ] 更新相关章节（如果改了架构/配置）
- [ ] 更新 Last Updated 日期
- [ ] Commit + push 文档变更

### 每周一次
- [ ] Review Change Log（是否有遗漏）
- [ ] 检查是否有outdated信息
- [ ] 更新当前指标（traffic、pages indexed）

### 每月一次
- [ ] 整理 Change Log（归档到相关章节）
- [ ] 更新 Growth Roadmap（目标进展）
- [ ] Review + refactor 文档结构（如果需要）

---

## 避免的反模式

### ❌ Anti-Pattern 1: 事后补文档
**表现:** 做完工作几天后才想起来写文档  
**问题:** 细节遗忘、缺少context、信息不完整  
**解决:** 做的时候就写，哪怕只是bullet points

### ❌ Anti-Pattern 2: 创建独立日志
**表现:** 每天/每次工作创建新的 `.md` 文件  
**问题:** 信息分散、难以搜索、维护成本高  
**解决:** 所有记录进 OPERATIONS-PLAYBOOK.md

### ❌ Anti-Pattern 3: 过度详细
**表现:** 记录每一个命令、每一行代码  
**问题:** 文档膨胀、难以阅读、无法快速找到重点  
**解决:** 记录What & Why，不记录How（除非critical）

### ❌ Anti-Pattern 4: 永不更新
**表现:** 文档越来越outdated，无人维护  
**问题:** 失去信任、变成"遗产代码"  
**解决:** 每次改动必须更新文档（make it a rule）

---

## 文档质量标准

### 好的Change Log条目
✅ 包含 Problem + Root Cause + Solution  
✅ 有预期结果 + timeline  
✅ Git commits可追溯  
✅ 简洁清晰，5分钟能读完  
✅ 有可操作的lessons learned

### 差的Change Log条目
❌ 只说"修了个bug"，没说是什么bug  
❌ 没有原因分析，下次还会犯  
❌ 没有结果评估，不知道是否有效  
❌ 太长太详细，没人想读

---

## 快速命令

### 打开主文档
```bash
code ~/.openclaw/workspace/OPERATIONS-PLAYBOOK.md
```

### 查看最近更新
```bash
head -100 ~/.openclaw/workspace/OPERATIONS-PLAYBOOK.md | grep "Last Updated"
```

### 搜索特定topic
```bash
grep -n "aigirlfriend" ~/.openclaw/workspace/OPERATIONS-PLAYBOOK.md
```

### 查看Change Log
```bash
sed -n '/## Change Log/,/## Executive Summary/p' ~/.openclaw/workspace/OPERATIONS-PLAYBOOK.md | head -100
```

---

## 总结

**记住：** 
1. **边做边记录** - 不要等到事后
2. **单一真相源** - 所有信息在 OPERATIONS-PLAYBOOK.md
3. **结构化更新** - 根据工作类型更新对应章节
4. **保持简洁** - 记录关键信息，不是流水账

**这样做的好处：**
- ✅ 信息集中，易于查找
- ✅ 历史可追溯
- ✅ 教训不重复犯
- ✅ 新人能快速上手
- ✅ 决策有据可查

---

**现在就开始正确地维护文档吧！**
