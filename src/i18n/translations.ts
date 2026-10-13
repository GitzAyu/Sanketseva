export type Language = 'en' | 'hi' | 'bho';

export interface TranslationDictionary {
  // Brand & Header
  brandName: string;
  brandSubtitle: string;
  online: string;
  offline: string;
  lastUpdate: string;
  lastSeen: string;
  emergencyShutdown: string;
  confirmEmergencyShutdown: string;
  customDomain: string;
  signedInAs: string;
  signOut: string;
  language: string;
  selectLanguage: string;

  // Nav items
  navDashboard: string;
  navMonitoring: string;
  navControls: string;
  navAlerts: string;
  navHistory: string;
  navSettings: string;
  navProfile: string;

  // System Status
  systemNormal: string;
  systemNormalDesc: string;
  systemWarning: string;
  systemWarningDesc: string;
  systemCritical: string;
  systemCriticalDesc: string;
  systemOffline: string;
  systemOfflineDesc: string;

  // Quick explanations
  easyUnderstandingTitle: string;
  easyUnderstandingSubtitle: string;
  howItWorks: string;
  safetyGuide: string;
  quickHelp: string;

  guideLpgTitle: string;
  guideLpgDesc: string;
  guideFlameTitle: string;
  guideFlameDesc: string;
  guideSmokeTitle: string;
  guideSmokeDesc: string;
  guidePowerCutTitle: string;
  guidePowerCutDesc: string;
  guideValveTitle: string;
  guideValveDesc: string;
  guideFanTitle: string;
  guideFanDesc: string;
  guideBuzzerTitle: string;
  guideBuzzerDesc: string;

  // Sensor Names & Labels
  sensorGas: string;
  sensorGasDesc: string;
  sensorSmoke: string;
  sensorSmokeDesc: string;
  sensorFlame: string;
  sensorFlameDesc: string;
  sensorTemp: string;
  sensorTempDesc: string;
  sensorHumidity: string;
  sensorHumidityDesc: string;
  sensorWifi: string;
  sensorWifiDesc: string;

  // Sensor Explanations
  gasSafeDesc: string;
  gasWarnDesc: string;
  gasDangerDesc: string;
  smokeSafeDesc: string;
  smokeAlertDesc: string;
  flameSafeDesc: string;
  flameAlertDesc: string;
  tempNormalDesc: string;
  tempHotDesc: string;

  // Actuator Explanations
  valveOpenSimple: string;
  valveClosedSimple: string;
  powerLiveSimple: string;
  powerCutSimple: string;
  fanOnSimple: string;
  fanOffSimple: string;
  alarmOnSimple: string;
  alarmOffSimple: string;

  // Status badges
  statusSafe: string;
  statusNormal: string;
  statusWarning: string;
  statusDanger: string;
  statusAlert: string;
  statusOpen: string;
  statusClosed: string;
  statusActive: string;
  statusInactive: string;
  flameClear: string;
  flameDetected: string;
  smokeClear: string;
  smokeDetected: string;

  // Actuator Hardware
  actuatorsTitle: string;
  actuatorsSubtitle: string;
  valveName: string;
  valveDesc: string;
  powerCutName: string;
  powerCutDesc: string;
  fanName: string;
  fanDesc: string;
  buzzerName: string;
  buzzerDesc: string;
  extinguisherName: string;
  extinguisherDesc: string;

  openValve: string;
  closeValve: string;
  turnPowerOn: string;
  turnPowerOff: string;
  cutPower: string;
  restorePower: string;
  startFan: string;
  stopFan: string;
  startExtinguisher: string;
  stopExtinguisher: string;
  soundAlarm: string;
  silenceAlarm: string;
  testSound: string;

  // Sound & Notifications
  audioAlertTitle: string;
  audioAlarmPlaying: string;
  muteSound: string;
  unmuteSound: string;
  silenceAlarmAction: string;
  notificationPermissionTitle: string;
  closeAlert: string;
  alertPopupTitle: string;
  alertPopupSubtitle: string;

  // Charts & Telemetry
  gasPpmTrend: string;
  smokeTrend: string;
  tempTrend: string;
  humidityTrend: string;
  liveReading: string;
  averageReading: string;
  peakReading: string;
  thresholdLimit: string;
  telemetryStream: string;
  realtimeGraph: string;

  // Events & Audit
  recentEvents: string;
  allEvents: string;
  noEvents: string;
  eventType: string;
  timestamp: string;
  details: string;
  severity: string;

  // Settings & Interlocks
  thresholdSettings: string;
  thresholdSettingsDesc: string;
  saveSettings: string;
  resetDefaults: string;
  settingsSavedSuccess: string;
  cancel: string;
  confirm: string;
  close: string;
  loading: string;
  filter: string;
  search: string;
  refresh: string;
  viewAll: string;
  hardwareOverrideWarning: string;
  interlockActive: string;
  interlockDesc: string;
  emergencyLockdownTitle: string;
  emergencyLockdownSubtitle: string;
  emergencyLockdownActive: string;
  emergencyLockdownDesc: string;
  resetEmergency: string;
  openValveConfirmDesc: string;
  powerOffConfirmDesc: string;
  powerOnConfirmDesc: string;

  // Visual simulation
  valveHelpOpen: string;
  valveHelpClosed: string;
  powerHelpOn: string;
  powerHelpOff: string;
  fanHelpOn: string;
  fanHelpOff: string;
  extinguisherHelpOn: string;
  extinguisherHelpOff: string;
  buzzerHelpOn: string;
  buzzerHelpOff: string;

  fanTitleVisual: string;
  extinguisherTitleVisual: string;
  buzzerTitleVisual: string;
  valveTitleVisual: string;
  powerTitleVisual: string;

  rotating: string;
  stopped: string;
  showering: string;
  standbyDry: string;
  sounding: string;
  silentArmed: string;
  flowingOpen: string;
  isolatedClosed: string;
  powerGridLive: string;
  powerCutIsolated: string;

  hardwareRelayBus: string;
  liveRunning: string;
  standbyIdle: string;
  nozzleDry: string;
  readyToShower: string;
  gasFlowingUnrestricted: string;
  gasIsolatedCylinder: string;
  mains230VActive: string;
  mains0VDeenergized: string;

  chipAir: string;
  chipFire: string;
  chipSmoke: string;
  chipPower: string;
  chipValve: string;
  chipShower: string;
  gasDangerChip: string;
  warningChip: string;
  cleanSafeChip: string;
  fireAlertChip: string;
  noFlameChip: string;
  smokeAlertChip: string;
  cleanSmokeChip: string;
  powerLiveChip: string;
  powerCutChip: string;
  openFlowingChip: string;
  shutCutOffChip: string;
  sprayingChip: string;
  dryStandbyChip: string;

