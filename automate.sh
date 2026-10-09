#!/usr/bin/env bash
set -e

COMMIT_MSG="${1:-Master Developer Automation: Synchronize build, workflows, and SKUs}"
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%SZ")

echo "======================================================================"
echo " 🤖 DON'S GROUNDED AI EMPIRE - MASTER DEVELOPER AUTOMATION ENGINE"
echo "======================================================================"
echo " ⏰ Started: $TIMESTAMP"
echo " 📦 Repository: dondonaldson800/Dons-grounded-AI-Emerg"
echo " 💬 Message: $COMMIT_MSG"
echo "----------------------------------------------------------------------"

# 1. Web Compilation Check
echo "[1/4] 🚀 Compiling Web Production Bundle..."
npm run build

# 2. SKU Registry Check
echo "[2/4] 📋 Verifying Store SKU Manifest..."
if [ -f "export_all_store_skus.json" ]; then
  node -e "const d = require('./export_all_store_skus.json'); console.log('       ✅ SKU Registry Validated: ' + d.project);"
fi

# 3. Stage All Workflows & Code
echo "[3/4] 📦 Staging Changes & Workflows..."
git add -A

# Check if there are changes to commit
if git diff-index --quiet HEAD --; then
  echo "       ℹ️ No new code changes detected to commit."
else
  git commit -m "$COMMIT_MSG ($TIMESTAMP)"
  echo "       ✅ Committed cleanly."
fi

# 4. Push to GitHub
echo "[4/4] 🌐 Pushing to GitHub (origin main)..."
git push origin main

echo "======================================================================"
echo " 🚀 SUCCESS: WORKFLOW PIPELINE TRIGGERED!"
echo "======================================================================"
echo " GitHub Actions will automatically:"
echo "   1. Compile and validate project health"
echo "   2. Build Universal Android APK (Amazon Appstore & direct testing)"
echo "   3. Build Android App Bundle AAB (Google Play & Samsung Galaxy Store)"
echo "   4. Upload ready-to-download binaries in GitHub Actions Summary!"
echo ""
echo " View Live Progress & Download Artifacts:"
echo " 👉 https://github.com/dondonaldson800/Dons-grounded-AI-Emerg/actions"
echo "======================================================================"
