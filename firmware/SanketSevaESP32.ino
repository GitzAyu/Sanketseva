/*
 * Sanketseva ESP32 firmware
 *
 * Realtime Database schema used by the website:
 *   devices/gasguard-001/sensors/{gas,smoke,temperature,humidity,flame}
 *   devices/gasguard-001/actuators/{valve,powerCut,fan,buzzer,extinguisher}
 *
 * IMPORTANT:
 * - Copy firmware/secrets.example.h to firmware/secrets.h and fill in Wi-Fi and a dedicated Firebase Email/Password device account.
 * - Confirm every GPIO and relay polarity against your actual board/module.
 * - MQ analog output must never exceed the ESP32 ADC input limit (3.3 V).
 * - Do not connect ESP32 pins directly to mains voltage, a gas valve, or a pump.
 *   Use correctly rated isolated drivers/relays and have mains wiring installed
 *   by a qualified electrician. Prototype and test with loads disconnected.
 */

#define ENABLE_USER_AUTH
#define ENABLE_DATABASE

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <FirebaseClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <time.h>

// -----------------------------------------------------------------------------
// 1) Credentials and database
// -----------------------------------------------------------------------------
#include "secrets.h"

// Use a dedicated Firebase Authentication user for the device.
// Do not put an account owner's password or a service-account private key here.
static const char FIREBASE_API_KEY[] = "AIzaSyC46juSVpwoSaNgf_LOwt_zlUxfT2pmdFk";
static const char FIREBASE_DATABASE_URL[] =
  "https://gasgaurd-e6009-default-rtdb.firebaseio.com";
static const char DEVICE_ID[] = "gasguard-001";

// -----------------------------------------------------------------------------
// 2) Wiring configuration -- change these to match your physical wiring
// -----------------------------------------------------------------------------
static constexpr uint8_t PIN_MQ6_GAS_ADC = 34;       // ADC1 input
static constexpr uint8_t PIN_MQ2_SMOKE_ADC = 35;     // ADC1 input
static constexpr uint8_t PIN_FLAME_DIGITAL = 27;
static constexpr uint8_t PIN_DHT_DATA = 4;
static constexpr uint8_t DHT_MODEL = DHT22;

static constexpr uint8_t PIN_RELAY_VALVE = 16;
static constexpr uint8_t PIN_RELAY_POWER_CUT = 17;
static constexpr uint8_t PIN_RELAY_FAN = 18;
static constexpr uint8_t PIN_RELAY_BUZZER = 19;
static constexpr uint8_t PIN_RELAY_EXTINGUISHER = 23;

// Set these to match sensors physically connected to the pins above. Analog and
// digital inputs cannot reliably detect whether a module is unplugged.
static constexpr bool SENSOR_MQ6_ENABLED = true;
static constexpr bool SENSOR_MQ2_ENABLED = true;
static constexpr bool SENSOR_FLAME_ENABLED = true;
// DHT22 temperature/humidity are enabled automatically only after valid reads.

// Many relay boards are active-low. Change to false only after checking yours.
static constexpr bool RELAY_ACTIVE_LOW = true;
// Many flame detector modules assert LOW when flame is detected.
static constexpr bool FLAME_ACTIVE_LOW = true;

// -----------------------------------------------------------------------------
// 3) Safety / sensor configuration
// -----------------------------------------------------------------------------
// These are raw ADC counts after scaling the ESP32's 0..4095 reading to 0..1023.
// They must be calibrated for the actual sensor, board, and installation.
static constexpr int DEFAULT_GAS_WARNING = 400;
static constexpr int DEFAULT_GAS_DANGER = 500;
static constexpr int DEFAULT_SMOKE_DANGER = 300;
static constexpr float DEFAULT_TEMP_WARNING_C = 50.0f;
static constexpr float DEFAULT_TEMP_DANGER_C = 60.0f;

