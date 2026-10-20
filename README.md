# Sanketseva

Sanketseva is a web dashboard and ESP32 prototype for monitoring kitchen safety sensors and controlling connected actuators. The web client displays available live sensor readings, charts complete telemetry samples, and sends actuator commands through Firebase Realtime Database.

**Repository:** [github.com/GitzAyu/Sanketseva](https://github.com/GitzAyu/Sanketseva)  
**Live preview:** [sanketseva.pages.dev](https://sanketseva.pages.dev/)

## Project checklist

- [x] Setup steps and environment variable template: this README and [.env.example](.env.example)
- [x] Technical design and architecture diagrams: [docs/TECHNICAL_DESIGN.md](docs/TECHNICAL_DESIGN.md)
- [x] Sample data and test cases: [docs/sample-data/telemetry.json](docs/sample-data/telemetry.json) and [docs/TEST_CASES.md](docs/TEST_CASES.md)
- [x] License: [MIT License](LICENSE)

## Requirements

- Node.js 20 or newer and npm
- A Firebase project with Email/Password Authentication and Realtime Database enabled
- Arduino IDE and an ESP32 DevKit for hardware use; see [firmware/README.md](firmware/README.md)

## Run locally

```sh
npm ci
```

Copy `.env.example` to `.env.local` and set the Firebase web app values. Firebase web API keys identify the web app; database access is controlled by Firebase Authentication and security rules. Do not put Firebase user passwords, service account keys, or Wi-Fi passwords in Vite variables.

```sh
cp .env.example .env.local
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:3000`). For PowerShell, use `Copy-Item .env.example .env.local` instead of `cp` if needed.

## Firebase setup

1. In Firebase Console, enable **Authentication → Email/Password** and create an operator account.
2. Enable Realtime Database. Publish [`database.rules.json`](database.rules.json); its current rules require an authenticated user for reads and writes.
3. Publish [`firestore.rules`](firestore.rules) to Cloud Firestore if you use the Firestore features.
4. Configure the same Firebase web app settings in `.env.local` and Cloudflare Pages environment variables. Set `VITE_DEVICE_ID` to the device identifier used by the ESP32 (default `gasguard-001`).
5. For hardware, create a separate Firebase Authentication account for the ESP32 and put its credentials plus Wi-Fi credentials in the ignored local `firmware/secrets.h` file. Never use the operator's password in firmware. See the firmware guide for wiring and sensor enable flags.

The web app and firmware share this Realtime Database schema:

```text
devices/{deviceId}/sensors/{gas,smoke,temperature,humidity,flame}
devices/{deviceId}/actuators/{valve,powerCut,fan,buzzer,extinguisher}
devices/{deviceId}/commands/{actuator}
devices/{deviceId}/safety
```

Only sensor entries with valid timestamps are treated as live. See the sample file for the expected field shape. Fixture data is documentation/testing material and is never loaded as website telemetry.

## Commands

```sh
npm run dev       # local development server
npm run lint      # TypeScript type check
npm run build     # production build into dist/
npm run preview   # preview the production build locally
```

## Deploy to Cloudflare Pages

Connect the Git repository to Cloudflare Pages and use:

- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/` (repository root)
- Environment variables: the `VITE_FIREBASE_*` values and `VITE_DEVICE_ID` from `.env.example`

Set variables for both Preview and Production deployments, then redeploy after changing them. The client-side Firebase configuration is bundled into the site; authentication and database rules must protect data access.

## Project documentation

- [Technical design](docs/TECHNICAL_DESIGN.md)
- [Manual test cases](docs/TEST_CASES.md)
- [Documentary sample telemetry](docs/sample-data/telemetry.json)
- [ESP32 firmware setup and safety notes](firmware/README.md)
- [License](LICENSE)

## Prototype note

This is a prototype integration, not certified life-safety equipment. Sensor thresholds require calibration for the specific hardware and location. Test with actuators disconnected before connecting loads, and retain independent certified alarms and manual isolation.
