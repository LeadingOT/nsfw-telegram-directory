# SEO最佳实践合集 - 2026-02-28

> 来源：X用户 @hezhiyan7 的文章合集（143篇）
> 存储日期：2026-02-28
> 用途：Directory Factory + RoleOffer优化参考

---

## 🎯 立即可用的优化技巧

### 1. GSC数据反向新增内页 ⭐⭐⭐⭐⭐

**原理：** 用户搜索了某个词，你的站有展示但没点击 → 说明缺少该词的内容

**操作流程：**
1. 每周运行 `node scripts/gsc-traffic.mjs --all`
2. 找出：impressions > 20 但 clicks = 0 的关键词
3. 判断是否值得做独立页面
4. 用AI生成该关键词的landing page
5. 部署 + 提交sitemap

**案例：**
- "kindroid" - 83 impressions, 0 clicks → 优化title/meta提到kindroid
- 预期效果：CTR 0% → 2-5%

**工具：** GSC后台 → 效果 → 查询

---

### 2. 热力图分析用户行为 ⭐⭐⭐⭐

**工具：** Microsoft Clarity（免费）

**功能：**
- 点击热力图：看用户点击了哪里
- 滚动热力图：看用户浏览到哪里
- 会话录像：回放用户操作

**实战案例：**
> webfunny发现VIP价格被点击6.7%，但该元素没有任何点击反馈
> → 在此处增加"联系我们"引导
> → 咨询量显著增加

**对Directory Factory的价值：**
- 发现用户点击了哪些listings
- 检查"Submit your tool"按钮是否被注意
- 发现UI问题（用户点了但没反应的地方）

**安装步骤：**
1. 注册 clarity.microsoft.com
2. 获取tracking code
3. 添加到网站<head>
4. 等待24小时开始收集数据

**关键指标：**
- 点击热力图：优化首屏布局
- 停留时长：识别高价值内容
- 退出页面：找出用户流失点

---

### 3. Chrome插件 = DR 92超级外链 ⭐⭐⭐⭐⭐

**核心价值：**
- Chrome Web Store DR: **92**
- Firefox Add-ons DR: **93**
- Microsoft Edge Add-ons DR: **91**
- Opera Add-ons DR: **90**

**策略：**
把网站的某个功能做成浏览器插件，上架到4个平台

**投入产出比：**
- 开发时间：1-2天（AI辅助）
- 成本：Chrome $5注册费，其他免费
- 收益：4条DR 90+的外链 + 持续自然流量

**审核时间：**
- Chrome: 4天（首次），1-2天（更新）
- Firefox: 1-2天
- Edge: 7天
- Opera: 1-2天

**插件上架要求：**
1. 开发者账号（Chrome需$5，其他免费）
2. 插件打包文件（.zip或.crx）
3. 隐私政策URL
4. 详细权限说明
5. 应用图标和截图

**对Directory Factory的应用：**
- 把AI girlfriend对比表做成插件
- 用户点击插件图标 → 弹出28个工具对比
- 点击任意工具 → 跳转到你的网站详情页

**参考教程：** 文章《如何上架chrome插件带来高质量外链》

---

### 4. 外链逆向找需求 ⭐⭐⭐

**思路：**
新站上线后会提交外链 → 逆向爬这些平台 → 发现新需求

**推荐平台：**
- allstartups.info - 每日新站提交
- oye.dir.com - 目录站
- site-listing.com - 网站列表

**操作方法：**
1. 每天浏览这些平台的"最新提交"
2. 看哪些新词/新产品在出现
3. 分析是否值得跟进
4. 快速上站（抢先机）

**价值：**
- 云上站：不用自己想需求，看别人在做什么
- 学习：分析成功案例的套路
- 找外链：这些平台本身也是外链资源

---

### 5. Sitemap优化小技巧 ⭐⭐⭐⭐

**问题：** Sitemap提交后Google不爬或爬取慢

**优化技巧：**

#### 1. 分片策略
```xml
<!-- 主sitemap -->
<sitemapindex>
  <sitemap>
    <loc>https://accountingai.tools/sitemap-listings.xml</loc>
    <lastmod>2026-02-28</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://accountingai.tools/sitemap-pages.xml</loc>
    <lastmod>2026-02-28</lastmod>
  </sitemap>
</sitemapindex>
```

**建议：**
- 每个sitemap最多500条URL
- 重要页面放在独立sitemap
- listings、category、blog分开

