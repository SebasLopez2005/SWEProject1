#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."

if lsof -nP -iTCP:8081 -sTCP:LISTEN >/dev/null; then
  echo "Stop Metro on port 8081 before this test. It starts its own local cloud bundle." >&2
  exit 1
fi

gateway=supabase_kong_chatgpt
docker inspect --format '{{.State.Running}}' "$gateway" | grep -qx true
config="$(npx --yes supabase@3.0.0 status -o json 2>/dev/null)"
url="$(node -pe 'JSON.parse(require("node:fs").readFileSync(0,"utf8")).API_URL' <<< "$config")"
key="$(node -pe 'JSON.parse(require("node:fs").readFileSync(0,"utf8")).PUBLISHABLE_KEY' <<< "$config")"
unset config
if [[ "$url" != "http://127.0.0.1:54321" || -z "$key" || "$key" == undefined ]]; then
  echo "This test requires the disposable local Supabase stack on port 54321." >&2
  exit 1
fi

logs="$(mktemp -d "${TMPDIR:-/tmp}/workout-ios-cloud.XXXXXX")"
echo "Xcode and Metro logs are in $logs"
EXPO_NO_DOTENV=1 EXPO_PUBLIC_SUPABASE_URL="$url" EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY="$key" CI=1   node node_modules/expo/bin/cli start --localhost > "$logs/metro.log" 2>&1 &
metro=$!
paused=0
cleanup() {
  if (( paused )); then docker start "$gateway" >/dev/null; fi
  kill "$metro" 2>/dev/null || true
}
trap cleanup EXIT
for ((i = 0; i < 60; i++)); do
  if curl -fsS http://127.0.0.1:8081/status >/dev/null 2>&1; then break; fi
  sleep 1
done
curl -fsS http://127.0.0.1:8081/status >/dev/null

TEST_RUNNER_FITNESS_NATIVE_CLOUD=1 bash scripts/ios.sh test "${1:-booted}"   -only-testing:WorkoutLogUITests/WorkoutLogUITests/testCloudUploadAfterBackendOutage > "$logs/xcode.log" 2>&1 &
runner=$!
outage=0
reconnect=0
while kill -0 "$runner" 2>/dev/null; do
  if (( !outage )) && grep -qx FITNESS_CLOUD_STOP_GATEWAY "$logs/xcode.log"; then
    docker stop -t 0 "$gateway" >/dev/null
    paused=1
    outage=1
    echo "Local API gateway stopped."
  fi
  if (( paused )) && grep -qx FITNESS_CLOUD_START_GATEWAY "$logs/xcode.log"; then
    docker start "$gateway" >/dev/null
    paused=0
    reconnect=1
    echo "Local API gateway restarted."
  fi
  sleep 1
done
if ! wait "$runner" || (( !outage || !reconnect )); then
  tail -n 65 "$logs/xcode.log"
  exit 1
fi
tail -n 16 "$logs/xcode.log"
