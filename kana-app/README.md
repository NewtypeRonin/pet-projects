# Kana Match

A lightweight offline kana trainer for hiragana and katakana practice.

## Features

- Mixed, hiragana, or katakana modes
- User types the pronunciation for each kana
- Tracks correct answers vs total attempts
- Repeats mistakes more often so weak kana return sooner
- Uses multiple Japanese font stacks to make recognition harder in real-world conditions
- Works offline as a Progressive Web App (PWA)

## Run locally

From this folder, run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## How to get it on a phone

This app is a web app that behaves like an offline app after installation. It is not an APK by itself, but it can still be installed on Android as a home-screen app.

### Option 1: easiest path on Android

1. Put the project on a machine that can host a local web page.
2. Start the local server:

```bash
python -m http.server 8000
```

3. On the phone, connect to the same Wi-Fi network as that machine.
4. Open the phone browser and visit the local URL, for example:

```text
http://<computer-ip>:8000
```

5. In Chrome or Samsung Internet, tap the browser menu.
6. Choose "Add to Home screen" or "Install app".
7. Confirm the install.
8. The app icon will appear like a normal app and it can still work while offline after the initial load.

> Important: the first time still needs internet access so the browser can cache the app files. After that, the app can open without signal.

### Option 2: share via GitHub Pages or a static host

If you want a cleaner sharing flow, host the app files on a static host such as GitHub Pages or any basic web host.

1. Push the project to a GitHub repo.
2. Enable GitHub Pages for the repo.
3. Share the Pages URL to the phone.
4. On the phone, open the URL and install it to the home screen.
5. Once installed, it can keep working offline.

### Option 3: easier for a friend to test

If you want the simplest path for someone else:

- zip the project folder
- upload it to GitHub or a shared drive
- tell them to open the hosted URL on their phone
- then tap "Add to Home screen"

## Notes on offline behavior

This is a PWA, not a native Android app. That means:

- it behaves like an app on the home screen
- it can work offline after the first install/load
- it is not a packaged APK unless you later wrap it with Capacitor or another Android toolchain

## For a future native Android version

If you want a true Android app later, the next step would be to wrap this same app using Capacitor and convert it to an APK/AAB. The app logic and UI can stay almost the same; only the packaging changes.