#### 2. 添加lastmod标签
```xml
<url>
  <loc>https://accountingai.tools/listing/quickbooks</loc>
  <lastmod>2026-02-28</lastmod>
  <priority>0.8</priority>
</url>
```

#### 3. 优先级设置
- 首页：1.0
- Listings详情页：0.8
- Category页：0.7
- 其他：0.5

#### 4. 提交策略
- 新站：每天提交一次sitemap
- 成熟站：每周提交一次
- 有新内容时：立即重新提交

---

### 6. 图片SEO + Pinterest外链 ⭐⭐⭐

**Pinterest图片外链策略：**

**操作流程：**
1. 为每个AI tool创建精美对比图
2. 上传到Pinterest
3. 设置图片链接到你的网站listing页
4. 添加描述和hashtags

**好处：**
- 免费引流
- Pinterest本身SEO很好（DR 93）
- 图片搜索流量
- 外链+品牌曝光

**对Directory Factory的应用：**
- 制作"28 Best AI Girlfriend Apps对比图"
- 制作"17 Best AI Accounting Tools功能对比"
- 每个tool的feature highlight图

**Pinterest SEO技巧：**
- 图片尺寸：1000x1500px（竖版）
- 标题包含关键词
- 描述详细（200+字）
- 添加hashtags：#AIGirlfriend #AITools #BestAI

**工具推荐：**
- Canva：制图
- Pinterest Business账号：数据分析

---

### 7. 邮件营销自动化 ⭐⭐⭐⭐

**核心场景：**

#### 场景1：购物车放弃
```
用户打开Stripe checkout → 但没支付
24小时后自动发送：
"Hey! Here's 20% off to complete your order"
```

#### 场景2：召回沉睡用户
```
用户30天未登录
自动发送：
"We miss you! Here are 100 free credits"
```

#### 场景3：新功能通知
```
网站上线新功能
发送给所有注册用户：
"New Feature: AI Girlfriend Voice Chat is live!"
```

**技术实现：**

**工具：** Resend（免费100封/天）

**自建发送页面：**
```javascript
// AI 10分钟搞定
import { Resend } from 'resend';

async function sendAbandonedCartEmail() {
  const users = await getCheckoutAbandonedUsers(24); // 24小时内
  
  for (const user of users) {
    await resend.emails.send({
      from: 'noreply@aigirlfriend.tools',
      to: user.email,
      subject: '20% Off - Complete Your Order',
      html: generateEmailTemplate(user)
    });
  }
}
```

**关键指标：**
- 打开率：15-25%
- 点击率：2-5%
- 转化率：0.5-2%

---

### 8. 定价心理学 ⭐⭐⭐

**策略1：价格锚点**
```
❌ Basic: $9.99
✅ Basic: $9.99 | Pro: $29.99 (Most Popular) | Premium: $99.99
```
中间价格看起来更"划算"

**策略2：限时优惠**
```
"50% OFF - Ends in 23:59:47"
```
制造紧迫感，提升转化率20-30%

**策略3：弹窗优惠码**
```
监测用户行为：
- 进入pricing page
- 停留>30秒
- 准备离开页面

触发弹窗：
"Wait! Here's 15% off for first-time users"
```

**策略4：对比展示**
```
Without AI Tool: $500/month manual work
With Our Tool: $29/month + save 40 hours
```

**对RoleOffer适用：**
- $49 Starter | $99 Pro (Most Popular) | $199 Enterprise
- "Limited offer: 30% off for YC companies"
- Exit-intent popup with discount code

---

### 9. 防薅羊毛策略 ⭐⭐⭐

**问题：** 用户注册多个账号获取免费credits

**防护措施：**

#### 1. 设备指纹
```javascript
// 记录用户设备特征
const fingerprint = await getDeviceFingerprint();
// IP + User-Agent + Canvas fingerprint + WebGL
```

#### 2. 限制规则
- 同一IP 24小时内最多注册3个账号
- 同一设备指纹只能领取1次免费credits
- 手机号验证（防止虚拟号）

#### 3. 行为分析
```javascript
// 异常行为检测
if (user.signupTime - user.firstUse < 60s) {
  flagAsBot(); // 注册后立即使用 = 机器人
}
```

#### 4. 渐进式信任
```
新用户：5 free credits
邮箱验证：+10 credits
手机验证：+20 credits
首次付费：+50 credits
```

**工具推荐：**
- Cloudflare Turnstile（免费验证码）
- FingerprintJS（设备指纹）

---

### 10. 用户转化链路优化 ⭐⭐⭐⭐⭐