static constexpr uint32_t SENSOR_SAMPLE_MS = 2500;  // DHT22 needs slow sampling
static constexpr uint32_t COMMAND_POLL_MS = 1200;
static constexpr uint32_t SENSOR_WARMUP_MS = 60000;
static constexpr uint32_t SENSOR_STALE_MS = 15000;
static constexpr uint32_t WIFI_RETRY_MS = 10000;
static constexpr uint32_t FIREBASE_RETRY_MS = 5000;
static constexpr uint32_t SAFETY_SETTINGS_POLL_MS = 10000;
static constexpr uint8_t ADC_AVERAGE_SAMPLES = 8;
static constexpr int ADC_MAX_VALUE = 4095;

// -----------------------------------------------------------------------------
// Firebase client
// -----------------------------------------------------------------------------
UserAuth user_auth(FIREBASE_API_KEY, FIREBASE_DEVICE_EMAIL, FIREBASE_DEVICE_PASSWORD);
FirebaseApp firebase_app;
WiFiClientSecure ssl_client;
using AsyncClient = AsyncClientClass;
AsyncClient firebase_client(ssl_client);
RealtimeDatabase database;

DHT dht(PIN_DHT_DATA, DHT_MODEL);

struct ActuatorStates {
  bool valveOpen = false;       // false means CLOSED
  bool powerOn = false;         // false means mains power OFF
  bool fanOn = false;
  bool buzzerOn = false;
  bool extinguisherOn = false;
};

struct SafetySettings {
  int gasWarning = DEFAULT_GAS_WARNING;
  int gasDanger = DEFAULT_GAS_DANGER;
  int smokeDanger = DEFAULT_SMOKE_DANGER;
  float temperatureWarning = DEFAULT_TEMP_WARNING_C;
  float temperatureDanger = DEFAULT_TEMP_DANGER_C;
  bool autoPowerCutOnLeak = true;
  bool autoPowerCutOnFire = true;
  bool autoPowerCutOnSmoke = true;
  bool emergency = false;
};

ActuatorStates actuators;
SafetySettings safety;

uint32_t bootMs = 0;
uint32_t lastSensorSampleMs = 0;
uint32_t lastCommandPollMs = 0;
uint32_t lastSafetySettingsPollMs = 0;
uint32_t lastTelemetryAttemptSampleMs = 0;
uint32_t lastWiFiAttemptMs = 0;
uint32_t lastFirebaseAttemptMs = 0;
uint32_t lastGoodDhtMs = 0;
bool telemetryHasValidDht = false;
bool wasWiFiConnected = false;
float currentTemperatureC = NAN;
float currentHumidity = NAN;
int currentGasAdc = 0;
int currentSmokeAdc = 0;
bool currentFlameDetected = false;
bool actuatorsPathNeedsRepublish = false;

String deviceRoot() {
  return String("/devices/") + DEVICE_ID;
}

String devicePath(const char *child) {
  return deviceRoot() + "/" + child;
}

void logFirebaseError(const char *operation) {
  const int code = firebase_client.lastError().code();
  if (code != 0) {
    Serial.printf("Firebase %s failed (%d): %s\n", operation, code,
      firebase_client.lastError().message().c_str());
  }
}

void setRelay(uint8_t pin, bool enabled) {
  const uint8_t onLevel = RELAY_ACTIVE_LOW ? LOW : HIGH;
  const uint8_t offLevel = RELAY_ACTIVE_LOW ? HIGH : LOW;
  digitalWrite(pin, enabled ? onLevel : offLevel);
}

void writeActuatorsToPins() {
  setRelay(PIN_RELAY_VALVE, actuators.valveOpen);
  setRelay(PIN_RELAY_POWER_CUT, actuators.powerOn);
  setRelay(PIN_RELAY_FAN, actuators.fanOn);
  setRelay(PIN_RELAY_BUZZER, actuators.buzzerOn);
  setRelay(PIN_RELAY_EXTINGUISHER, actuators.extinguisherOn);
}

void initializeSafeOutputs() {
  // Set safe electrical levels before switching relay GPIOs to output mode.
  const uint8_t offLevel = RELAY_ACTIVE_LOW ? HIGH : LOW;
  const uint8_t relayPins[] = {
    PIN_RELAY_VALVE, PIN_RELAY_POWER_CUT, PIN_RELAY_FAN,
    PIN_RELAY_BUZZER, PIN_RELAY_EXTINGUISHER
  };
  for (uint8_t pin : relayPins) {
    digitalWrite(pin, offLevel);
    pinMode(pin, OUTPUT);
    digitalWrite(pin, offLevel);
  }
  // Start gas and mains isolated. Do not auto-open gas during boot.
  actuators = ActuatorStates{};
  writeActuatorsToPins();
}