  sensorsProtected: string;
  testBenchActive: string;
  cutoff: string;
  controller: string;
  dataPipe: string;
  sensorDevice: string;
  whatItProtects: string;
  esp32Pin: string;
  currentReading: string;
  safeLimit: string;
  condition: string;
  activeIncident: string;
  dismiss: string;
  monitoringHeaderTitle: string;
  monitoringHeaderSubtitle: string;
  alertsHeaderTitle: string;
  alertsHeaderSubtitle: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    brandName: 'SanketSeva',
    brandSubtitle: 'IoT LPG Gas, Fire & Smoke Safety System',
    online: 'ONLINE',
    offline: 'OFFLINE',
    lastUpdate: 'Last update',
    lastSeen: 'Last seen',
    emergencyShutdown: 'EMERGENCY SHUTDOWN',
    confirmEmergencyShutdown: 'CONFIRM EMERGENCY SHUTDOWN',
    customDomain: 'Custom Domain',
    signedInAs: 'Logged in as',
    signOut: 'Sign Out',
    language: 'Language',
    selectLanguage: 'Change Language',

    navDashboard: 'Dashboard',
    navMonitoring: 'Sensors & Graphs',
    navControls: 'Safety Controls',
    navAlerts: 'Alert Logs',
    navHistory: 'History',
    navSettings: 'Settings',
    navProfile: 'Operator Profile',

    systemNormal: 'KITCHEN IS SAFE & NORMAL',
    systemNormalDesc: 'No gas leaks, no flames, no smoke detected. Mains electricity is ON and gas supply is normal.',
    systemWarning: 'CAUTION: ELEVATED GAS / SMOKE / TEMP',
    systemWarningDesc: 'Sensor readings above baseline. Automated exhaust ventilation is active.',
    systemCritical: 'CRITICAL DANGER: GAS, FIRE OR SMOKE DETECTED!',
    systemCriticalDesc: 'Immediate emergency protocol active! Solenoid valve cut off, mains power cut OFF (0V), and alarm siren sounding.',
    systemOffline: 'DEVICE DISCONNECTED / OFFLINE',
    systemOfflineDesc: 'ESP32 controller is not sending telemetry. Check device Wi-Fi and power supply.',

    easyUnderstandingTitle: 'Safety Guide & System Explanation',
    easyUnderstandingSubtitle: 'How GasGuard protects your kitchen from gas leaks, electrical fires, and smoke',
    howItWorks: 'How GasGuard Works',
    safetyGuide: 'Easy Safety Guide',
    quickHelp: 'Quick Help',

    guideLpgTitle: '1. LPG Gas Leak Detector (MQ-6)',
    guideLpgDesc: 'Sniffs air for LPG cylinder gas (propane/butane). Automatically cuts gas supply, trips power OFF, and triggers exhaust.',
    guideFlameTitle: '2. Optical Fire Sensor',
    guideFlameDesc: 'Instantly detects naked flames or flare-ups. Cuts fuel supply and trips mains power OFF immediately.',
    guideSmokeTitle: '3. Smoke & Combustion Sensor',
    guideSmokeDesc: 'Detects smoldering electrical fires and burnt cooking smoke. Alerts with popup & sound siren and triggers ventilation.',
    guidePowerCutTitle: '4. Mains Power Control Breaker',
    guidePowerCutDesc: 'Controls 230V kitchen electrical power. Switch ON = Power ON (230V Live); Switch OFF = Power OFF (Power Cut 0V to prevent sparks).',
    guideValveTitle: '5. Solenoid Gas Cut-Off Valve',
    guideValveDesc: 'Mounted right at the gas cylinder to physically isolate the fuel supply upon any safety breach.',
    guideFanTitle: '6. High-Speed Exhaust Fan',
    guideFanDesc: 'Forces escaped gas or smoke outdoors to prevent asphyxiation and explosive accumulation.',
    guideBuzzerTitle: '7. High-Decibel Safety Siren',
    guideBuzzerDesc: 'Loudly sounds to alert kitchen personnel to evacuate.',

    sensorGas: 'LPG Gas Level',
    sensorGasDesc: 'Safe: <400 | Caution: 400-500 | Danger: >500 ADC',
    sensorSmoke: 'Smoke Detector',
    sensorSmokeDesc: 'Safe: <200 | Warning: 200-350 | Danger: >350 PPM',
    sensorFlame: 'Fire & Flame Sensor',
    sensorFlameDesc: 'Optical infrared detector for open flame ignition',
    sensorTemp: 'Room Temperature',
    sensorTempDesc: 'Safe: <50 °C | Alert: 60 °C',
    sensorHumidity: 'Air Humidity',
    sensorHumidityDesc: 'Relative ambient moisture percentage',
    sensorWifi: 'Wi-Fi Signal',
    sensorWifiDesc: 'ESP32 controller connectivity strength',

    gasSafeDesc: 'Clean, safe air detected. Cooking is safe.',
    gasWarnDesc: 'Minor gas odor detected. Exhaust fan turned ON.',
    gasDangerDesc: 'Heavy gas leak! Gas cut OFF & Mains Power turned OFF.',
    smokeSafeDesc: 'Clear air. No smoke or smoldering detected.',
    smokeAlertDesc: 'Dense smoke detected! Siren sounding & exhaust engaged.',
    flameSafeDesc: 'No fire or open flames detected.',
    flameAlertDesc: 'Fire detected! Fuel valve and mains electricity isolated.',
    tempNormalDesc: 'Comfortable room temperature.',
    tempHotDesc: 'Room heat elevated. Approaching thermal safety limit.',

    valveOpenSimple: 'Gas Flowing (Stove Ready)',
    valveClosedSimple: 'Gas Cut Off (Safety Shut)',
    powerLiveSimple: 'Power ON (230V Live Grid)',
    powerCutSimple: 'Power OFF (Power Cut 0V)',
    fanOnSimple: 'Ventilating Fresh Air',
    fanOffSimple: 'Exhaust Idle',
    alarmOnSimple: 'Alarm Sounding Loudly',
    alarmOffSimple: 'Alarm Armed & Quiet',

    statusSafe: 'SAFE',
    statusNormal: 'NORMAL',
    statusWarning: 'CAUTION',
    statusDanger: 'DANGER',
    statusAlert: 'ALERT',
    statusOpen: 'OPEN / FLOWING',
    statusClosed: 'CLOSED / SAFE',
    statusActive: 'ACTIVE / ON',
    statusInactive: 'OFF / IDLE',
    flameClear: 'NO FIRE DETECTED',
    flameDetected: 'FIRE DETECTED!',
    smokeClear: 'CLEAR (NO SMOKE)',
    smokeDetected: 'SMOKE DETECTED!',