**核心流程：**
```
访问网站 → 点击CTA → 注册 → 首次使用 → 付费升级 → 持续使用
```

**每个环节的关键指标：**

#### 1. 获取流量
- SEO、社媒、投流
- 指标：跳出率 <60%、停留时间 >30s

#### 2. 首页引导
- 3秒内理解产品是什么
- 提供免费试用
- 指标：首次交互率 >30%

#### 3. 登录注册
- 右侧弹窗引导（不是跳转页面）
- Google One Tap登录
- 指标：注册转化率 >10%

#### 4. 首次体验
- Onboarding引导
- 立即展示价值（不要等）
- 指标：首次完成率 >50%

#### 5. 付费转化
- 清晰的pricing说明
- 价格锚点
- 限时优惠弹窗
- 指标：付费转化率 0.5-2%

#### 6. 留存激活
- 邮件提醒
- 积分签到
- 新功能push
- 指标：7日留存 >20%、30日留存 >10%

**优化工具：**
- Microsoft Clarity：看用户卡在哪里
- Hotjar：热力图
- Google Analytics：漏斗分析

---

## 🔧 技术实现技巧

### 1. API调试工具推荐

**国内友好：**
- Apifox（中文界面，免费）
- Postman（英文，功能强大）

**特点对比：**
- Apifox：集成API文档+调试+Mock+测试
- 支持团队协作
- 数据实时同步

### 2. 一键部署上线

**Vercel部署：**
```bash
# 1. GitHub登录Vercel
# 2. Import项目
# 3. 点击Deploy
# 等1分钟，网站上线
```

**好处：**
- 自动HTTPS
- 全球CDN
- 自动preview环境
- GitHub push自动部署

### 3. 免费资源白嫖

**数据库：**
- Supabase：2个免费项目
- Neon：免费PostgreSQL
- PlanetScale：免费MySQL

**存储：**
- Cloudflare R2：10GB免费
- Vercel Blob：免费额度

**邮件：**
- Resend：100封/天免费
- Cloudflare Email Routing：免费转发

### 4. 域名配置技巧

**子域名策略：**
```
blog.aigirlfriend.tools  → Ghost博客
api.aigirlfriend.tools   → API服务
cdn.aigirlfriend.tools   → 图片CDN
```

**好处：**
- 功能隔离
- SEO独立
- 安全隔离（出问题不影响主站）

**注意：**
- 子域名 = 独立网站
- GSC需要单独提交
- Analytics需要单独配置

### 5. 多语言适配

**i18n实现：**
```javascript
// Next.js + next-intl
import {useTranslations} from 'next-intl';

export default function HomePage() {
  const t = useTranslations('Index');
  return <h1>{t('title')}</h1>;
}
```

**自动检测语言：**
```javascript
// 检测浏览器语言
const userLang = navigator.language; // en-US, zh-CN

// 自动跳转
if (userLang.startsWith('zh')) {
  redirect('/zh/');
}
```

**提醒用户切换：**
```
检测到中文浏览器 → 右上角提示：
"切换到中文版？ Switch to Chinese?"
```

---

## 📊 数据分析进阶

### 1. GA4事件上报

**关键事件：**
```javascript
// 点击listing
gtag('event', 'listing_click', {
  listing_name: 'QuickBooks',
  category: 'Accounting'
});

// 注册转化
gtag('event', 'signup', {
  method: 'Google'
});

// 付费转化
gtag('event', 'purchase', {
  value: 29.99,
  currency: 'USD'
});
```

**自定义维度：**
- 用户来源国家
- 付费 vs 免费用户
- 使用的AI model

### 2. 对比不同用户群

**GA4操作：**
1. 创建用户细分（Segment）
2. 对比分析（Compare）

**例子：**
```
付费用户 vs 免费用户：
- 页面浏览深度
- 停留时间
- 转化路径

美国用户 vs 印度用户：
- 付费率差异
- 客单价差异
```

### 3. Stripe API数据分析

**获取关键指标：**
```javascript
// 月度收入
const charges = await stripe.charges.list({
  created: {
    gte: monthStart,
    lt: monthEnd
  }
});

// MRR (Monthly Recurring Revenue)
const subscriptions = await stripe.subscriptions.list({
  status: 'active'
});

// Churn rate
const canceled = subscriptions.filter(s => s.cancel_at);
```

---

## 🎨 UI/UX优化技巧

### 1. Google One Tap丝滑登录

**效果：**
- 右上角弹出Google账号卡片
- 一键登录，无需跳转

