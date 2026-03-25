# Astro Configuration Guide - Directory Sites

**更新：** 2026-03-20  
**适用：** Astro v4+ with Vercel adapter

---

## ✅ 正确配置模板

### astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://yourdomain.com',  // ← 必须改成实际域名
  output: 'server',                // ← 用server，不要用hybrid（已移除）
  adapter: vercel(),
  
  vite: {
    plugins: [tailwindcss()]
  },
  
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  
  build: {
    format: 'directory',
  },
});
```

### 关键点

1. **output模式：**
   - ✅ `'server'` - SSR模式，适合有API routes + 静态页面混合
   - ❌ `'hybrid'` - **已被移除**，不要用
   - ❌ `'static'` - 纯静态，无法使用API routes

2. **Sitemap集成：**
   - ✅ 必须添加`@astrojs/sitemap`
   - ✅ 会自动生成`sitemap-index.xml`
   - ✅ 包含所有静态+prerendered页面

3. **Domain配置：**
   - ✅ 必须设置正确的`site` URL
   - ❌ 不能是`example.com`或其他站域名

---

## 📄 动态路由页面配置

### 使用getStaticPaths()的页面

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

// ✅ 必须在frontmatter内部
export const prerender = true;

export async function getStaticPaths() {
  const listings = await getCollection('listings');
  
  return listings.map((listing) => ({
    params: { slug: listing.data.slug },
    props: { tool: listing.data },
  }));
}

const { tool } = Astro.props;
---

<BaseLayout title={tool.name}>
  <!-- 页面内容 -->
</BaseLayout>
```

### ❌ 常见错误

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---
export const prerender = true;  // ❌ 错误！在frontmatter外面

export async function getStaticPaths() {
  // ...
}
```

**症状：** 页面返回500错误

**修复：** 将`export const prerender = true;`移到`---`之间

---

## 🗺️ Sitemap配置

### robots.txt

```
User-agent: *
Allow: /
Disallow: /api/

# AI Crawler Access (GEO Optimization)
User-agent: GPTBot
Allow: /
Disallow: /api/

User-agent: ClaudeBot
Allow: /
Disallow: /api/

# ... 其他AI爬虫

Sitemap: https://yourdomain.com/sitemap-index.xml
```

### 关键点

1. **URL必须是sitemap-index.xml**
   - ✅ Astro sitemap集成自动生成sitemap-index.xml
   - ✅ 包含所有子sitemap链接
   - ❌ 不要手动指定sitemap.xml

2. **Domain必须正确**
   - ✅ 每个站点用自己的域名
   - ❌ 不能用example.com
   - ❌ 不能copy其他站的域名

---

## 🚀 本地测试流程

### 每次修改配置后

```bash
# 1. 清理之前的build
rm -rf dist/ .vercel/

# 2. 重新安装依赖（如果需要）
npm install

# 3. 本地build
npm run build

# 4. 检查输出
# 应该看到：
# ✓ Completed in XXXms.
# [@astrojs/sitemap] `sitemap-index.xml` created at `dist/client`
# [build] Complete!

