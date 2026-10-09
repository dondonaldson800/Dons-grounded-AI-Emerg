#!/bin/bash

echo "======================================================"
echo " 🚀 DON'S GROUNDED AI EMPIRE - ONE-CLICK BUILD SCRIPT "
echo "======================================================"
echo "Initializing Chromebook Linux Environment..."

# 1. Check and install EAS CLI if missing
if ! command -v eas &> /dev/null; then
    echo "[+] EAS CLI not found. Installing..."
    npm install -g eas-cli
else
    echo "[✓] EAS CLI is ready."
fi

# 2. Check and install Firebase CLI if missing
if ! command -v firebase &> /dev/null; then
    echo "[+] Firebase CLI not found. Installing..."
    npm install -g firebase-tools
else
    echo "[✓] Firebase CLI is ready."
fi

# 3. Link Firebase Project
echo "[+] Linking Firebase Project (donss-new-empire--250221-84f89)..."
firebase use donss-new-empire--250221-84f89

# 4. Ensure dependencies are installed
echo "[+] Installing project dependencies..."
npm install

# 5. Start the Local Build
echo "======================================================"
echo " ⚙️ STARTING LOCAL APK BUILD (This uses your Chromebook's power)"
echo "======================================================"
eas build --platform android --profile preview --local

echo "======================================================"
echo " ✅ BUILD PROCESS COMPLETE!"
echo " Look for the generated .apk file in your project folder."
echo "======================================================"