**实现：**
```html
<script src="https://accounts.google.com/gsi/client"></script>
<div id="g_id_onload"
     data-client_id="YOUR_CLIENT_ID"
     data-callback="handleCredentialResponse">
</div>
```

**转化率提升：** 传统登录5% → One Tap 15%+

### 2. 快捷拾取网站配色

**工具：**
- ColorZilla（浏览器插件）
- zippystarter.com/tools/shadcn-ui-theme-generator

**操作：**
1. 看到喜欢的网站配色
2. ColorZilla吸取颜色
3. 应用到自己的网站

### 3. 图片优化

**压缩工具：**
- TinyPNG（压缩80%不失真）
- Squoosh（Google出品）

**格式选择：**
- WebP：比PNG小30%
- AVIF：比WebP再小20%

**lazy loading：**
```html
<img src="image.jpg" loading="lazy" alt="AI Tool">
```

---

## 🚀 推广增长技巧

### 1. Reddit营销注意事项

**禁忌：**
- 新账号直接发链接 → 秒删
- 标题党 → 被downvote
- 纯广告 → 封号

**正确做法：**
1. 先混脸熟（回复有价值的评论）
2. 积累karma值（>100）
3. 发帖提供价值，链接放在评论区
4. 参与讨论，不是发完就走

**案例：**
> "I built a tool to compare AI girlfriend apps, here's what I learned..."
> 评论区：Here's the link if anyone interested: [url]

### 2. 推特营销邪修流量

**原理：** 回复热门推文 → 获得曝光

**操作：**
1. 用高级搜索找爆帖
```
lang:en within_time:4h min_faves:3000 -is:retweet
```

2. 筛选：流量大、评论少的帖子
3. 快速抢前排回复
4. 回复要有价值（不是纯广告）

**效果：**
> 52条回复 → 180K展示量

**风险：**
- 会打乱账号标签
- 后期需要刷回来

### 3. Build in Public

**策略：** 公开分享产品开发过程

**内容：**
- 今天解决了XX技术难题
- 第一个付费用户！
- 本周收入$XXX
- 踩坑：XXX

**好处：**
- 建立信任
- 吸引早期用户
- 自然外链（别人会引用你）

**平台：**
- Twitter（#buildinpublic）
- Indie Hackers
- 即刻

### 4. Newsletter私域

**为什么要做：**
- 不依赖平台
- 直接触达用户
- 可导出邮箱（真私域）

**内容：**
- 每周精选AI tools
- 行业趋势分析
- 独家优惠

**工具：**
- Substack（免费）
- ConvertKit（免费1000订阅者）
- Beehiiv（免费2500订阅者）

---

## 💡 需求挖掘方法论

### 1. 词根扩展法

**原理：** 从核心词根发散

**例子：**
```
词根：AI girlfriend

扩展1：类型
- AI boyfriend
- AI companion
- Virtual girlfriend

扩展2：功能
- AI girlfriend chat
- AI girlfriend voice
- AI girlfriend image generator

扩展3：情境
- best AI girlfriend app
- free AI girlfriend
- NSFW AI girlfriend
```

**工具：**
- Google Trends Related queries
- Semrush Keyword Magic Tool
- DataForSEO related keywords

### 2. 竞品外链逆向

**操作：**
1. Semrush输入竞品域名
2. 查看Backlinks
3. 分析外链来源
4. 发现新的提交平台

**收获：**
- 外链资源
- 潜在需求（竞品在推什么）

### 3. 出站流量分析

**原理：** 看网站链接到哪些外部产品 → 发现受关注的新产品

**工具：**
- Semrush Referring Domains
- 分析vc.ru等导航站的出站链接

**案例：**
> 哥飞分析vc.ru出站域名 → 发现大量新产品 → 批量查询注册时间和流量 → 找到正在推广的新站

### 4. 插件差评找需求

**操作：**
1. Chrome Web Store搜索某个品类
2. 看差评（1-2星）
3. 分析用户抱怨什么
4. 做一个解决这些问题的产品

**案例：**
> "这个AI工具太贵了" → 做免费替代品
> "没有中文支持" → 做中文版

### 5. Grok监测新词

**设置：**
1. 打开grok.com
2. 创建Task（定时任务）
3. 输入监测内容：
```
"Monitor Twitter for trending AI models released in the past 24 hours"
```

**好处：**
- 每天自动上奏折
- 第一时间发现新词
- 快速上站

---

## 🔗 外链建设进阶

### 1. 外链聚合网站

**推荐资源：**
- mkdollar.com/backlinks - 外链列表汇总
- directories.bestaitools.com - AI工具目录聚合

