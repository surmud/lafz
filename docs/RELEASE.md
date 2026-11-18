# Releasing Lafz to the App Store and Google Play

The mobile apps are the same static site wrapped in [Capacitor](https://capacitorjs.com) 8. Every page,
every audio clip and the fonts are bundled, so the app works offline from first launch.

| | |
|---|---|
| App id / bundle id | `app.lafz` (iOS and Android). Changing it later means a new store listing, so decide before the first upload. |
| App name | Lafz |
| Native web build | `npm run build:native` (static export without the `/lafz` base path, into `native-www/`, then `cap sync`) |
| Icons and splash | `native-assets/` → `npm run native:assets` (already generated and committed) |
| iOS devices | iPhone only (`TARGETED_DEVICE_FAMILY = 1`), so no iPad screenshots are needed |
| Minimum OS | iOS 15, Android 7 (API 24), the Capacitor 8 defaults |
| Store screenshots | `npm run build && STORE=1 npx playwright test e2e/store.spec.ts --project=iphone` → `store/screenshots/` (6.9", 6.5", Android phone) |

## What differs in the app builds
- **No tip jar.** Apple guideline 3.1.1 and Google Play's payments policy require in-app purchase for
  tips, so `NEXT_PUBLIC_NATIVE=1` hides "Buy me a chai". IAP tips are a later backlog item.
- **No service worker or "download for offline"**: content is already in the bundle.
- **Accounts are off until native OAuth is wired.** Google refuses OAuth inside embedded web views
  ("disallowed_useragent"). Before setting `NEXT_PUBLIC_NATIVE_AUTH=1`: open the Supabase OAuth URL with
  `@capacitor/browser`, register the `app.lafz://auth` deep link (iOS URL type, Android intent filter),
  add it to Supabase's redirect URLs, and finish the session from the deep link with
  `supabase.auth.exchangeCodeForSession`. **Sign in with Apple is mandatory on iOS once Google sign-in is
  offered** (guideline 4.8): enable the Apple provider in Supabase and set `NEXT_PUBLIC_APPLE_SIGNIN=1`.
- **Android back button** goes back a page, or leaves the app from home (`src/lib/native.ts`).
- **Microphone**: iOS `NSMicrophoneUsageDescription` and Android `RECORD_AUDIO` are declared. Speech
  recognition in the iOS web view uses the on-device Whisper fallback (Web Speech isn't available there).

## Build and run locally
```bash
npm run build:native
npx cap open ios        # Xcode: pick a simulator, Run
npx cap open android    # Android Studio (needs the Android SDK; not installed on the build Mac yet)
```
Verified 2026-11-18: the iOS app builds and runs in the iPhone 17 Pro simulator (Xcode 26.3), with the
safe areas correct and content loading offline. Note: this simulator runtime draws every colour emoji as
a "?" box, in Safari and other sites too. That's a simulator issue, not the app; check emoji on a real device.

## iOS: TestFlight → App Store
1. **Apple Developer Program** ($99/year) in the founder's name or company. Note the Team ID.
2. Xcode → App target → Signing & Capabilities: choose the team, bundle id `app.lafz`, automatic signing.
3. App Store Connect → My Apps → **+** → New App: iOS, name "Lafz", primary language English (UK or US),
   bundle id `app.lafz`, SKU `lafz-ios`.
4. Bump `CFBundleShortVersionString`/`CFBundleVersion` (Xcode General tab), then Product → Archive →
   Distribute App → App Store Connect → Upload.
5. **TestFlight**: add internal testers (up to 100, no review); external testers need a short beta review.
6. **App Store listing**: subtitle ("Speak, understand and read Urdu"), description, keywords (urdu,
   learn urdu, pakistani, hindustani, roman urdu, nastaliq), support URL (the GitHub repo or a contact
   page), **privacy policy URL `https://surmud.github.io/lafz/privacy/`**, screenshots from
   `store/screenshots/ios-6.9in-1320x2868` (6.5" is optional now).
7. **Age rating: 13+.** Questionnaire answers: no violence, no sexual content, no profanity beyond
   mild ("crude humour: none/infrequent mild"), no gambling, no drugs, no horror, no medical treatment
   info, no user-generated content, no unrestricted web access, no messaging between users. Apple would
   likely compute 4+ or 9+ from these answers; set the **age rating override to 13+** as the founder chose.
8. **App Privacy ("nutrition labels")**, as shipped:
   - Signed out, statistics off (the default): **Data Not Collected**.
   - If accounts are switched on: *Contact Info → Email address* (from Google/Apple sign-in) and
     *User Content → Other user content* (learning progress), both **linked to the user**, used for
     **App Functionality** only, **not** used for tracking.
   - If anonymous statistics are switched on: *Usage Data → Product interaction* and *Identifiers →
     Device ID* (a random install id), **not linked** to the user, used for **Analytics**, not tracking.
   - Audio recordings: not collected (they never leave the device).
9. **Review notes**: "No login required; the app is fully usable signed out. Account creation is
   optional and can be deleted in-app at Me → Account → Delete account and data. Microphone is used only
   for speaking practice; recordings stay on device."
10. Submit for review. Typical first review: 1–3 days.

## Android: internal → closed → production
1. **Google Play Console** account ($25 one-off). New **personal** accounts must run a **closed test with
   at least 12 testers for 14 consecutive days** before applying for production access. An
   organisation account (D-U-N-S number) skips this.
2. Install **Android Studio** (bundles the SDK and an emulator), then `npx cap open android`.
3. Create an upload key: Build → Generate Signed App Bundle → new keystore. **Back up the keystore and
   passwords**; enrol in Play App Signing so Google holds the app signing key.
4. Bump `versionCode` and `versionName` in `android/app/build.gradle`. Build the release **.aab**.
5. Play Console → Create app: name Lafz, app (not game), free, declarations.
6. **Internal testing** track: upload the .aab, add up to 100 testers by email, share the opt-in link.
7. **Closed testing** track: at least 12 opted-in testers, kept for 14 days (personal accounts). Ask
   family: they're the target users anyway.
8. **Store listing**: short description (80 chars: "Speak, understand and read Urdu. Free, no ads,
   works offline."), full description, icon 512×512 (`native-assets/icon-only.png` resized), feature
   graphic 1024×500 (to make), phone screenshots from `store/screenshots/android-phone-1080x2400`.
9. **Data safety** form (as shipped):
   - Default (signed out, no statistics): "No data collected", "No data shared".
   - With accounts: *Personal info → Email address* and *App activity → Other actions* (progress):
     collected, not shared, **required only if you sign in** (optional), processed for app
     functionality and account management, encrypted in transit, **users can request deletion**
     (in-app and at `https://surmud.github.io/lafz/delete-account/`).
   - With statistics: *App activity → App interactions* and *Device or other IDs* (random install id):
     collected, not shared, optional, analytics.
   - Audio: not collected.
10. **Content rating** (IARC questionnaire): category "Reference, News, or Educational"; answer **No** to
    violence, sexuality, language, controlled substances, gambling, user interaction/communication,
    sharing location, digital purchases. Expected ratings: PEGI 3 / ESRB Everyone. (Play has no 13+
    override; the 13+ intent is reflected in the privacy policy and target audience below.)
11. **Target audience**: 13 and over. Not designed for children; no ads.
12. **Account deletion URL** (required when accounts exist): `https://surmud.github.io/lafz/delete-account/`.
13. After 14 days of closed testing: apply for production access, then roll out (start at 20%).

## Before each release
- `npm run check`, `npx playwright test`, `npm run build:native`, run on a real iPhone and Android phone.
- Re-take store screenshots if the UI changed.
- Update `docs/RELEASE.md` with anything that surprised you.
