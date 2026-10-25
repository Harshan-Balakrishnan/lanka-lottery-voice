# Native Android prototype

This is a separate native Android app using Kotlin and Android XML Views. It is not a WebView wrapper and does not use Jetpack Compose.

## Requirements
- JDK 17
- Android SDK Platform 35
- Android Gradle Plugin 8.7.3
- Gradle 8.9
- A network connection for the first dependency resolution

## Build
Open this directory (`apps/android`) in Android Studio and sync Gradle. From a terminal with Gradle 8.9 available:

```bash
gradle assembleDebug
```

The debug APK is generated under `app/build/outputs/apk/debug/`.

## Current capabilities
- Native board selector, manual ticket fields and confirmation.
- In-app English/Sinhala/Tamil language selector backed by Android string resources.
- Gallery selection and system-camera capture to a temporary cache file.
- Downsampled local image preview and remove-photo action.
- Optional Android text-to-speech with runtime locale availability checks and stop control.
- Links to official NLB and DLB sites.

## Deliberate limitations
- No OCR, network API, live result retrieval, matching rules, user account or ticket-image upload.
- The app does not claim a win or loss.
- Camera access is delegated to the installed system camera app; this app does not request direct camera permission. Gallery selection is user initiated.
- Camera captures are written to the app cache and deleted when discarded or when the activity finishes. Gallery images are read from the user-selected URI and are not copied to app storage.
- Sinhala/Tamil text is an initial draft and needs fluent human review before release.
- A Gradle wrapper is not included yet; the CI workflow installs Gradle 8.9 and successfully assembled a debug APK on 2026-10-25 (workflow run 36). The artifact is available from the repository Actions run for 14 days. Add a verified wrapper from a network-enabled development environment before distributing source as a standalone project.
