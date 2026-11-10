#!/bin/sh
# Install Temurin JDK 21 for EAS builds (Capacitor 8 needs Java 21; the EAS image only has Java 17).
set -e
JDK_DIR="$PWD/jdk-21"
if [ ! -x "$JDK_DIR/bin/javac" ]; then
  echo "Downloading Temurin JDK 21..."
  curl -fsSL -o /tmp/jdk-21.tar.gz "https://api.adoptium.net/v3/binary/latest/21/ga/linux/x64/jdk/hotspot/normal/eclipse"
  mkdir -p "$JDK_DIR"
  tar -xzf /tmp/jdk-21.tar.gz -C "$JDK_DIR" --strip-components=1
  rm -f /tmp/jdk-21.tar.gz
fi
"$JDK_DIR/bin/java" -version
# Point Gradle at this JDK (gradle.properties is read when Gradle starts, after this hook runs).
if ! grep -q "org.gradle.java.home" android/gradle.properties; then
  printf '\norg.gradle.java.home=%s\n' "$JDK_DIR" >> android/gradle.properties
fi
echo "Gradle will use: $JDK_DIR"