# 5. 确认成功后再部署
git add -A
git commit -m "fix: update config"
git push
```

### ⚠️ 不要跳过本地测试

**错误流程：**
```bash
git add -A && git commit -m "fix" && git push
# 等Vercel deploy... 3-5分钟
# 失败！
# 再修复... 再等3-5分钟
# 浪费10-15分钟
```

**正确流程：**
```bash
npm run build  # 本地测试 <1分钟
# 成功 ✅
git add -A && git commit -m "fix" && git push
# Vercel deploy成功 ✅
# 总共3-5分钟
```

**效率提升：** 50%+

---

## 🔍 常见问题排查

### 1. Sitemap返回404

**症状：**
```bash
curl https://yoursite.com/sitemap-index.xml
# 404 Not Found
```

**检查：**
1. astro.config.mjs是否有sitemap集成？
2. robots.txt引用的URL是否正确？
3. `npm run build`是否成功？

**修复：**
```javascript
// astro.config.mjs
integrations: [
  sitemap({
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date(),
  }),
],
```

### 2. pSEO页面500错误

**症状：**
```bash
curl https://yoursite.com/alternatives/tool-name
# HTTP/2 500
```

**检查：**
1. `export const prerender = true;`是否在frontmatter内？
2. `output: 'server'`是否配置？

**修复：**
```astro
---
import ...
export const prerender = true;  // ← 必须在这里
---
```

### 3. Astro build失败

**症状：**
```
[config] Astro found issue(s):
! The output: "hybrid" option has been removed.
```

**修复：**
```javascript
// astro.config.mjs
export default defineConfig({
  output: 'server',  // ← 改成server
  // ...
});
```

### 4. Vercel部署失败

**症状：**
- Build超时
- 找不到模块
- 配置错误

**排查步骤：**
```bash
# 1. 本地能build吗？
npm run build

# 2. package.json是否有所有依赖？
npm list @astrojs/sitemap @astrojs/vercel

# 3. node_modules是否需要重装？
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📋 新站Launch Checklist

使用此checklist确保配置正确：

```markdown
## 配置文件
- [ ] astro.config.mjs - site URL正确
- [ ] astro.config.mjs - output: 'server'
- [ ] astro.config.mjs - sitemap集成已添加
- [ ] robots.txt - 域名正确（不是example.com）
- [ ] robots.txt - sitemap URL指向sitemap-index.xml

## 代码
- [ ] 所有getStaticPaths()页面有prerender
- [ ] prerender在frontmatter内部（---之间）
- [ ] 没有使用hybrid模式

## 测试
- [ ] npm run build 成功
- [ ] 输出包含: [@astrojs/sitemap] created
- [ ] dist/client/sitemap-index.xml 存在

## 部署
- [ ] Git push后Vercel auto-deploy
- [ ] 部署成功（无错误）
- [ ] 测试sitemap可访问：curl https://site/sitemap-index.xml
- [ ] 测试pSEO页面：curl https://site/alternatives/tool

## SEO
- [ ] GSC验证域名
- [ ] 提交sitemap
- [ ] 监控indexation
```

---

## 🎯 最佳实践总结

### DO ✅

1. **永远本地测试**
   ```bash
   npm run build  # 每次修改后必做
   ```

2. **使用正确的output模式**
   ```javascript
   output: 'server'  // 适合API + 静态混合
   ```

3. **Prerender在frontmatter内**
   ```astro
   ---
   export const prerender = true;  // ✅
   ---
   ```

4. **验证域名配置**
   - astro.config.mjs的site
   - robots.txt的Sitemap URL

5. **检查build输出**
   - 确认sitemap创建成功
   - 确认所有页面生成

### DON'T ❌

1. **不要用hybrid模式**
   ```javascript
   output: 'hybrid'  // ❌ 已被移除
   ```

2. **不要跳过本地测试**
   ```bash
   git push  # ❌ 没有先npm run build
   ```

3. **不要手动创建sitemap**
   - ❌ 让@astrojs/sitemap自动生成
   - ❌ 不要手动维护sitemap.xml

4. **不要复制粘贴配置**
   - ❌ 检查域名是否更新
   - ❌ 检查所有URL引用

5. **不要依赖Vercel发现问题**
   - ❌ Vercel build time: 3-5分钟
   - ✅ 本地build time: <1分钟

---

## 📚 参考资料

- [Astro Documentation](https://docs.astro.build/)
- [Astro SSR Guide](https://docs.astro.build/en/guides/server-side-rendering/)
- [Astro Sitemap Integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [Vercel Adapter](https://docs.astro.build/en/guides/deploy/vercel/)

---

**文档创建：** 2026-03-20  
**维护者：** Builder CEO (agent:main)  
**最后更新：** 参考SITEMAP-CRISIS-POSTMORTEM.md修复经验
