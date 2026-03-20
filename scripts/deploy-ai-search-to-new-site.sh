#!/bin/bash
# Deploy AI Search to a new Directory site
# Usage: bash scripts/deploy-ai-search-to-new-site.sh <site-name>

set -e

if [ -z "$1" ]; then
  echo "Usage: bash deploy-ai-search-to-new-site.sh <site-directory-name>"
  echo "Example: bash deploy-ai-search-to-new-site.sh emailmarketing-directory"
  exit 1
fi

SITE_DIR="$1"
WORKSPACE="$HOME/.openclaw/workspace"
REFERENCE_SITE="accountingai-directory"

echo "🚀 Deploying AI Search to $SITE_DIR..."

# Check if site exists
if [ ! -d "$WORKSPACE/$SITE_DIR" ]; then
  echo "❌ Error: $SITE_DIR not found in workspace"
  exit 1
fi

cd "$WORKSPACE/$SITE_DIR"

# 1. Create API directory if needed
echo "📁 Creating API directory..."
mkdir -p src/pages/api

# 2. Copy AI Search API endpoint
echo "📋 Copying AI Search API endpoint..."
cp "$WORKSPACE/$REFERENCE_SITE/src/pages/api/ai-search.ts" src/pages/api/ai-search.ts

# 3. Copy AI Search component
echo "📋 Copying AI Search component..."
cp "$WORKSPACE/$REFERENCE_SITE/src/components/AISearch.astro" src/components/AISearch.astro

# 4. Get site URL from astro.config.mjs
SITE_URL=$(grep "site:" astro.config.mjs | grep -o "https://[^'\"]*" | head -1)
SITE_NAME=$(echo "$SITE_URL" | sed 's|https://||' | sed 's/\..*//')

# 5. Update placeholder in AISearch.astro
echo "🔧 Customizing placeholder for $SITE_NAME..."
PLACEHOLDER="Ask anything... (e.g., \"best free $SITE_NAME tools\")"
sed -i "s|Ask anything.*\"|$PLACEHOLDER\"|" src/components/AISearch.astro

# 6. Check if BaseLayout.astro has AISearch
if grep -q "AISearch" src/layouts/BaseLayout.astro; then
  echo "✅ AISearch already in BaseLayout.astro"
else
  echo "⚠️  Adding AISearch to BaseLayout.astro..."
  # Add import at top
  sed -i "3i import AISearch from '../components/AISearch.astro';" src/layouts/BaseLayout.astro
  # Add component after <main> tag
  sed -i '/<main/a\      <AISearch />' src/layouts/BaseLayout.astro
fi

# 7. Verify astro.config.mjs has correct settings
echo "🔍 Verifying Astro config..."
if ! grep -q "output: 'server'" astro.config.mjs; then
  echo "❌ Error: astro.config.mjs missing 'output: server'"
  echo "   Please fix astro.config.mjs before continuing"
  exit 1
fi

if ! grep -q "@astrojs/vercel" astro.config.mjs; then
  echo "❌ Error: astro.config.mjs missing Vercel adapter"
  echo "   Please add: import vercel from '@astrojs/vercel';"
  echo "   and: adapter: vercel(),"
  exit 1
fi

# 8. Test build locally
echo "🧪 Testing build..."
if npm run build > /dev/null 2>&1; then
  echo "✅ Build successful!"
else
  echo "❌ Build failed! Check errors above"
  exit 1
fi

# 9. Git commit and push
echo "📤 Committing and pushing..."
git add src/pages/api/ai-search.ts src/components/AISearch.astro src/layouts/BaseLayout.astro
git commit -m "Add AI Search feature (DeepSeek V3 + Brave Search)"
BRANCH=$(git branch --show-current)
git push origin "$BRANCH"

echo ""
echo "✅ AI Search deployed to $SITE_DIR!"
echo ""
echo "📋 Next steps:"
echo "   1. Wait 2-3 minutes for Vercel deployment"
echo "   2. Test: curl -X POST \"$SITE_URL/api/ai-search\" -H \"Content-Type: application/json\" -d '{\"query\":\"test\"}'"
echo "   3. Visit site and try searching"
echo ""