**用法：**
- 批量获取外链资源
- 一次提交多个平台

### 2. 制作书签批量发外链

**操作：**
1. 收集所有外链提交页面URL
2. 保存为浏览器书签文件夹
3. 新站上线 → 打开书签文件夹 → 逐个提交

**提效工具：**
- 用脚本自动打开所有书签
- 用AI自动填写表单（Playwright MCP）

### 3. Stripe高质量外链

**原理：** Stripe有Partner Directory

**操作：**
1. 注册Stripe账号
2. 申请成为Partner
3. 提交产品到 stripe.com/partners

**收益：**
- DR 93外链
- 官方背书
- 潜在客户

---

## 📈 Google Ads投流技巧

### 1. 关键词选择

**策略：**
- 长尾词优先（竞争小，转化高）
- 品牌词截流（竞品名字）

**例子：**
```
✅ "best free AI accounting tool"
❌ "accounting" (太宽泛)

✅ "quickbooks alternative" (截流)
```

### 2. 查看竞品投放词

**工具：** Semrush → Advertising Research

**操作：**
1. 输入竞品域名
2. 查看Paid Keywords
3. 抄作业（投相同的词）

### 3. 关键词搜索量查询

**免费工具：**
- Google Keyword Planner
- Ubersuggest（免费3次/天）

**付费工具：**
- Semrush
- Ahrefs

### 4. 监控通知

**设置：**
- Google Ads自动规则
- 当CPC > $X → 暂停广告
- 当转化率 < X% → 发邮件通知

**防爆预算：**
- 设置每日预算上限
- 设置单次点击最高出价

---

## 🛠 开发效率工具

### 1. Starter Kit推荐

**免费：**
- shadcn-landing-page（GitHub开源）
- zippystarter.com配色生成器

**付费（有优惠码）：**
- ShipFast（$199 → 搜优惠码）
- MKSaaS（$299）
- SupaStarter（$399）

**包含功能：**
- 登录/注册（Google/Email）
- Stripe支付
- 数据库集成
- 邮件发送
- 多语言
- SEO优化

### 2. Claude Code命令创建

**减少重复操作：**

**例子：**
```bash
# 创建自定义命令
alias new-listing="claude code 'Create a new listing page with SEO optimized title and schema markup'"
```

**常用命令：**
- 新建listing页面
- 生成sitemap
- 优化图片
- 发送邮件

### 3. 用嘴编程技巧

**提示词模板：**
```
你是世界上最好的[React/Python]开发者
我需要实现[功能描述]
技术栈：[Next.js/Supabase/etc]
参考文档：[API文档链接]
示例代码：[贴代码]

请生成完整可运行的代码，包含错误处理
```

**关键：**
- 提供完整context
- 给参考文档
- 给示例输入输出
- PUA一下AI（"你是最棒的"）

---

## 🎯 SEO排名因素（2025）

### 权重排序：

1. **内容质量（23%）** - 持续发布满足搜索意图的内容
2. **Title优化（14%）** - 标题包含目标关键词
3. **外链（13%）** - 高质量相关外链
4. **专业度（13%）** - 细分领域专家
5. **用户参与度（12%）** - 停留时间、跳出率
6. **新鲜度（6%）** - 内容更新频率
7. **移动优先（5%）** - 移动端体验
8. **可信度（4%）** - 关于我们、联系方式
9. **外链多样性（3%）** - 不同来源的外链
10. **页面速度（2%）** - 加载速度
11. **HTTPS（2%）** - 网站安全
12. **内链（1%）** - 站内链接结构
13. **技术SEO（1%）** - Schema、sitemap等

**来源：** firstpagesage.com/seo-blog/the-google-algorithm-ranking-factors/

---

## 💰 收入模型

### 行业基准：

**广告变现：**
- 月入$10,000 → 需要100万月访客
- eCPM: $10-20（发达国家）

**订阅变现：**
- 月入$10,000 → 需要10-30万月访客（发达国家为主）
- 付费转化率：0.5%中位数，2%+优秀

**流量价值差异：**
- 1个美国用户 ≈ 50个印度用户（广告价值）
- 1个美国付费用户 ≈ 100个印度付费用户

---

## 🧠 认知升级

### 1. 种树理论（哥飞）

> 做网站就像种树
> - 农作物：种一次收一次（新词站）
> - 果树：种一次年年收（老词站）
> - 种一棵树靠运气，种一片果园靠概率

