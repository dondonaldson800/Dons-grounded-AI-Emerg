#!/bin/bash
set -e

echo "=========================================================="
echo " 📦 BUILDING ANDROID AAB (APP BUNDLE FOR SAMSUNG & GOOGLE) "
echo "=========================================================="
echo ""

# Check EAS CLI
if ! command -v eas &> /dev/null; then
    echo "[+] Installing EAS CLI..."
    npm install -g eas-cli
fi

echo "[+] Target: Android App Bundle (.aab)"
echo "[+] Stores: Samsung Galaxy Store Seller Portal & Google Play Console"
echo "[+] Package: com.donsempire.groundedai"
echo ""

# Choose cloud or local
if [ "$1" == "--local" ]; then
    echo "[+] Running local AAB build for Samsung..."
    eas build --platform android --profile samsung --local
else
    echo "[+] Running cloud EAS build for Samsung & Google Play AAB..."
    eas build --platform android --profile samsung
fi

echo ""
echo "=========================================================="
echo " ✅ AAB BUILD COMPLETE!"
echo "=========================================================="
