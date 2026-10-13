<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/cd00d78f-749e-4318-a58e-bd5a445ac811

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Firebase Setup

The web client uses the Firebase project configured in `src/firebase/firebase.ts`.
Before signing in, enable **Email/Password** under Firebase Authentication and create
the project's default Cloud Firestore database. Paste `firestore.rules` into the
Firestore **Rules** tab in Firebase Console and publish it so only signed-in users
can access device data.

Actuator state is stored at `actuators/current` in Cloud Firestore. Live sensor
telemetry is read from `devices/sanketseva-001` using the fields in
`firebase-blueprint.json`; saved safety thresholds and cutoff switches are merged
into that document's `safety` field. If the ESP32 also uses Realtime Database, configure the
exact database URL shown in Firebase Console in `src/firebase/firebase.ts`, then
publish `database.rules.json` from the Realtime Database Rules page. The web app
writes partial actuator updates to both databases when Realtime Database is
configured and reachable.
