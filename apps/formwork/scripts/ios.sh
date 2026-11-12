#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
export ENTERPRISE_REPOSITORY="${ENTERPRISE_REPOSITORY:-https://repo.reactnative.dev/maven2}"
export RCT_NO_LAUNCH_PACKAGER=1
if [[ "$PWD" == *' '* ]]; then
  stage="$(mktemp -d /tmp/formwork-ios.XXXXXX)"
  echo "Building in $stage to avoid CocoaPods path encoding errors."
  rsync -a --exclude '/.git' --exclude '/node_modules' --exclude '/ios' --exclude '/android' --exclude '/dist' --exclude '/.expo' --exclude '/supabase/.temp' ./ "$stage/"
  cd "$stage"
  npm ci
fi
npx expo run:ios "$@"