int readAveragedAdc(uint8_t pin) {
  uint32_t total = 0;
  for (uint8_t i = 0; i < ADC_AVERAGE_SAMPLES; ++i) {
    total += analogRead(pin);
    delay(2);
  }
  const uint32_t average = total / ADC_AVERAGE_SAMPLES;
  return static_cast<int>((average * 1023UL + ADC_MAX_VALUE / 2) / ADC_MAX_VALUE);
}

bool readFlameSensor() {
  const int raw = digitalRead(PIN_FLAME_DIGITAL);
  return FLAME_ACTIVE_LOW ? raw == LOW : raw == HIGH;
}

bool connectWiFi() {
  if (WiFi.status() == WL_CONNECTED) {
    if (!wasWiFiConnected) {
      wasWiFiConnected = true;
      Serial.print("Wi-Fi connected. ESP32 IP: ");
      Serial.println(WiFi.localIP());
    }
    return true;
  }
  wasWiFiConnected = false;
  const uint32_t now = millis();
  if (now - lastWiFiAttemptMs < WIFI_RETRY_MS) return false;
  lastWiFiAttemptMs = now;
  Serial.printf("Connecting to Wi-Fi: %s\n", WIFI_SSID);
  WiFi.disconnect();
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  return false;
}

bool firebaseReady() {
  if (firebase_app.ready()) return true;
  const uint32_t now = millis();
  if (WiFi.status() == WL_CONNECTED && now - lastFirebaseAttemptMs >= FIREBASE_RETRY_MS) {
    lastFirebaseAttemptMs = now;
    Serial.println("Waiting for Firebase authentication...");
  }
  return false;
}

void loadSafetySettings() {
  const String json = database.get<String>(firebase_client, devicePath("safety"));
  if (firebase_client.lastError().code() != 0 || json.length() == 0 || json == "null") {
    logFirebaseError("read safety settings");
    return;
  }

  JsonDocument doc;
  if (deserializeJson(doc, json)) {
    Serial.println("Could not parse Firebase safety settings; keeping compiled defaults.");
    return;
  }
  safety.gasWarning = doc["gasWarningThreshold"] | safety.gasWarning;
  safety.gasDanger = doc["gasDangerThreshold"] | safety.gasDanger;
  safety.smokeDanger = doc["smokeDangerThreshold"] | safety.smokeDanger;
  safety.temperatureWarning = doc["temperatureWarningThreshold"] | safety.temperatureWarning;
  safety.temperatureDanger = doc["temperatureDangerThreshold"] | safety.temperatureDanger;
  safety.autoPowerCutOnLeak = doc["autoPowerCutOnLeak"] | safety.autoPowerCutOnLeak;
  safety.autoPowerCutOnFire = doc["autoPowerCutOnFire"] | safety.autoPowerCutOnFire;
  safety.autoPowerCutOnSmoke = doc["autoPowerCutOnSmoke"] | safety.autoPowerCutOnSmoke;
  safety.emergency = doc["emergency"] | false;
  if (doc["mode"].is<const char *>()) {
    safety.emergency = safety.emergency || String(doc["mode"].as<const char *>()) == "EMERGENCY";
  }
}

