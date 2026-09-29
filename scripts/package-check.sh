#!/usr/bin/env bash
# Packs lldlab-ui, installs the tarball into consumer-check/ (Next.js 16 + Tailwind v4) and builds it.
set -euo pipefail
cd "$(dirname "$0")/.."

npm run build
TARBALL="$(npm pack --silent | tail -n 1)"
trap 'rm -f "$TARBALL"' EXIT

cd consumer-check
rm -rf .next node_modules/lldlab-ui
npm install --no-audit --no-fund
npm install --no-save --no-audit --no-fund "../$TARBALL"
npx next build

CSS="$(find .next/static -name '*.css' -exec cat {} +)"
for cls in 'gap-space-md' 'md\:grid-cols-2' 'xl\:gap-space-2xl' 'bg-ink' 'text-display' 'bg-pattern-dots' '[data-theme=dark]' '--color-fg-danger'; do
  grep -qF -- "$cls" <<<"$CSS" || { echo "package-check: consumer CSS is missing: $cls" >&2; exit 1; }
done
grep -rqF 'Consumer check' .next/server/app || { echo 'package-check: page did not prerender' >&2; exit 1; }
echo 'package-check: OK'