    actuatorsTitle: 'Safety Equipment & Hardware Controls',
    actuatorsSubtitle: 'Directly manage gas valve, mains electricity power, ventilation fan, water shower, and siren',
    valveName: 'Solenoid Fuel Valve',
    valveDesc: 'Controls physical gas pipe supply from cylinder to stove',
    powerCutName: 'Mains Electricity Power',
    powerCutDesc: 'Controls 230V kitchen mains electricity. Switch ON = Power ON (230V); Switch OFF = Power OFF (0V Cut).',
    fanName: 'Exhaust Ventilation Fan',
    fanDesc: 'Evacuates leaked gas outdoors',
    buzzerName: 'Audible Warning Siren',
    buzzerDesc: '105 dB loud sound to alert occupants',
    extinguisherName: 'Fire Water Shower (Extinguisher)',
    extinguisherDesc: 'Overhead fire suppression water shower deluge',

    openValve: 'Open Gas Valve',
    closeValve: 'Cut Off Gas (Close Valve)',
    turnPowerOn: 'Power ON (230V Live)',
    turnPowerOff: 'Power OFF (Cut Power)',
    cutPower: 'Power OFF (Cut Power)',
    restorePower: 'Power ON (Restore 230V)',
    startFan: 'Turn ON Exhaust Fan',
    stopFan: 'Turn OFF Exhaust Fan',
    startExtinguisher: 'Turn ON Water Shower',
    stopExtinguisher: 'Turn OFF Water Shower',
    soundAlarm: 'Sound Siren Test',
    silenceAlarm: 'Silence Siren',
    testSound: 'Test Sound Alarm',

    audioAlertTitle: 'Emergency Sound Alert',
    audioAlarmPlaying: 'SIREN SOUNDING (ACTIVE HAZARD)',
    muteSound: 'Mute Sound',
    unmuteSound: 'Unmute Sound',
    silenceAlarmAction: 'Silence Alarm Sound',
    notificationPermissionTitle: 'Enable Browser Alerts',
    closeAlert: 'Close Alert',
    alertPopupTitle: 'HAZARD SAFETY ALERT',
    alertPopupSubtitle: 'Immediate safety action taken by GasGuard Quantix',

    gasPpmTrend: 'LPG Concentration Trend',
    smokeTrend: 'Smoke Concentration Trend',
    tempTrend: 'Temperature Trend (°C)',
    humidityTrend: 'Humidity Trend (%)',
    liveReading: 'Current Value',
    averageReading: '1-Hour Average',
    peakReading: 'Peak Reading',
    thresholdLimit: 'Safe Threshold Limit',
    telemetryStream: 'Live Sensor Telemetry',
    realtimeGraph: 'Live Real-Time Graph',

    recentEvents: 'Recent Safety Events',
    allEvents: 'Event Audit Log',
    noEvents: 'No safety incidents recorded. System running normally.',
    eventType: 'Event Type',
    timestamp: 'Time',
    details: 'Details',
    severity: 'Level',

    thresholdSettings: 'Safety Limits & Thresholds',
    thresholdSettingsDesc: 'Configure automatic trigger points for safety equipment',
    saveSettings: 'Save Safety Settings',
    resetDefaults: 'Restore Factory Defaults',
    settingsSavedSuccess: 'Safety settings successfully synchronized with ESP32!',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    loading: 'Loading...',
    filter: 'Filter',
    search: 'Search...',
    refresh: 'Refresh',
    viewAll: 'View All',

    hardwareOverrideWarning: 'Hardware safety interlock: Valve cannot open if gas, fire, or smoke is detected.',
    interlockActive: 'Automatic Safety Interlock & Realtime Sync Active',
    interlockDesc: 'Actuator states automatically sync with ESP32 relay bus. Power cuts OFF and valve closes automatically during emergencies.',
    emergencyLockdownTitle: 'Emergency Safety Cutoff (One-Click Lockdown)',
    emergencyLockdownSubtitle: 'Instantly cut off LPG cylinder valve, switch mains power OFF (0V) to prevent sparks, turn on exhaust fan, and sound emergency siren.',
    emergencyLockdownActive: 'Emergency Lockdown Active',
    emergencyLockdownDesc: 'Gas valve is shut and mains electricity is OFF. Ensure the kitchen is safe and ventilated before resetting.',
    resetEmergency: 'Reset Emergency State',
    openValveConfirmDesc: 'Opening the gas solenoid valve allows combustible LPG to flow to appliances. Please verify burners are attended.',
    powerOffConfirmDesc: 'Switching mains power OFF (Power Cut) will de-energize kitchen circuits to 0V to eliminate all electrical spark ignition risks.',
    powerOnConfirmDesc: 'Switching mains power ON will re-energize 230V kitchen circuits. Ensure that no combustible gas remains in the room before proceeding.',

    valveHelpOpen: 'Gas is flowing to burners. Ready for safe cooking.',
    valveHelpClosed: 'Gas is cut off at cylinder. Pipe is fully isolated & safe.',
    powerHelpOn: 'Mains electricity is ON (230V Live). Grid connected and running.',
    powerHelpOff: 'Mains electricity is OFF (Power Cut 0V). Contactor tripped, sparks eliminated.',
    fanHelpOn: 'Exhaust fan is actively running and rotating to vent room air.',
    fanHelpOff: 'Exhaust fan is currently resting (auto-starts if gas leaks).',
    extinguisherHelpOn: 'Water shower is actively spraying down to suppress fire.',
    extinguisherHelpOff: 'Water shower in standby mode (arms on command or fire).',
    buzzerHelpOn: 'Audible siren sounding loudly to alert kitchen staff.',
    buzzerHelpOff: 'Alarm siren is silent and armed for hazardous conditions.',

    fanTitleVisual: 'EXHAUST VENTILATOR',
    extinguisherTitleVisual: 'WATER SHOWER DELUGE',
    buzzerTitleVisual: 'AUDIBLE SIREN HORN',
    valveTitleVisual: 'LPG SUPPLY CONDUIT',
    powerTitleVisual: 'MAINS POWER BREAKER (CONTACTOR)',

    rotating: 'ROTATING',
    stopped: 'STOPPED',
    showering: 'SHOWERING',
    standbyDry: 'STANDBY - DRY',
    sounding: 'SOUNDING',
    silentArmed: 'SILENT - ARMED',
    flowingOpen: 'FLOWING - OPEN',
    isolatedClosed: 'ISOLATED - CLOSED',
    powerGridLive: 'POWER ON (230V LIVE)',
    powerCutIsolated: 'POWER OFF (0V CUT)',

    hardwareRelayBus: 'Hardware: ESP32 Relay Bus',
    liveRunning: 'Live Running',
    standbyIdle: 'Standby / Idle',
    nozzleDry: 'Nozzle Dry - Pressurized 12 Bar',
    readyToShower: 'Ready to shower immediately upon command or fire',
    gasFlowingUnrestricted: 'Unrestricted LPG Supply to Kitchen Burners',
    gasIsolatedCylinder: 'Gas Supply Completely Isolated at Cylinder',
    mains230VActive: '230V AC Grid Active (Power ON)',
    mains0VDeenergized: '0V AC Tripped (Power OFF / Sparks Prevented)',