void applySafetyInterlocks() {
  const bool gasDanger = SENSOR_MQ6_ENABLED && currentGasAdc >= safety.gasDanger;
  const bool smokeDanger = SENSOR_MQ2_ENABLED && currentSmokeAdc >= safety.smokeDanger;
  const bool flameDanger = SENSOR_FLAME_ENABLED && currentFlameDetected;
  const bool temperatureDanger = telemetryHasValidDht && currentTemperatureC >= safety.temperatureDanger;
  const bool sensorStale = telemetryHasValidDht && millis() - lastGoodDhtMs > SENSOR_STALE_MS;
  const bool anyHazard = gasDanger || smokeDanger || flameDanger || temperatureDanger || safety.emergency;
  if (!anyHazard) {
    if (sensorStale && actuators.valveOpen) {
      actuators.valveOpen = false;
      writeActuatorsToPins();
      actuatorsPathNeedsRepublish = true;
      Serial.println("SAFETY INTERLOCK: stale sensor readings; gas valve closed.");
    }
    return;
  }

  bool changed = false;
  if (actuators.valveOpen) { actuators.valveOpen = false; changed = true; }

  const bool cutPower = safety.emergency ||
    (gasDanger && safety.autoPowerCutOnLeak) ||
    (flameDanger && safety.autoPowerCutOnFire) ||
    (smokeDanger && safety.autoPowerCutOnSmoke);
  if (cutPower && actuators.powerOn) { actuators.powerOn = false; changed = true; }
  if (!actuators.fanOn) { actuators.fanOn = true; changed = true; }
  if (!actuators.buzzerOn) { actuators.buzzerOn = true; changed = true; }
  if (flameDanger && !actuators.extinguisherOn) {
    actuators.extinguisherOn = true;
    changed = true;
  }

  if (changed) {
    writeActuatorsToPins();
    actuatorsPathNeedsRepublish = true;
    Serial.println("SAFETY INTERLOCK: hazard detected; isolated gas and applied configured outputs.");
  }
}

bool sensorsReadyForGasOpen() {
  return SENSOR_MQ6_ENABLED && SENSOR_MQ2_ENABLED && SENSOR_FLAME_ENABLED && telemetryHasValidDht &&
    millis() - bootMs >= SENSOR_WARMUP_MS &&
    millis() - lastGoodDhtMs <= SENSOR_STALE_MS &&
    currentGasAdc < safety.gasDanger &&
    currentSmokeAdc < safety.smokeDanger &&
    !currentFlameDetected &&
    currentTemperatureC < safety.temperatureDanger &&
    !safety.emergency;
}

void sampleSensors() {
  if (SENSOR_MQ6_ENABLED) currentGasAdc = readAveragedAdc(PIN_MQ6_GAS_ADC);
  if (SENSOR_MQ2_ENABLED) currentSmokeAdc = readAveragedAdc(PIN_MQ2_SMOKE_ADC);
  if (SENSOR_FLAME_ENABLED) currentFlameDetected = readFlameSensor();

  // DHT22 readings are sampled slowly; hold the most recent genuine reading.
  const float temperature = dht.readTemperature();
  const float humidity = dht.readHumidity();
  if (isfinite(temperature) && isfinite(humidity)) {
    currentTemperatureC = temperature;
    currentHumidity = humidity;
    telemetryHasValidDht = true;
    lastGoodDhtMs = millis();
  } else {
    Serial.printf("DHT22 invalid (temperature=%s, humidity=%s); temperature/humidity will be omitted while other enabled sensors continue.\n",
      isfinite(temperature) ? String(temperature, 1).c_str() : "NaN",
      isfinite(humidity) ? String(humidity, 1).c_str() : "NaN");
  }
  Serial.printf("Sensor sample: gas=%s, smoke=%s, flame=%s, temperature=%s, humidity=%s\n",
    SENSOR_MQ6_ENABLED ? String(currentGasAdc).c_str() : "disabled",
    SENSOR_MQ2_ENABLED ? String(currentSmokeAdc).c_str() : "disabled",
    SENSOR_FLAME_ENABLED ? (currentFlameDetected ? "DETECTED" : "clear") : "disabled",
    telemetryHasValidDht ? String(currentTemperatureC, 1).c_str() : "disabled",
    telemetryHasValidDht ? String(currentHumidity, 1).c_str() : "disabled");
}

uint64_t epochMilliseconds() {
  const time_t epochSeconds = time(nullptr);
  // Uptime milliseconds are not Unix timestamps; wait for NTP synchronization.
  if (epochSeconds < 1700000000) return 0;
  return static_cast<uint64_t>(epochSeconds) * 1000ULL + (millis() % 1000);
}

