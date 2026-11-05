#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."

mode="${1:-run}"
device="${2:-booted}"
if [[ "$device" == booted ]]; then
  device="$(xcrun simctl list devices booted -j | node -e '
    const data = JSON.parse(require("node:fs").readFileSync(0, "utf8"));
    const devices = Object.values(data.devices).flat().filter(d => d.state === "Booted");
    if (devices.length !== 1) {
      console.error("Boot one iOS simulator or pass its device UUID as the second script argument.");
      process.exit(1);
    }
    console.log(devices[0].udid);
  ')"
fi
if [[ ! -f ios/FitnessWorkoutLog.xcworkspace/contents.xcworkspacedata ]]; then
  npx expo prebuild --platform ios
fi
derived="${FITNESS_IOS_DERIVED_DATA:-$PWD/ios/build/workout-log}"
args=(-workspace ios/FitnessWorkoutLog.xcworkspace
  -destination "platform=iOS Simulator,id=$device" -derivedDataPath "$derived")
if (( $# > 2 )); then args+=("${@:3}"); fi
case "$mode" in
  run)
    xcodebuild "${args[@]}" -scheme FitnessWorkoutLog build
    xcrun simctl install "$device" "$derived/Build/Products/Debug-iphonesimulator/FitnessWorkoutLog.app"
    xcrun simctl launch "$device" edu.cs3365.fitnessworkoutlog
    ;;
  test)
    if ruby -e 'require "xcodeproj"' 2>/dev/null; then
      ruby tests/ios/install.rb
    else
      GEM_HOME="$(brew --prefix cocoapods)/libexec" "$(brew --prefix ruby)/bin/ruby" tests/ios/install.rb
    fi
    xcodebuild "${args[@]}" -scheme WorkoutLogUITests -parallel-testing-enabled NO test
    ;;
  *) echo "Use run or test." >&2; exit 2 ;;
esac
