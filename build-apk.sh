#!/bin/bash
set -e

echo "=========================================================="
echo " 📦 BUILDING ANDROID APK (UNIVERSAL FOR AMAZON & TESTING) "
echo "=========================================================="
echo ""

# Check EAS CLI
if ! command -v eas &> /dev/null; then
    echo "[+] Installing EAS CLI..."
    npm install -g eas-cli
fi

echo "[+] Target: Universal Android APK (.apk)"
echo "[+] Stores: Amazon Appstore (Fire Tablets), direct sideload, test devices"
echo ""

# Choose cloud or local
if [ "$1" == "--local" ]; then
    echo "[+] Running local APK build..."
    eas build --platform android --profile amazon --local
else
    echo "[+] Running cloud EAS build for APK..."
    eas build --platform android --profile amazon
fi

echo ""
echo "=========================================================="
echo " ✅ APK BUILD COMPLETE!"
echo "=========================================================="