bool publishSensorTelemetry() {
  const uint64_t timestamp = epochMilliseconds();
  if (timestamp == 0) {
    Serial.println("Waiting for NTP time before publishing sensor timestamps.");
    return false;
  }
  JsonWriter writer;
  object_t sensors;
  bool hasReading = false;

  if (SENSOR_MQ6_ENABLED) {
    object_t reading, timeNode, node;
    writer.create(reading, "value", currentGasAdc);
    writer.create(timeNode, "timestamp", timestamp);
    writer.join(node, 2, reading, timeNode);
    writer.create(sensors, "gas", node);
    hasReading = true;
  }
  if (SENSOR_MQ2_ENABLED) {
    object_t reading, detected, timeNode, valueNode, node;
    writer.create(reading, "value", currentSmokeAdc);
    writer.create(detected, "detected", currentSmokeAdc >= safety.smokeDanger);
    writer.join(valueNode, 2, reading, detected);
    writer.create(timeNode, "timestamp", timestamp);
    writer.join(node, 2, valueNode, timeNode);
    writer.create(sensors, "smoke", node);
    hasReading = true;
  }
  if (telemetryHasValidDht && millis() - lastGoodDhtMs <= SENSOR_STALE_MS) {
    object_t temperatureValue, temperatureUnit, temperatureTime, temperatureData, temperatureNode;
    writer.create(temperatureValue, "value", number_t(currentTemperatureC, 1));
    writer.create(temperatureUnit, "unit", string_t("C"));
    writer.join(temperatureData, 2, temperatureValue, temperatureUnit);
    writer.create(temperatureTime, "timestamp", timestamp);
    writer.join(temperatureNode, 2, temperatureData, temperatureTime);
    writer.create(sensors, "temperature", temperatureNode);

    object_t humidityValue, humidityUnit, humidityTime, humidityData, humidityNode;
    writer.create(humidityValue, "value", number_t(currentHumidity, 1));
    writer.create(humidityUnit, "unit", string_t("%"));
    writer.join(humidityData, 2, humidityValue, humidityUnit);
    writer.create(humidityTime, "timestamp", timestamp);
    writer.join(humidityNode, 2, humidityData, humidityTime);
    writer.create(sensors, "humidity", humidityNode);
    hasReading = true;
  }
  if (SENSOR_FLAME_ENABLED) {
    object_t detected, timeNode, node;
    writer.create(detected, "detected", currentFlameDetected);
    writer.create(timeNode, "timestamp", timestamp);
    writer.join(node, 2, detected, timeNode);
    writer.create(sensors, "flame", node);
    hasReading = true;
  }
  if (!hasReading) {
    Serial.println("No enabled sensor has a valid reading to upload.");
    return false;
  }

  const bool ok = database.set<object_t>(firebase_client, devicePath("sensors"), sensors);
  if (!ok) logFirebaseError("write sensors");
  else Serial.println("Available sensor telemetry uploaded.");
  return ok;
}

void republishActualActuators() {
  JsonWriter writer;
  object_t payload;
  writer.create(payload, "valve", string_t(actuators.valveOpen ? "OPEN" : "CLOSED"));
  writer.create(payload, "powerCut", string_t(actuators.powerOn ? "ON" : "OFF"));
  writer.create(payload, "fan", string_t(actuators.fanOn ? "ON" : "OFF"));
  writer.create(payload, "buzzer", string_t(actuators.buzzerOn ? "ON" : "OFF"));
  writer.create(payload, "extinguisher", string_t(actuators.extinguisherOn ? "ON" : "OFF"));
  const uint64_t timestamp = epochMilliseconds();
  if (timestamp > 0) writer.create(payload, "updatedAt", timestamp);
  const bool ok = database.update<object_t>(firebase_client, devicePath("actuators"), payload);
  if (!ok) logFirebaseError("sync actual actuator state");
  else actuatorsPathNeedsRepublish = false;
}

