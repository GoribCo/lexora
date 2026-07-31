#!/bin/bash
set -e

cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

# Port is set in src/config.ts → dev.port
npm run dev -- --port 3010