    chipAir: 'Gas',
    chipFire: 'Fire',
    chipSmoke: 'Smoke',
    chipPower: 'Power',
    chipValve: 'Valve',
    chipShower: 'Shower',
    gasDangerChip: 'Gas Danger',
    warningChip: 'Warning',
    cleanSafeChip: 'Clean Air',
    fireAlertChip: 'Fire Alert',
    noFlameChip: 'No Fire',
    smokeAlertChip: 'Smoke Alert',
    cleanSmokeChip: 'No Smoke',
    powerLiveChip: 'Power ON (230V)',
    powerCutChip: 'Power OFF (0V)',
    openFlowingChip: 'Valve Open',
    shutCutOffChip: 'Valve Shut',
    sprayingChip: 'Spraying',
    dryStandbyChip: 'Dry Standby',

    sensorsProtected: 'Sensors Protected',
    testBenchActive: 'Test Bench Active',
    cutoff: 'CUTOFF',
    controller: 'Controller',
    dataPipe: 'Data Pipe',
    sensorDevice: 'Sensor Device',
    whatItProtects: 'What It Protects',
    esp32Pin: 'ESP32 Pin',
    currentReading: 'Current Reading',
    safeLimit: 'Safe Limit',
    condition: 'Condition',
    activeIncident: 'ACTIVE EMERGENCY INCIDENT',
    dismiss: 'Dismiss',
    monitoringHeaderTitle: 'Sensor Hardware Channels & Telemetry Ingress',
    monitoringHeaderSubtitle: 'Real-time environmental diagnostic stream received from ESP32 microcontroller',
    alertsHeaderTitle: 'Hazard Alerts & Incident Management',
    alertsHeaderSubtitle: 'Real-time emergency events, threshold breaches, and automated safety actions',
  },
  hi: {
    brandName: 'SanketSeva',
    brandSubtitle: 'IoT LPG गैस, आग और धुआं सुरक्षा प्रणाली',
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन',
    lastUpdate: 'अंतिम अपडेट',
    lastSeen: 'अंतिम देखा गया',
    emergencyShutdown: 'आपातकालीन शटडाउन',
    confirmEmergencyShutdown: 'आपातकालीन शटडाउन की पुष्टि करें',
    customDomain: 'कस्टम डोमेन',
    signedInAs: 'लॉग इन किया गया',
    signOut: 'साइन आउट',
    language: 'भाषा',
    selectLanguage: 'भाषा बदलें',

    navDashboard: 'डैशबोर्ड',
    navMonitoring: 'सेंसर व ग्राफ',
    navControls: 'सुरक्षा नियंत्रण',
    navAlerts: 'अलर्ट लॉग्स',
    navHistory: 'इतिहास',
    navSettings: 'सेटिंग्स',
    navProfile: 'ऑपरेटर प्रोफाइल',

    systemNormal: 'रसोई सुरक्षित और सामान्य है',
    systemNormalDesc: 'कोई गैस रिसाव नहीं, कोई आग या धुआं नहीं। मेन बिजली चालू (ON) है और गैस सुरक्षित है।',
    systemWarning: 'सावधानी: गैस/धुआं/तापमान बढ़ा हुआ',
    systemWarningDesc: 'सेंसर रीडिंग सामान्य से अधिक। स्वचालित निकास पंखा चालू है।',
    systemCritical: 'गंभीर खतरा: गैस, आग या धुआं मिला!',
    systemCriticalDesc: 'आपातकालीन सुरक्षा सक्रिय! गैस वाल्व बंद, मेन बिजली बंद (OFF / 0V), और सायरन चालू।',
    systemOffline: 'डिवाइस डिस्कनेक्ट / ऑफ़लाइन',
    systemOfflineDesc: 'ESP32 कंट्रोलर टेलीमेट्री नहीं भेज रहा है। वाई-फाई व बिजली जांचें।',

    easyUnderstandingTitle: 'सुरक्षा गाइड और प्रणाली विवरण',
    easyUnderstandingSubtitle: 'गैस रिसाव, बिजली की चिंगारी और धुएं से सुरक्षा',
    howItWorks: 'GasGuard कैसे काम करता है',
    safetyGuide: 'आसान सुरक्षा गाइड',
    quickHelp: 'त्वरित मदद',

    guideLpgTitle: '1. एलपीजी गैस रिसाव डिटेक्टर (MQ-6)',
    guideLpgDesc: 'हवा में रसोई गैस सूंघता है। रिसाव पर गैस बंद करता है और बिजली तुरंत काट (OFF) देता है।',
    guideFlameTitle: '2. ऑप्टिकल आग सेंसर',
    guideFlameDesc: 'खुली लपटों का तुरंत पता लगाता है। ईंधन रोकता है और मेन पावर तुरंत OFF करता है।',
    guideSmokeTitle: '3. धुआं और दहन सेंसर',
    guideSmokeDesc: 'तारों के सुलगने और धुएं का पता लगाकर पॉपअप व सायरन बजाता है।',
    guidePowerCutTitle: '4. मेन पावर स्विच कंट्रोल',
    guidePowerCutDesc: '230V बिजली नियंत्रण। स्विच ON का मतलब पावर चालू (ON), स्विच OFF का मतलब पावर बंद (OFF / 0V कट)।',
    guideValveTitle: '5. सोलेनोइड गैस कट-ऑफ वाल्व',
    guideValveDesc: 'सिलेंडर पर लगा वाल्व किसी भी खतरे पर गैस सप्लाई को पूरी तरह बंद कर देता है।',
    guideFanTitle: '6. हाई-स्पीड एग्जॉस्ट फैन',
    guideFanDesc: 'कमरे से गैस या धुएं को बाहर निकालता है।',
    guideBuzzerTitle: '7. तेज सुरक्षा सायरन',
    guideBuzzerDesc: 'खतरे में सबको आगाह करने के लिए तेज आवाज करता है।',

    sensorGas: 'एलपीजी गैस स्तर',
    sensorGasDesc: 'सुरक्षित: <400 | चेतावनी: 400-500 | खतरा: >500 ADC',
    sensorSmoke: 'धुआं डिटेक्टर',
    sensorSmokeDesc: 'सुरक्षित: <200 | चेतावनी: 200-350 | खतरा: >350 PPM',
    sensorFlame: 'आग और ज्वाला सेंसर',
    sensorFlameDesc: 'खुली आग का पता लगाने वाला सेंसर',
    sensorTemp: 'कमरे का तापमान',
    sensorTempDesc: 'सुरक्षित: <50 °C | अलर्ट: 60 °C',
    sensorHumidity: 'हवा की नमी',
    sensorHumidityDesc: 'कमरे की सामान्य नमी',
    sensorWifi: 'वाई-फाई सिग्नल',
    sensorWifiDesc: 'ESP32 कनेक्शन शक्ति',

    gasSafeDesc: 'हवा स्वच्छ है। खाना बनाना सुरक्षित है।',
    gasWarnDesc: 'हल्की गैस गंध। पंखा चालू किया गया।',
    gasDangerDesc: 'भारी गैस रिसाव! गैस बंद और मेन बिजली बंद (OFF) कर दी गई।',
    smokeSafeDesc: 'हवा साफ है। कोई धुआं नहीं।',
    smokeAlertDesc: 'धुआं मिला! सायरन और वेंटिलेशन चालू।',
    flameSafeDesc: 'कोई आग नहीं मिली।',
    flameAlertDesc: 'आग मिली! गैस वाल्व और मेन बिजली तुरंत बंद।',
    tempNormalDesc: 'सामान्य तापमान।',
    tempHotDesc: 'कमरा ज्यादा गर्म हो रहा है।',

    valveOpenSimple: 'गैस चालू (चूल्हा तैयार)',
    valveClosedSimple: 'गैस बंद (सुरक्षित)',
    powerLiveSimple: 'पावर चालू (ON - 230V)',
    powerCutSimple: 'पावर बंद (OFF - 0V कट)',
    fanOnSimple: 'पंखा चालू',
    fanOffSimple: 'पंखा बंद',
    alarmOnSimple: 'सायरन बज रहा है',
    alarmOffSimple: 'अलार्म शांत',

    statusSafe: 'सुरक्षित',
    statusNormal: 'सामान्य',
    statusWarning: 'सावधानी',
    statusDanger: 'खतरा',
    statusAlert: 'अलर्ट',
    statusOpen: 'खुला / चालू',
    statusClosed: 'बंद / सुरक्षित',
    statusActive: 'चालू / ON',
    statusInactive: 'बंद / OFF',
    flameClear: 'कोई आग नहीं',
    flameDetected: 'आग मिली!',
    smokeClear: 'साफ हवा',
    smokeDetected: 'धुआं मिला!',

    actuatorsTitle: 'सुरक्षा उपकरण और हार्डवेयर नियंत्रण',
    actuatorsSubtitle: 'गैस वाल्व, बिजली स्विच, पंखा, पानी फव्वारा और सायरन नियंत्रित करें',
    valveName: 'सोलेनोइड गैस वाल्व',
    valveDesc: 'सिलेंडर से चूल्हे तक गैस सप्लाई नियंत्रित करता है',
    powerCutName: 'मेन बिजली स्विच',
    powerCutDesc: 'स्विच ON = पावर चालू (230V); स्विच OFF = पावर बंद (0V कट चिंगारी रोकने के लिए)',
    fanName: 'एग्जॉस्ट फैन',
    fanDesc: 'कमरे की हवा बाहर फेंकता है',
    buzzerName: 'सायरन अलार्म',
    buzzerDesc: 'तेज आवाज से सचेत करता है',
    extinguisherName: 'अग्निशामक पानी फव्वारा',
    extinguisherDesc: 'आग बुझाने के लिए पानी की बौछार',

    openValve: 'गैस वाल्व खोलें',
    closeValve: 'गैस बंद करें',
    turnPowerOn: 'पावर चालू करें (ON - 230V)',
    turnPowerOff: 'पावर बंद करें (OFF - कट)',
    cutPower: 'पावर बंद करें (OFF)',
    restorePower: 'पावर चालू करें (ON)',
    startFan: 'पंखा चालू करें',
    stopFan: 'पंखा बंद करें',
    startExtinguisher: 'पानी फव्वारा चालू करें',
    stopExtinguisher: 'पानी फव्वारा बंद करें',
    soundAlarm: 'सायरन टेस्ट करें',
    silenceAlarm: 'सायरन बंद करें',
    testSound: 'साउंड टेस्ट',

    audioAlertTitle: 'आपातकालीन साउंड अलर्ट',
    audioAlarmPlaying: 'सायरन बज रहा है',
    muteSound: 'आवाज म्यूट करें',
    unmuteSound: 'आवाज चालू करें',
    silenceAlarmAction: 'सायरन बंद करें',
    notificationPermissionTitle: 'ब्राउज़र अलर्ट सक्षम करें',
    closeAlert: 'अलर्ट बंद करें',
    alertPopupTitle: 'खतरे का सुरक्षा अलर्ट',
    alertPopupSubtitle: 'तत्काल सुरक्षा कार्रवाई की गई',

    gasPpmTrend: 'एलपीजी गैस ट्रेंड',
    smokeTrend: 'धुआं स्तर ट्रेंड',
    tempTrend: 'तापमान ट्रेंड (°C)',
    humidityTrend: 'नमी ट्रेंड (%)',
    liveReading: 'वर्तमान रीडिंग',
    averageReading: '1 घंटे का औसत',
    peakReading: 'उच्चतम रीडिंग',
    thresholdLimit: 'सुरक्षित सीमा',
    telemetryStream: 'लाइव टेलीमेट्री',
    realtimeGraph: 'लाइव ग्राफ',

    recentEvents: 'हाल की घटनाएं',
    allEvents: 'घटना ऑडिट लॉग',
    noEvents: 'कोई खतरा नहीं। सब कुछ सामान्य है।',
    eventType: 'घटना प्रकार',
    timestamp: 'समय',
    details: 'विवरण',
    severity: 'स्तर',

    thresholdSettings: 'सुरक्षा सीमाएं',
    thresholdSettingsDesc: 'स्वचालित सुरक्षा उपकरण ट्रिगर सेट करें',
    saveSettings: 'सेटिंग्स सेव करें',
    resetDefaults: 'डिफ़ॉल्ट रीसेट करें',
    settingsSavedSuccess: 'सेटिंग्स ESP32 में सेव हो गईं!',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    close: 'बंद करें',
    loading: 'लोड हो रहा है...',
    filter: 'फ़िल्टर',
    search: 'खोजें...',
    refresh: 'रिफ्रेश',
    viewAll: 'सभी देखें',

    hardwareOverrideWarning: 'गैस, आग या धुआं होने पर गैस वाल्व नहीं खुलेगा।',
    interlockActive: 'स्वचालित सुरक्षा इंटरलॉक सक्रिय',
    interlockDesc: 'आपात स्थिति में बिजली अपने-आप बंद (OFF) और वाल्व बंद हो जाता है।',
    emergencyLockdownTitle: 'आपातकालीन शटडाउन (वन-क्लिक लॉकडाउन)',
    emergencyLockdownSubtitle: 'गैस वाल्व बंद, बिजली बंद (OFF / 0V), पंखा चालू और सायरन बजाएं।',
    emergencyLockdownActive: 'आपातकालीन लॉकडाउन सक्रिय',
    emergencyLockdownDesc: 'गैस और मेन बिजली बंद है। कमरा सुरक्षित होने पर ही रीसेट करें।',
    resetEmergency: 'आपातकालीन स्थिति रीसेट करें',
    openValveConfirmDesc: 'गैस वाल्व खोलने से गैस चूल्हे तक जाएगी। सुनिश्चित करें कि चूल्हा जलने के लिए तैयार है।',
    powerOffConfirmDesc: 'मेन बिजली बंद (OFF) करने से चिंगारी का खतरा पूरी तरह समाप्त हो जाएगा।',
    powerOnConfirmDesc: 'मेन बिजली चालू (ON - 230V) करने से पहले सुनिश्चित करें कि कमरे में कोई गैस नहीं है।',

    valveHelpOpen: 'गैस चालू है। खाना पकाने के लिए तैयार।',
    valveHelpClosed: 'सिलेंडर पर गैस बंद है। पूरी तरह सुरक्षित।',
    powerHelpOn: 'मेन बिजली चालू है (ON - 230V)।',
    powerHelpOff: 'मेन बिजली बंद है (OFF / 0V कट)। चिंगारी का खतरा समाप्त।',
    fanHelpOn: 'एग्जॉस्ट पंखा तेजी से चल रहा है।',
    fanHelpOff: 'पंखा विश्राम में है।',
    extinguisherHelpOn: 'पानी का फव्वारा आग पर पानी छिड़क रहा है।',
    extinguisherHelpOff: 'पानी फव्वारा तैयार मोड में है।',
    buzzerHelpOn: 'सायरन तेज आवाज में बज रहा है।',
    buzzerHelpOff: 'सायरन शांत और सतर्क है।',

    fanTitleVisual: 'एग्जॉस्ट पंखा',
    extinguisherTitleVisual: 'पानी फव्वारा',
    buzzerTitleVisual: 'सायरन हॉर्न',
    valveTitleVisual: 'गैस पाइपलाइन',
    powerTitleVisual: 'मेन पावर ब्रेकर',

    rotating: 'घूम रहा है',
    stopped: 'रुका हुआ',
    showering: 'छिड़काव चालू',
    standbyDry: 'तैयार मोड',
    sounding: 'बज रहा है',
    silentArmed: 'शांत - सतर्क',
    flowingOpen: 'खुला - गैस चालू',
    isolatedClosed: 'बंद - सुरक्षित',
    powerGridLive: 'पावर चालू (230V)',
    powerCutIsolated: 'पावर बंद (0V कट)',

    hardwareRelayBus: 'ESP32 रिले बस',
    liveRunning: 'सक्रिय चालू',
    standbyIdle: 'स्टैंडबाय',
    nozzleDry: 'नोजल सूखा',
    readyToShower: 'छिड़काव के लिए तैयार',
    gasFlowingUnrestricted: 'चूल्हे तक गैस जा रही है',
    gasIsolatedCylinder: 'सिलेंडर पर गैस पूर्णतः बंद',
    mains230VActive: '230V बिजली चालू (पावर ON)',
    mains0VDeenergized: '0V बिजली बंद (पावर OFF / चिंगारी बंद)',

    chipAir: 'गैस',
    chipFire: 'आग',
    chipSmoke: 'धुआं',
    chipPower: 'बिजली',
    chipValve: 'वाल्व',
    chipShower: 'फव्वारा',
    gasDangerChip: 'गैस खतरा',
    warningChip: 'सावधानी',
    cleanSafeChip: 'साफ हवा',
    fireAlertChip: 'आग अलर्ट',
    noFlameChip: 'कोई आग नहीं',
    smokeAlertChip: 'धुआं अलर्ट',
    cleanSmokeChip: 'कोई धुआं नहीं',
    powerLiveChip: 'पावर ON (230V)',
    powerCutChip: 'पावर OFF (0V)',
    openFlowingChip: 'वाल्व खुला',
    shutCutOffChip: 'वाल्व बंद',
    sprayingChip: 'छिड़काव',
    dryStandbyChip: 'स्टैंडबाय',

    sensorsProtected: 'सेंसर सुरक्षित',
    testBenchActive: 'टेस्ट बेंच सक्रिय',
    cutoff: 'कटऑफ',
    controller: 'कंट्रोलर',
    dataPipe: 'डेटा पाइप',
    sensorDevice: 'सेंसर उपकरण',
    whatItProtects: 'यह क्या बचाता है',
    esp32Pin: 'ESP32 पिन',
    currentReading: 'वर्तमान रीडिंग',
    safeLimit: 'सुरक्षित सीमा',
    condition: 'स्थिति',
    activeIncident: 'सक्रिय आपात घटना',
    dismiss: 'हटाएं',
    monitoringHeaderTitle: 'सेंसर हार्डवेयर टेलीमेट्री',
    monitoringHeaderSubtitle: 'ESP32 से प्राप्त वास्तविक समय डेटा',
    alertsHeaderTitle: 'अलर्ट व घटना प्रबंधन',
    alertsHeaderSubtitle: 'आपातकालीन घटनाएं व स्वचालित सुरक्षा क्रियाएं',
  },
  bho: {
    brandName: 'SanketSeva',
    brandSubtitle: 'IoT रसोई गैस, आग अउर धुआं सुरक्षा प्रणाली',
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन',
    lastUpdate: 'पिछिला अपडेट',
    lastSeen: 'अंतिम बेर देखल',
    emergencyShutdown: 'आपातकालीन शटडाउन',
    confirmEmergencyShutdown: 'शटडाउन के पक्का करीं',
    customDomain: 'कस्टम डोमेन',
    signedInAs: 'लॉग इन बाड़ी',
    signOut: 'साइन आउट',
    language: 'भाषा',
    selectLanguage: 'भाषा बदलीं',

    navDashboard: 'डैशबोर्ड',
    navMonitoring: 'सेंसर आ ग्राफ',
    navControls: 'कंट्रोल',
    navAlerts: 'अलर्ट लॉग',
    navHistory: 'इतिहास',
    navSettings: 'सेटिंग',
    navProfile: 'प्रोफाइल',

    systemNormal: 'रसोई पूरा सुरक्षित बा',
    systemNormalDesc: 'कवनो गैस रिसाव, आग चाहे धुआं नइखे। मेन बिजली चालू (ON) बा आ गैस सुरक्षित बा।',
    systemWarning: 'होशियार: गैस/धुआं/तापमान बढ़ल बा',
    systemWarningDesc: 'रीडिंग बढ़ल बा। पंखा चालू बा।',
    systemCritical: 'भारी खतरा: गैस, आग भा धुआं मिलल!',
    systemCriticalDesc: 'आपातकालीन सुरक्षा चालू! गैस वाल्व बंद, बिजली बंद (OFF / 0V), आ सायरन बाजत बा।',
    systemOffline: 'डिवाइस बंद / ऑफ़लाइन',
    systemOfflineDesc: 'ESP32 सिग्नल नइखे भेजत।',

    easyUnderstandingTitle: 'सुरक्षा गाइड',
    easyUnderstandingSubtitle: 'गैस रिसाव, चिंगारी आ धुआं से बचाव',
    howItWorks: 'GasGuard कइसे काम करेला',
    safetyGuide: 'सुरक्षा नियम',
    quickHelp: 'मदद',

    guideLpgTitle: '1. गैस डिटेक्टर (MQ-6)',
    guideLpgDesc: 'गैस गंध पकड़ के तुरंत गैस बंद आ बिजली काट (OFF) देला।',
    guideFlameTitle: '2. आग सेंसर',
    guideFlameDesc: 'आग के लपट देख के गैस आ बिजली तुरंत OFF करेला।',
    guideSmokeTitle: '3. धुआं सेंसर',
    guideSmokeDesc: 'धुआं पर सायरन बजावेला आ पंखा चलावेला।',
    guidePowerCutTitle: '4. बिजली स्विच कंट्रोल',
    guidePowerCutDesc: 'स्विच ON मतलब बिजली चालू (ON), स्विच OFF मतलब बिजली बंद (OFF / 0V कट)।',
    guideValveTitle: '5. गैस वाल्व',
    guideValveDesc: 'सिलेंडर से गैस तुरंते बंद करेला।',
    guideFanTitle: '6. एग्जॉस्ट पंखा',
    guideFanDesc: 'खराब हवा बाहर फेंकेला।',
    guideBuzzerTitle: '7. सायरन',
    guideBuzzerDesc: 'तेज आवाज से आगाह करेला।',

    sensorGas: 'गैस स्तर',
    sensorGasDesc: 'सुरक्षित: <400 | चेतावनी: 400-500 | खतरा: >500 ADC',
    sensorSmoke: 'धुआं सेंसर',
    sensorSmokeDesc: 'सुरक्षित: <200 | चेतावनी: 200-350 | खतरा: >350 PPM',
    sensorFlame: 'आग सेंसर',
    sensorFlameDesc: 'आग पकड़े वाला सेंसर',
    sensorTemp: 'कमरा के तापमान',
    sensorTempDesc: 'सुरक्षित: <50 °C | अलर्ट: 60 °C',
    sensorHumidity: 'हवा के नमी',
    sensorHumidityDesc: 'कमरा के नमी',
    sensorWifi: 'वाई-फाई सिग्नल',
    sensorWifiDesc: 'ESP32 सिग्नल',

    gasSafeDesc: 'हवा साफ बा। खाना बनावे खातिर सुरक्षित बा।',
    gasWarnDesc: 'हल्का गैस मिलल बा। पंखा चालू बा।',
    gasDangerDesc: 'भारी गैस रिसाव! गैस आ बिजली दुनों बंद (OFF) कइल गइल।',
    smokeSafeDesc: 'हवा साफ बा।',
    smokeAlertDesc: 'धुआं मिलल! सायरन बाजत बा।',
    flameSafeDesc: 'कवनो आग नइखे।',
    flameAlertDesc: 'आग मिलल! गैस आ मेन बिजली तुरंत बंद।',
    tempNormalDesc: 'सामान्य तापमान।',
    tempHotDesc: 'कमरा ढेर गरम बा।',

    valveOpenSimple: 'गैस चालू बा',
    valveClosedSimple: 'गैस बंद बा',
    powerLiveSimple: 'बिजली चालू (ON - 230V)',
    powerCutSimple: 'बिजली बंद (OFF - 0V कट)',
    fanOnSimple: 'पंखा चलत बा',
    fanOffSimple: 'पंखा बंद बा',
    alarmOnSimple: 'सायरन बाजत बा',
    alarmOffSimple: 'सायरन शांत बा',

    statusSafe: 'सुरक्षित',
    statusNormal: 'सामान्य',
    statusWarning: 'सावधानी',
    statusDanger: 'खतरा',
    statusAlert: 'अलर्ट',
    statusOpen: 'खुलाल / चालू',
    statusClosed: 'बंद / सुरक्षित',
    statusActive: 'चालू / ON',
    statusInactive: 'बंद / OFF',
    flameClear: 'कवनो आग नइखे',
    flameDetected: 'आग मिलल!',
    smokeClear: 'साफ हवा',
    smokeDetected: 'धुआं मिलल!',

    actuatorsTitle: 'हार्डवेयर कंट्रोल',
    actuatorsSubtitle: 'गैस, बिजली, पंखा, पानी फव्वारा आ सायरन के चलावल',
    valveName: 'गैस वाल्व',
    valveDesc: 'गैस पाइप के सप्लाई कंट्रोल करेला',
    powerCutName: 'मेन बिजली स्विच',
    powerCutDesc: 'स्विच ON = बिजली चालू; स्विच OFF = बिजली बंद (0V कट चिंगारी रोके खातिर)',
    fanName: 'पंखा',
    fanDesc: 'हवा बाहर फेंकेला',
    buzzerName: 'सायरन',
    buzzerDesc: 'तेज आवाज करेला',
    extinguisherName: 'पानी फव्वारा',
    extinguisherDesc: 'आग बुझावे खातिर पानी छिड़केला',

    openValve: 'गैस वाल्व खोलीं',
    closeValve: 'गैस बंद करीं',
    turnPowerOn: 'बिजली चालू करीं (ON)',
    turnPowerOff: 'बिजली बंद करीं (OFF)',
    cutPower: 'बिजली बंद करीं (OFF)',
    restorePower: 'बिजली चालू करीं (ON)',
    startFan: 'पंखा चलाईं',
    stopFan: 'पंखा रोकीं',
    startExtinguisher: 'पानी फव्वारा चलाईं',
    stopExtinguisher: 'पानी फव्वारा रोकीं',
    soundAlarm: 'सायरन टेस्ट करीं',
    silenceAlarm: 'सायरन बंद करीं',
    testSound: 'साउंड टेस्ट',

    audioAlertTitle: 'साउंड अलर्ट',
    audioAlarmPlaying: 'सायरन बाजत बा',
    muteSound: 'म्यूट करीं',
    unmuteSound: 'आवाज खोलीं',
    silenceAlarmAction: 'सायरन रोकीं',
    notificationPermissionTitle: 'ब्राउज़र अलर्ट खोलीं',
    closeAlert: 'अलर्ट बंद करीं',
    alertPopupTitle: 'खतरा के सुरक्षा अलर्ट',
    alertPopupSubtitle: 'तुरंत सुरक्षा कार्रवाई कइल गइल',

    gasPpmTrend: 'गैस ट्रेंड',
    smokeTrend: 'धुआं ट्रेंड',
    tempTrend: 'तापमान ट्रेंड (°C)',
    humidityTrend: 'नमी ट्रेंड (%)',
    liveReading: 'रीडिंग',
    averageReading: '1 घंटा के औसत',
    peakReading: 'उच्चतम रीडिंग',
    thresholdLimit: 'सुरक्षित सीमा',
    telemetryStream: 'लाइव टेलीमेट्री',
    realtimeGraph: 'लाइव ग्राफ',

    recentEvents: 'हाल के घटना',
    allEvents: 'घटना लॉग',
    noEvents: 'कवनो खतरा नइखे। सब ठीक बा।',
    eventType: 'घटना प्रकार',
    timestamp: 'समय',
    details: 'विवरण',
    severity: 'स्तर',

    thresholdSettings: 'सुरक्षा सीमा',
    thresholdSettingsDesc: 'स्वचालित ट्रिगर सेट करीं',
    saveSettings: 'सेटिंग सेव करीं',
    resetDefaults: 'डिफ़ॉल्ट करीं',
    settingsSavedSuccess: 'सेटिंग्स ESP32 में सेव हो गइल!',
    cancel: 'रद्द करीं',
    confirm: 'पुष्टि करीं',
    close: 'बंद करीं',
    loading: 'लोड होत बा...',
    filter: 'फ़िल्टर',
    search: 'खोजीं...',
    refresh: 'रिफ्रेश',
    viewAll: 'सभ देखीं',

    hardwareOverrideWarning: 'खतरा में गैस वाल्व ना खुली।',
    interlockActive: 'स्वचालित सुरक्षा चालू बा',
    interlockDesc: 'खतरा में बिजली अपने-आप बंद (OFF) आ गैस वाल्व बंद हो जाई।',
    emergencyLockdownTitle: 'आपातकालीन शटडाउन (एक क्लिक में)',
    emergencyLockdownSubtitle: 'गैस वाल्व बंद, बिजली बंद (OFF / 0V), पंखा चालू आ सायरन बजाईं।',
    emergencyLockdownActive: 'आपातकालीन लॉकडाउन चालू बा',
    emergencyLockdownDesc: 'गैस आ बिजली बंद बा।',
    resetEmergency: 'स्थिति रीसेट करीं',
    openValveConfirmDesc: 'गैस वाल्व खोलला से गैस चूल्हा तक जाई।',
    powerOffConfirmDesc: 'मेन बिजली बंद (OFF) कइला से चिंगारी के कवनो खतरा ना रही।',
    powerOnConfirmDesc: 'बिजली चालू (ON) करे से पहिले देख लीं कि कमरा में कवनो गैस नइखे।',

    valveHelpOpen: 'गैस चालू बा। खाना बनावे खातिर तैयार।',
    valveHelpClosed: 'गैस बंद बा। सुरक्षित बा।',
    powerHelpOn: 'मेन बिजली चालू बा (ON - 230V)।',
    powerHelpOff: 'मेन बिजली बंद बा (OFF / 0V कट)। चिंगारी रोकि दिहल गइल बा।',
    fanHelpOn: 'पंखा चलत बा।',
    fanHelpOff: 'पंखा शांत बा।',
    extinguisherHelpOn: 'पानी फव्वारा पानी छिड़कत बा।',
    extinguisherHelpOff: 'पानी फव्वारा तैयार बा।',
    buzzerHelpOn: 'सायरन तेज बाजत बा।',
    buzzerHelpOff: 'सायरन शांत बा।',

    fanTitleVisual: 'पंखा',
    extinguisherTitleVisual: 'पानी फव्वारा',
    buzzerTitleVisual: 'सायरन',
    valveTitleVisual: 'गैस पाइप',
    powerTitleVisual: 'बिजली स्विच',

    rotating: 'घूमत बा',
    stopped: 'रुकल बा',
    showering: 'छिड़काव चालू',
    standbyDry: 'तैयार मोड',
    sounding: 'बाजत बा',
    silentArmed: 'शांत',
    flowingOpen: 'खुलाल',
    isolatedClosed: 'बंद',
    powerGridLive: 'बिजली चालू (230V)',
    powerCutIsolated: 'बिजली बंद (0V कट)',

    hardwareRelayBus: 'ESP32 रिले',
    liveRunning: 'चालू',
    standbyIdle: 'शांत',
    nozzleDry: 'सूखल',
    readyToShower: 'तैयार बा',
    gasFlowingUnrestricted: 'चूल्हा तक गैस जात बा',
    gasIsolatedCylinder: 'गैस पूर्णतः बंद',
    mains230VActive: '230V बिजली चालू (पावर ON)',
    mains0VDeenergized: '0V बिजली बंद (पावर OFF / चिंगारी बंद)',

    chipAir: 'गैस',
    chipFire: 'आग',
    chipSmoke: 'धुआं',
    chipPower: 'बिजली',
    chipValve: 'वाल्व',
    chipShower: 'फव्वारा',
    gasDangerChip: 'गैस खतरा',
    warningChip: 'सावधानी',
    cleanSafeChip: 'साफ हवा',
    fireAlertChip: 'आग अलर्ट',
    noFlameChip: 'कवनो आग नइखे',
    smokeAlertChip: 'धुआं अलर्ट',
    cleanSmokeChip: 'कवनो धुआं नइखे',
    powerLiveChip: 'पावर ON (230V)',
    powerCutChip: 'पावर OFF (0V)',
    openFlowingChip: 'वाल्व खुलल',
    shutCutOffChip: 'वाल्व बंद',
    sprayingChip: 'छिड़काव',
    dryStandbyChip: 'स्टैंडबाय',

    sensorsProtected: 'सेंसर सुरक्षित',
    testBenchActive: 'टेस्ट बेंच सक्रिय',
    cutoff: 'कटऑफ',
    controller: 'कंट्रोलर',
    dataPipe: 'डेटा पाइप',
    sensorDevice: 'सेंसर उपकरण',
    whatItProtects: 'का बचावेला',
    esp32Pin: 'ESP32 पिन',
    currentReading: 'रीडिंग',
    safeLimit: 'सुरक्षित सीमा',
    condition: 'हालत',
    activeIncident: 'आपात घटना',
    dismiss: 'हटावीं',
    monitoringHeaderTitle: 'सेंसर डेटा',
    monitoringHeaderSubtitle: 'ESP32 से रियल-टाइम डेटा',
    alertsHeaderTitle: 'अलर्ट लॉग',
    alertsHeaderSubtitle: 'आपातकालीन घटना आ सुरक्षा कार्रवाई',
  },
};