void applyCloudActuatorState(const JsonDocument &doc) {
  const String valve = doc["valve"] | "";
  const String power = doc["powerCut"] | "";
  const String fan = doc["fan"] | "";
  const String buzzer = doc["buzzer"] | "";
  const String extinguisher = doc["extinguisher"] | "";

  bool changed = false;
  if (valve == "OPEN" && !actuators.valveOpen) {
    if (sensorsReadyForGasOpen()) actuators.valveOpen = true;
    else actuatorsPathNeedsRepublish = true;
    changed = true;
  }
  else if (valve == "CLOSED" && actuators.valveOpen) { actuators.valveOpen = false; changed = true; }
  if (power == "ON" && !actuators.powerOn) { actuators.powerOn = true; changed = true; }
  else if (power == "OFF" && actuators.powerOn) { actuators.powerOn = false; changed = true; }
  if (fan == "ON" && !actuators.fanOn) { actuators.fanOn = true; changed = true; }
  else if (fan == "OFF" && actuators.fanOn) { actuators.fanOn = false; changed = true; }
  if (buzzer == "ON" && !actuators.buzzerOn) { actuators.buzzerOn = true; changed = true; }
  else if (buzzer == "OFF" && actuators.buzzerOn) { actuators.buzzerOn = false; changed = true; }
  if (extinguisher == "ON" && !actuators.extinguisherOn) { actuators.extinguisherOn = true; changed = true; }
  else if (extinguisher == "OFF" && actuators.extinguisherOn) { actuators.extinguisherOn = false; changed = true; }

  if (changed) {
    applySafetyInterlocks();
    writeActuatorsToPins();
    Serial.println("Actuator command applied from Realtime Database.");
  }
  if (actuatorsPathNeedsRepublish) republishActualActuators();
}

void pollActuatorsAndSafety() {
  const String actuatorJson = database.get<String>(firebase_client, devicePath("actuators"));
  if (firebase_client.lastError().code() != 0) {
    logFirebaseError("read actuators");
    return;
  }
  if (actuatorJson.length() > 0 && actuatorJson != "null") {
    JsonDocument doc;
    if (deserializeJson(doc, actuatorJson)) {
      Serial.println("Could not parse actuator object from Realtime Database.");
    } else {
      applyCloudActuatorState(doc);
    }
  }
}

void setup() {
  Serial.begin(115200);
  delay(100);
  Serial.println("Starting Sanketseva ESP32. Serial output does not print stored passwords.");
  bootMs = millis();

  initializeSafeOutputs();
  pinMode(PIN_FLAME_DIGITAL, INPUT_PULLUP);
  analogReadResolution(12);
  analogSetPinAttenuation(PIN_MQ6_GAS_ADC, ADC_11db);
  analogSetPinAttenuation(PIN_MQ2_SMOKE_ADC, ADC_11db);
  dht.begin();

  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  configTime(0, 0, "pool.ntp.org", "time.google.com");

  // Replace setInsecure() with a trusted CA certificate for production use.
  // This keeps the example easy to bring up but does not validate server identity.
  ssl_client.setInsecure();
  ssl_client.setConnectionTimeout(10000);
  ssl_client.setHandshakeTimeout(15);

  initializeApp(firebase_client, firebase_app, getAuth(user_auth), 120000);
  firebase_app.getApp<RealtimeDatabase>(database);
  database.url(FIREBASE_DATABASE_URL);
  Serial.println("Sanketseva ESP32 started. Valve and mains are held OFF until commanded.");
}

void loop() {
  firebase_app.loop();
  connectWiFi();

  const uint32_t now = millis();
  if (now - lastSensorSampleMs >= SENSOR_SAMPLE_MS) {
    lastSensorSampleMs = now;
    sampleSensors();
    applySafetyInterlocks();
  }

  if (!firebaseReady()) return;

  if (lastSensorSampleMs != 0 && lastTelemetryAttemptSampleMs != lastSensorSampleMs) {
    lastTelemetryAttemptSampleMs = lastSensorSampleMs;
    publishSensorTelemetry();
  }

  if (now - lastCommandPollMs >= COMMAND_POLL_MS) {
    lastCommandPollMs = now;
    pollActuatorsAndSafety();
  }
  if (now - lastSafetySettingsPollMs >= SAFETY_SETTINGS_POLL_MS) {
    lastSafetySettingsPollMs = now;
    loadSafetySettings();
    applySafetyInterlocks();
  }
}
