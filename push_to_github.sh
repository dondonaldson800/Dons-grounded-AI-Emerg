#!/usr/bin/env bash
set -e

REPO_SLUG="dondonaldson800/Dons-grounded-AI-Emerg"

if [ -n "$1" ]; then
  TOKEN="$1"
  echo "Pushing to https://github.com/${REPO_SLUG}.git with token..."
  git push "https://${TOKEN}@github.com/${REPO_SLUG}.git" main
  echo "Successfully pushed to GitHub!"
else
  echo "Usage: ./push_to_github.sh <GITHUB_PERSONAL_ACCESS_TOKEN>"
  echo ""
  echo "Generate a token at: https://github.com/settings/tokens"
  echo "Scope needed: 'repo'"
fi