**启示：**
- 不要all-in一个站
- 同时维护10+个站
- 有的死了，有的活了，总有收成

### 2. 找需求定生死

> 选品定生死（电商）
> 找需求定生死（网站出海）

**启示：**
- 90%的成败在选需求那一刻已决定
- 技术不重要，需求才重要
- 宁可花1周找需求，不要花1天做错需求

### 3. 时间是魔法

> 坚持上站发外链，慢慢就会有收获

**启示：**
- SEO需要3-6个月见效
- 新站前3个月几乎没流量是正常的
- 持续做正确的事，时间会给答案

### 4. 技术重要，思维更重要

> AI已经降低开发门槛
> 现在拼的是：需求判断、运营能力、执行力

**启示：**
- 不要纠结技术栈
- 不要追求完美代码
- 够用就行，快速验证

---

## 📚 学习资源

### 课程/社群：
- 刘小排 Idea to Business（$4999，2个月+1年社群）
- 哥飞 SEO社群（¥2600/年）
- 向阳乔木 AI领导力（¥199）

### 工具订阅：
- ChatGPT Pro（$20/月）
- Claude Code（$20/月）
- Cursor（$20/月）
- Lenny's Newsletter礼包（$170/年：Cursor+v0+Lovable+Bolt）

### 免费资源：
- Ahrefs博客（中文SEO教程）
- Google Search Central（官方SEO文档）
- Vercel文档（Next.js部署）

---

## 🎬 实战案例

### 案例1：新手半年月入千刀

**时间线：**
- 5-7月：学习阶段
- 8月：做新词站，无反响
- 9月：推特涨粉，焦虑期
- 10月：推特商单$400，一个站有起色
- 11月：专注优化一个站，月入$990

**关键转折：**
- 不再追新词，专注优化有起色的站
- 发外链、加内页、看数据、优化转化
- 推特商单意外收入

**启示：**
- 前3-6个月没结果很正常
- 找到一个有起色的站，all-in优化
- 多条腿走路（SEO+社媒+商单）

### 案例2：8小时280 karma（Reddit）

**操作：**
- 找到sub-reddit相关话题
- 提供真实有价值的回答
- 链接放在评论区（不是标题）

**效果：**
- 8小时280 karma值
- 流量引流到网站

**启示：**
- Reddit不能硬广
- 先提供价值，再放链接

### 案例3：表情包获奖

**产品：** makememe.net

**策略：**
- 发布到Faizer（小型Product Hunt）
- 没做推广，自然拿到日榜第一
- 参加黑客马拉松，获得铜奖

**启示：**
- 好产品自己会传播
- 多参加比赛（曝光+外链+奖励）

---

## ✅ 检查清单

### 新站上线Check List：

**技术SEO：**
- [ ] Title、Description、H1优化
- [ ] Sitemap生成并提交GSC
- [ ] robots.txt配置
- [ ] Schema markup（JSON-LD）
- [ ] Canonical标签
- [ ] 图片alt属性
- [ ] HTTPS启用
- [ ] 移动端适配
- [ ] 页面速度优化（<3s）

**Analytics：**
- [ ] Google Analytics 4
- [ ] Google Search Console
- [ ] Microsoft Clarity热力图

**外链：**
- [ ] Product Hunt发布
- [ ] 10个以上directory提交
- [ ] Social media发布（Twitter/Reddit）

**用户体验：**
- [ ] 登录功能（Google One Tap）
- [ ] 支付功能（Stripe/Creem）
- [ ] 邮件发送（Resend）
- [ ] 免费试用credits

**合规：**
- [ ] Privacy Policy页面
- [ ] Terms of Service页面
- [ ] Contact页面（support@domain.com）
- [ ] GDPR提示（欧盟用户）

---

## 🔄 定期维护清单

### 每日：
- [ ] 检查GSC错误
- [ ] 回复用户邮件
- [ ] 社媒互动

### 每周：
- [ ] 运行`seo-optimize-finder.mjs`找优化机会
- [ ] 发2-3条外链
- [ ] 新增1-2个精品内页
- [ ] 查看Clarity录屏（发现问题）

### 每月：
- [ ] 运行`seo-weekly-report.mjs`看数据
- [ ] 分析GA4转化漏斗
- [ ] 更新过时内容
- [ ] Review竞品动态
- [ ] 财务核算（收入-成本）

---

**存储日期：** 2026-02-28  
**来源：** @hezhiyan7 文章合集（143篇）  
**用途：** Directory Factory & RoleOffer优化指南  
**下次review：** 每月1号
