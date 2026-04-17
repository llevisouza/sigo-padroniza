#!/usr/bin/env bash
set -euo pipefail

REMOTE_URL="https://github.com/llevisouza/sigo-padroniza-desktop-java.git"
BRANCH="main"

if ! git remote | grep -q '^origin$'; then
  git remote add origin "$REMOTE_URL"
else
  git remote set-url origin "$REMOTE_URL"
fi

git push -u origin HEAD:"$BRANCH"
