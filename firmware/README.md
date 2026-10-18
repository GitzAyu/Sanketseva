# SanketSeva ESP32 firmware

`SanketSevaESP32.ino` is the starting firmware for an ESP32 DevKit. It reads MQ-6 gas, MQ-2 smoke, a digital flame detector, and a DHT22, then syncs sensor values and actuator commands with the website's Realtime Database paths for device `gasguard-001`.

## Before uploading

1. Install Arduino IDE and Espressif's `esp32` board package. Select the board that matches your ESP32 DevKit.
2. Install these Arduino libraries from Library Manager:
   - `FirebaseClient` by Mobizt
   - `ArduinoJson` version 7
   - `DHT sensor library` by Adafruit
   - `Adafruit Unified Sensor`
3. In Firebase Authentication, create a dedicated Email/Password account for the ESP32. The Realtime Database rules in this project require an authenticated user. Copy `secrets.example.h` to `secrets.h` in the firmware folder and enter the Wi-Fi and dedicated device-account credentials. `secrets.h` is ignored by Git. The Firebase Web API key is configured in the sketch.
4. Check the GPIO assignments and relay polarity at the top of the sketch against your actual wiring.
5. Upload and open Serial Monitor at `115200` baud.

Firebase's current Arduino client is [FirebaseClient](https://github.com/mobizt/FirebaseClient); its examples show the user authentication and Realtime Database setup used here. The project's configured database URL is `https://gasgaurd-e6009-default-rtdb.firebaseio.com`.

## Default example GPIO map

| Part | ESP32 GPIO |
| --- | ---: |
| MQ-6 analog output | 34 |
| MQ-2 analog output | 35 |
| Flame digital output | 27 |
| DHT22 data | 4 |
| Gas valve relay input | 16 |
| Mains contactor relay input | 17 |
| Exhaust fan relay input | 18 |
| Buzzer relay input | 19 |
| Extinguisher relay input | 23 |

These are example assignments, not a wiring plan for every board or module. Confirm pin availability, the module's output type, and active-high/active-low behavior before connecting loads. Relay inputs default to active-low in the sketch. Never drive a valve, mains circuit, motor, pump, or extinguisher directly from an ESP32 GPIO. Use correctly rated isolated driver hardware. Mains installation must be done by a qualified electrician.

MQ sensor boards are often powered from 5 V and may produce an analog output above 3.3 V. Use a suitable voltage divider or level interface so the ESP32 ADC pin never receives more than 3.3 V. GPIO 34 and 35 are ADC inputs on common ESP32 DevKit boards.

At the top of the sketch, set `SENSOR_MQ6_ENABLED`, `SENSOR_MQ2_ENABLED`, and `SENSOR_FLAME_ENABLED` to `true` only for modules that are physically connected and wired. GPIO readings cannot reliably identify an unplugged module, so these flags prevent unconnected pins from being shown as sensor data. Temperature and humidity are published only when the DHT22 returns a valid reading.

## Realtime Database shape

The sketch writes genuine readings under:

```text
/devices/gasguard-001/sensors/{gas,smoke,temperature,humidity,flame}
```

It polls and applies the site's existing actuator strings under:

```text
/devices/gasguard-001/actuators/{valve,powerCut,fan,buzzer,extinguisher}
```

Valve values are `OPEN` / `CLOSED`; the other actuator values are `ON` / `OFF`. `powerCut: ON` means the site's mains power state is on. Sensor timestamps are Unix epoch milliseconds, which the website uses to determine whether the device is online. The sketch waits for NTP time before publishing each configured, available reading; the 60-second warmup only blocks gas-valve opening. It does not generate demo readings. Missing or disabled sensor entries are omitted; the website displays available sensors independently and clears stale readings.

MQ values in this example are scaled raw ADC counts (0–1023), not calibrated gas concentrations in ppm. Calibrate the sensor modules against their datasheets and known reference conditions before relying on thresholds. The website currently labels smoke values as ppm, so that display label/threshold must be changed or the firmware must be extended with a validated ppm conversion before treating it as ppm.

## Safety behavior and limits

- At boot, the sketch closes the valve and turns mains power off.
- It rejects a gas-valve open command until warmup is complete, DHT data is fresh, and configured danger conditions are absent.
- Gas danger, smoke danger, flame, over-temperature, or emergency settings trigger local interlocks; stale DHT data closes an already-open valve.
- Thresholds and warmup duration are starter values. MQ sensors need proper burn-in, calibration, enclosure/airflow testing, and installation-specific thresholds.
- `setInsecure()` is included to make first bench connection simpler, but it does not validate Firebase's TLS certificate. Replace it with trusted root CA validation before putting the controller on an untrusted network or using it for safety-critical control.
- This sketch is a prototype integration example, not certified life-safety firmware. Keep independent certified gas/fire protection and manual isolation available. Test with actuators disconnected before connecting real loads.

If Firebase authentication fails, verify that Email/Password sign-in is enabled, the dedicated device user exists, the API key is correct, and the deployed Realtime Database rules permit authenticated access.
