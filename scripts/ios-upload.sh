#!/usr/bin/env bash
# Build, archive and upload Lafz iOS to App Store Connect (TestFlight).
#
#   APPLE_TEAM_ID=XXXXXXXXXX npm run ios:archive    # build + archive only (no upload)
#   APPLE_TEAM_ID=XXXXXXXXXX npm run ios:upload     # build + archive + upload
#
# Needs: Xcode signed in to the Apple ID of that team (Xcode → Settings → Accounts), and an App Store
# Connect app record for bundle id app.lafz. -allowProvisioningUpdates lets Xcode create/refresh the
# signing certificate and App Store provisioning profile for app.lafz.
# Bump the build number for every upload:  BUILD=2 APPLE_TEAM_ID=… npm run ios:upload
set -euo pipefail
cd "$(dirname "$0")/.."
: "${APPLE_TEAM_ID:?set APPLE_TEAM_ID to your 10-character Apple team id}"
MODE="${1:-upload}"
BUILD="${BUILD:-$(date +%Y%m%d%H%M)}"
ARCHIVE="ios/App/build/Lafz.xcarchive"

npm run build:native
rm -rf "$ARCHIVE"
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Release \
  -destination 'generic/platform=iOS' -archivePath "$ARCHIVE" \
  DEVELOPMENT_TEAM="$APPLE_TEAM_ID" CODE_SIGN_STYLE=Automatic CURRENT_PROJECT_VERSION="$BUILD" \
  -allowProvisioningUpdates archive

if [ "$MODE" = "upload" ]; then
  xcodebuild -exportArchive -archivePath "$ARCHIVE" -exportOptionsPlist ios/ExportOptions.plist \
    -exportPath ios/App/build/export DEVELOPMENT_TEAM="$APPLE_TEAM_ID" -allowProvisioningUpdates
  echo "Uploaded build $BUILD. It appears in App Store Connect → TestFlight after processing (10–30 min)."
else
  echo "Archived build $BUILD at $ARCHIVE (not uploaded)."
fi
