# Manual Test Cases

These checks use a Firebase development project or the Firebase Emulator Suite. The fixture in [sample-data/telemetry.json](sample-data/telemetry.json) documents the schema only; the app never imports it or treats it as live data. When testing the live UI, use current epoch-millisecond timestamps or the website will correctly mark the reading stale.

| ID | Setup / action | Expected result |
| --- | --- | --- |
| WEB-01 | Start the app with valid Firebase environment values and sign in using an Email/Password account. | The authenticated session loads; no credentials are printed in the browser. |
| WEB-02 | Write only `devices/gasguard-001/sensors/gas` with a finite `value` and current `timestamp`. | Gas card and gas row show the reading; other sensor cards/rows show unavailable. No graph is populated with zero placeholders. |
| WEB-03 | Write only temperature and humidity nodes with valid timestamps. | Temperature and humidity display; gas, smoke, and flame remain unavailable. |
| WEB-04 | Write flame `{ "detected": false, "timestamp": <now> }`. | Flame shows clear. A false boolean is treated as a valid reading. |
| WEB-05 | Write a reading without a timestamp, with a zero timestamp, or with a non-finite/non-numeric value. | That sensor is not shown as live. |
| WEB-06 | Stop refreshing one sensor while continuing to update another. | After 60 seconds, the stale sensor changes to unavailable while the refreshed sensor remains visible. |
| WEB-07 | Write all five valid sensors with timestamps within 10 seconds of one another and continue updating. | Complete telemetry history is recorded and charts can render. |
| WEB-08 | Try to open the valve with any of gas, smoke, flame, or temperature unavailable/stale. | Browser blocks the command and explains that fresh safety readings are needed. |
| WEB-09 | With all required safety readings fresh, test gas/smoke/flame/temperature at and above configured thresholds. | Valve-open command is rejected when any applicable hazard/interlock is active. |
| WEB-10 | Sign out and attempt database access with rules requiring authentication. | Firebase rejects unauthenticated access. |
| FW-01 | Set only the enable flag(s) for physically connected MQ/flame modules; connect DHT22; power on and inspect Serial Monitor. | Firmware logs readings, waits for NTP, and writes only configured sensors with valid timestamps. |
| FW-02 | Disconnect or disable DHT22 while MQ/flame sensors are enabled. | Available MQ/flame readings continue to publish; temperature and humidity are omitted. |
| FW-03 | Disconnect Wi-Fi or use an invalid Firebase test account. | No successful telemetry sync is reported; Serial Monitor shows the connection/authentication failure. |
| FW-04 | Send actuator states through the website with loads disconnected. | ESP32 applies outputs according to configured relay polarity and reports actual states; rejected valve-open commands are returned as closed. |

## Local checks

```sh
npm run lint
npm run build
```

Hardware checks must be performed with low-voltage/isolated test loads first. Never use these checks as a substitute for certified fire/gas protection or a qualified review of mains and actuator wiring.
