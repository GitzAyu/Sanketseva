export type Language = 'en' | 'hi' | 'bho';

export interface TranslationDictionary {
  // Brand & Header
  brandName: string;
  brandSubtitle: string;
  online: string;
  offline: string;
  waitingForSensors: string;
  demoReading: string;
  lastKnownReading: string;
  valveNeedsLiveReadings: string;
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
  currentReading: string;
  safeLimit: string;
  condition: string;
  activeIncident: string;
  dismiss: string;
  monitoringHeaderTitle: string;
  monitoringHeaderSubtitle: string;
  alertsHeaderTitle: string;
  alertsHeaderSubtitle: string;
  dashboardTitle: string;
  houseStatusTitle: string;
  houseStatusSubtitle: string;
  dashboardSubtitle: string;
  protectionActive: string;
  liveReadingsTitle: string;
  equipmentSubtitle: string;
  console: string;
  viewAlertPopup: string;
  powerOffBadge: string;
  privacyPolicy: string;
  termsConditions: string;
  mainsPower: string;
  powerOnShort: string;
  powerOffShort: string;
  statusGas: string;
  statusFire: string;
  statusSmoke: string;
  statusPower: string;
  statusValve: string;
  statusElevated: string;
  statusClean: string;
  statusNone: string;
  statusShut: string;
  historyTitle: string;
  historySubtitle: string;
  safetyEventsTab: string;
  sensorDataTab: string;
  exportCsv: string;
  searchEvents: string;
  timeColumn: string;
  eventColumn: string;
  actionColumn: string;
  noMatchingEvents: string;
  noActionRecorded: string;
  resolved: string;
  statusDetected: string;
  statusClear: string;
  statusComfortable: string;
  systemConfigTitle: string;
  systemConfigDesc: string;
  safetyAutoCutoffTitle: string;
  autoCutoffHelp: string;
  gasWarningLabel: string;
  gasWarningHelp: string;
  gasDangerLabel: string;
  gasDangerHelp: string;
  smokeDangerLabel: string;
  smokeDangerHelp: string;
  tempWarningLabel: string;
  tempWarningHelp: string;
  tempDangerLabel: string;
  tempDangerHelp: string;
  autoPowerLeak: string;
  autoPowerFire: string;
  autoPowerSmoke: string;
  saveConfiguration: string;
  soundSettingsTitle: string;
  soundMuteState: string;
  mutedByYou: string;
  soundArmed: string;
  saveSettingsError: string;
  validNumberError: string;
  positiveValueError: string;
  gasLimitOrderError: string;
  tempLimitOrderError: string;
  playSoundPreview: string;
  politeChime: string;
  softPulse: string;
  standardSiren: string;
  recommended: string;
  defaultBadge: string;
  calmBadge: string;
  loudBadge: string;
  politeChimeDesc: string;
  softPulseDesc: string;
  standardSirenDesc: string;
  safetySettingsSaved: string;
  filterAll: string;
  filterGas: string;
  filterFire: string;
  filterSmoke: string;
  filterPower: string;
  filterValve: string;
  filterFan: string;
  severityColumn: string;
  statusColumn: string;
  timestampColumn: string;
  gasHistoryColumn: string;
  smokeHistoryColumn: string;
  temperatureHistoryColumn: string;
  humidityHistoryColumn: string;
  flameHistoryColumn: string;
  eventSearchEmpty: string;
  signIn: string; createAccount: string; operatorSignIn: string; registerOperator: string;
  emailAddress: string; password: string; enterEmail: string; enterPassword: string; minPassword: string;
  authSignInHelp: string; authRegisterHelp: string; pleaseEnterEmail: string; pleaseEnterPassword: string; passwordTooShort: string;
  emailVerificationSent: string; verifyEmailRequired: string; resendVerification: string;
  forgotPassword: string; passwordResetSent: string;
  backToConsole: string; lastUpdated: string; privacyTitle: string; termsTitle: string; sound: string; selectAlertSound: string;
  both: string; gasOnly: string; smokeOnly: string; trendDescription: string; warn: string; last: string; statusLabel: string;
  showPassword: string; hidePassword: string;
  legalIntro: string; privacyData: string; termsSafety: string; termsResponsibility: string;
  working: string; commandSaved: string; commandFailed: string;
  minimum: string; maximum: string; latest: string;
  authFailed: string;
  menuLabel: string; lightMode: string; darkMode: string;
  never: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    brandName: 'Sanketseva',
    brandSubtitle: 'IoT LPG Gas, Fire & Smoke Safety System',
    online: 'ONLINE',
    offline: 'OFFLINE',
    waitingForSensors: 'Waiting for live sensor data',
    demoReading: 'Demo reading',
    lastKnownReading: 'Last reading',
    valveNeedsLiveReadings: 'Valve opening is unavailable until the device sends live sensor readings.',
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
    systemOfflineDesc: 'The safety device is not sending updates. Check its power and connection.',

    easyUnderstandingTitle: 'Safety Guide & System Explanation',
    easyUnderstandingSubtitle: 'How Sanketseva protects your kitchen from gas leaks, electrical fires, and smoke',
    howItWorks: 'How Sanketseva Works',
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
    sensorWifiDesc: 'Connection strength',

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
    alertPopupSubtitle: 'Immediate safety action taken by Sanketseva',

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
    settingsSavedSuccess: 'Safety settings saved successfully.',
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
    interlockDesc: 'Equipment states update automatically. Power turns off and the gas valve closes during emergencies.',
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

    hardwareRelayBus: 'Equipment connection',
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
    currentReading: 'Current Reading',
    safeLimit: 'Safe Limit',
    condition: 'Condition',
    activeIncident: 'ACTIVE EMERGENCY INCIDENT',
    dismiss: 'Dismiss',
    monitoringHeaderTitle: 'Sensor readings',
    monitoringHeaderSubtitle: 'Live readings from your safety device.',
    alertsHeaderTitle: 'Hazard Alerts & Incident Management',
    alertsHeaderSubtitle: 'Real-time emergency events, threshold breaches, and automated safety actions',
    dashboardTitle: 'Kitchen safety overview',
    houseStatusTitle: 'Equipment in your kitchen',
    houseStatusSubtitle: 'Live actuator states. Grey icons are off; colored icons are on.',
    dashboardSubtitle: 'Live readings and safety equipment status for your kitchen.',
    protectionActive: 'Protection active',
    liveReadingsTitle: 'Live sensor readings',
    equipmentSubtitle: 'Check and control your safety equipment.',
    console: 'Home',
    viewAlertPopup: 'View alert',
    powerOffBadge: 'Power off',
    privacyPolicy: 'Privacy',
    termsConditions: 'Terms',
    mainsPower: 'Power',
    powerOnShort: 'On',
    powerOffShort: 'Off',
    statusGas: 'Gas',
    statusFire: 'Fire',
    statusSmoke: 'Smoke',
    statusPower: 'Power',
    statusValve: 'Gas valve',
    statusElevated: 'High',
    statusClean: 'Clear',
    statusNone: 'None',
    statusShut: 'Closed',
    historyTitle: 'Safety history',
    historySubtitle: 'Review past alerts and sensor readings.',
    safetyEventsTab: 'Safety events',
    sensorDataTab: 'Sensor readings',
    exportCsv: 'Export CSV',
    searchEvents: 'Search events...',
    timeColumn: 'Time',
    eventColumn: 'Event',
    actionColumn: 'Action taken',
    noMatchingEvents: 'No events match your search.',
    noActionRecorded: 'No action recorded',
    resolved: 'Resolved',
    statusDetected: 'Detected',
    statusClear: 'Clear',
    statusComfortable: 'Normal',
    systemConfigTitle: 'Safety settings',
    systemConfigDesc: 'Choose when alerts and automatic safety actions should start.',
    safetyAutoCutoffTitle: 'Alert limits',
    autoCutoffHelp: 'When a reading reaches a danger limit, the system takes the selected safety actions.',
    gasWarningLabel: 'Gas warning level (ADC)',
    gasWarningHelp: 'Starts ventilation when gas begins to rise. Default: 400.',
    gasDangerLabel: 'Gas danger level (ADC)',
    gasDangerHelp: 'Closes the gas valve when this level is reached. Default: 500.',
    smokeDangerLabel: 'Smoke danger level (PPM)',
    smokeDangerHelp: 'Triggers an alert when smoke reaches this level. Default: 300.',
    tempWarningLabel: 'Temperature warning (°C)',
    tempWarningHelp: 'Shows a warning when the room reaches this temperature. Default: 50.',
    tempDangerLabel: 'Temperature danger (°C)',
    tempDangerHelp: 'Triggers safety actions when this temperature is reached. Default: 60.',
    autoPowerLeak: 'Turn off power when gas is detected',
    autoPowerFire: 'Turn off power when fire is detected',
    autoPowerSmoke: 'Turn off power when smoke is detected',
    saveConfiguration: 'Save settings',
    soundSettingsTitle: 'Alert sound',
    soundMuteState: 'Sound status',
    mutedByYou: 'Muted',
    soundArmed: 'On for alerts',
    saveSettingsError: 'Could not save settings. Check your connection and try again.',
    validNumberError: 'Enter a valid number for each limit.',
    positiveValueError: 'Each limit must be greater than zero.',
    gasLimitOrderError: 'The gas danger level must be higher than the warning level.',
    tempLimitOrderError: 'The temperature danger level must be higher than the warning level.',
    playSoundPreview: 'Preview sound',
    politeChime: 'Gentle chime',
    softPulse: 'Soft pulse',
    standardSiren: 'Standard siren',
    recommended: 'Recommended',
    defaultBadge: 'Default',
    calmBadge: 'Calm',
    loudBadge: 'Loud',
    politeChimeDesc: 'A gentle sound for clear, calm alerts.',
    softPulseDesc: 'A soft, steady tone for alerts.',
    standardSirenDesc: 'A louder siren for urgent alerts.',
    safetySettingsSaved: 'Safety settings saved.',
    filterAll: 'All',
    filterGas: 'Gas',
    filterFire: 'Fire',
    filterSmoke: 'Smoke',
    filterPower: 'Power',
    filterValve: 'Valve',
    filterFan: 'Fan',
    severityColumn: 'Level',
    statusColumn: 'Status',
    timestampColumn: 'Date and time',
    gasHistoryColumn: 'Gas (ADC)',
    smokeHistoryColumn: 'Smoke (PPM)',
    temperatureHistoryColumn: 'Temperature (°C)',
    humidityHistoryColumn: 'Humidity (%)',
    flameHistoryColumn: 'Fire',
    eventSearchEmpty: 'No matching events.',
    never: 'Never',
    signIn: 'Sign In', createAccount: 'Create Account', operatorSignIn: 'Operator Sign In', registerOperator: 'Register New Operator',
    emailAddress: 'Email Address', password: 'Password', enterEmail: 'Please enter your email address.', enterPassword: 'Please enter your password.', minPassword: 'Password must be at least 6 characters.',
    emailVerificationSent: "A verification link has been sent to your email. Click the link to verify your account, then sign in.",
    verifyEmailRequired: "Verify your email before entering the dashboard.",
    resendVerification: "Resend verification email",
    forgotPassword: 'Forgot password?', passwordResetSent: 'A password reset link has been sent to your email.',
    authSignInHelp: 'Sign in to view safety readings and controls.', authRegisterHelp: 'Create an account to access this safety system.', pleaseEnterEmail: 'Please enter your email address.', pleaseEnterPassword: 'Please enter your password.', passwordTooShort: 'Password must be at least 6 characters.',
    backToConsole: 'Back', lastUpdated: 'Last updated', privacyTitle: 'Privacy', termsTitle: 'Terms', sound: 'Sound', selectAlertSound: 'Choose alert sound', both: 'Both', gasOnly: 'Gas only', smokeOnly: 'Smoke only', trendDescription: 'Live sensor readings over time.', warn: 'Warning', last: 'Latest', statusLabel: 'Status', showPassword: 'Show password', hidePassword: 'Hide password', legalIntro: 'Information about how this safety system works and handles operational readings.', privacyData: 'The system uses sensor readings, equipment states, and account details to show safety status and record events.', termsSafety: 'This website helps you monitor readings and control connected equipment.', termsResponsibility: 'Always follow local emergency guidance. Do not rely on this website as your only safety measure.', working: 'Working…', commandSaved: 'Change saved.', commandFailed: 'Could not save the change. Check the connection and try again.', minimum: 'Min', maximum: 'Max', latest: 'Latest', authFailed: 'Sign-in failed. Check your details and try again.', menuLabel: 'Open menu', lightMode: 'Light mode', darkMode: 'Dark mode',
  },
  hi: {
    brandName: 'Sanketseva',
    brandSubtitle: 'IoT LPG गैस, आग और धुआं सुरक्षा प्रणाली',
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन',
    waitingForSensors: 'लाइव सेंसर डेटा का इंतज़ार',
    demoReading: 'डेमो रीडिंग',
    lastKnownReading: 'पिछली रीडिंग',
    valveNeedsLiveReadings: 'डिवाइस से लाइव सेंसर रीडिंग मिलने तक गैस वाल्व नहीं खुल सकता।',
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
    systemOfflineDesc: 'सुरक्षा उपकरण से नई जानकारी नहीं मिल रही है। बिजली और कनेक्शन जांचें।',

    easyUnderstandingTitle: 'सुरक्षा गाइड और प्रणाली विवरण',
    easyUnderstandingSubtitle: 'गैस रिसाव, बिजली की चिंगारी और धुएं से सुरक्षा',
    howItWorks: 'Sanketseva कैसे काम करता है',
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
    sensorWifiDesc: 'कनेक्शन की शक्ति',

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
    settingsSavedSuccess: 'सुरक्षा सेटिंग्स सेव हो गईं।',
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

    hardwareRelayBus: 'उपकरण कनेक्शन',
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
    currentReading: 'वर्तमान रीडिंग',
    safeLimit: 'सुरक्षित सीमा',
    condition: 'स्थिति',
    activeIncident: 'सक्रिय आपात घटना',
    dismiss: 'हटाएं',
    monitoringHeaderTitle: 'सेंसर की रीडिंग',
    monitoringHeaderSubtitle: 'आपके सुरक्षा उपकरण से ताज़ा जानकारी।',
    alertsHeaderTitle: 'अलर्ट व घटना प्रबंधन',
    alertsHeaderSubtitle: 'आपातकालीन घटनाएं व स्वचालित सुरक्षा क्रियाएं',
    dashboardTitle: 'रसोई सुरक्षा की जानकारी',
    houseStatusTitle: 'आपकी रसोई के उपकरण',
    houseStatusSubtitle: 'उपकरणों की लाइव स्थिति। धूसर आइकन बंद हैं और रंगीन आइकन चालू हैं।',
    dashboardSubtitle: 'रसोई के सेंसर और सुरक्षा उपकरणों की ताज़ा स्थिति।',
    protectionActive: 'सुरक्षा चालू है',
    liveReadingsTitle: 'सेंसर की ताज़ा रीडिंग',
    equipmentSubtitle: 'सुरक्षा उपकरणों की स्थिति देखें और उन्हें चलाएं।',
    console: 'मुखपृष्ठ',
    viewAlertPopup: 'अलर्ट देखें',
    powerOffBadge: 'बिजली बंद',
    privacyPolicy: 'गोपनीयता',
    termsConditions: 'नियम',
    mainsPower: 'बिजली',
    powerOnShort: 'चालू',
    powerOffShort: 'बंद',
    statusGas: 'गैस',
    statusFire: 'आग',
    statusSmoke: 'धुआं',
    statusPower: 'बिजली',
    statusValve: 'गैस वाल्व',
    statusElevated: 'बढ़ा हुआ',
    statusClean: 'साफ',
    statusNone: 'नहीं',
    statusShut: 'बंद',
    historyTitle: 'सुरक्षा का इतिहास',
    historySubtitle: 'पुराने अलर्ट और सेंसर रीडिंग देखें।',
    safetyEventsTab: 'सुरक्षा घटनाएं',
    sensorDataTab: 'सेंसर रीडिंग',
    exportCsv: 'CSV डाउनलोड करें',
    searchEvents: 'घटनाएं खोजें...',
    timeColumn: 'समय',
    eventColumn: 'घटना',
    actionColumn: 'की गई कार्रवाई',
    noMatchingEvents: 'आपकी खोज से कोई घटना नहीं मिली।',
    noActionRecorded: 'कोई कार्रवाई दर्ज नहीं है',
    resolved: 'सुलझा हुआ',
    statusDetected: 'पता चला',
    statusClear: 'साफ',
    statusComfortable: 'सामान्य',
    systemConfigTitle: 'सुरक्षा सेटिंग्स',
    systemConfigDesc: 'चुनें कि अलर्ट और अपने-आप सुरक्षा कार्रवाई कब शुरू हो।',
    safetyAutoCutoffTitle: 'अलर्ट की सीमाएं',
    autoCutoffHelp: 'खतरे की सीमा आने पर सिस्टम चुनी गई सुरक्षा कार्रवाई करेगा।',
    gasWarningLabel: 'गैस चेतावनी स्तर (ADC)',
    gasWarningHelp: 'गैस बढ़ने पर हवा निकालने वाला पंखा चालू होगा। डिफ़ॉल्ट: 400।',
    gasDangerLabel: 'गैस खतरे का स्तर (ADC)',
    gasDangerHelp: 'यह स्तर आने पर गैस वाल्व बंद होगा। डिफ़ॉल्ट: 500।',
    smokeDangerLabel: 'धुएं का खतरे का स्तर (PPM)',
    smokeDangerHelp: 'यह स्तर आने पर अलर्ट शुरू होगा। डिफ़ॉल्ट: 300।',
    tempWarningLabel: 'तापमान चेतावनी (°C)',
    tempWarningHelp: 'कमरे का तापमान यहां पहुंचने पर चेतावनी दिखेगी। डिफ़ॉल्ट: 50।',
    tempDangerLabel: 'तापमान खतरे का स्तर (°C)',
    tempDangerHelp: 'यह तापमान आने पर सुरक्षा कार्रवाई होगी। डिफ़ॉल्ट: 60।',
    autoPowerLeak: 'गैस मिलने पर बिजली बंद करें',
    autoPowerFire: 'आग मिलने पर बिजली बंद करें',
    autoPowerSmoke: 'धुआं मिलने पर बिजली बंद करें',
    saveConfiguration: 'सेटिंग्स सहेजें',
    soundSettingsTitle: 'अलर्ट की आवाज़',
    soundMuteState: 'आवाज़ की स्थिति',
    mutedByYou: 'म्यूट है',
    soundArmed: 'अलर्ट के लिए चालू',
    saveSettingsError: 'सेटिंग्स सहेजी नहीं जा सकीं। कनेक्शन जांचकर फिर कोशिश करें।',
    validNumberError: 'हर सीमा के लिए सही संख्या दर्ज करें।',
    positiveValueError: 'हर सीमा शून्य से अधिक होनी चाहिए।',
    gasLimitOrderError: 'गैस खतरे की सीमा चेतावनी सीमा से अधिक होनी चाहिए।',
    tempLimitOrderError: 'तापमान खतरे की सीमा चेतावनी सीमा से अधिक होनी चाहिए।',
    playSoundPreview: 'आवाज़ सुनें',
    politeChime: 'हल्की घंटी',
    softPulse: 'धीमी धुन',
    standardSiren: 'सामान्य सायरन',
    recommended: 'सुझाव',
    defaultBadge: 'डिफ़ॉल्ट',
    calmBadge: 'धीमा',
    loudBadge: 'तेज़',
    politeChimeDesc: 'शांत और हल्के अलर्ट के लिए मधुर आवाज़।',
    softPulseDesc: 'अलर्ट के लिए धीमी और स्थिर धुन।',
    standardSirenDesc: 'ज़रूरी अलर्ट के लिए तेज़ सायरन।',
    safetySettingsSaved: 'सुरक्षा सेटिंग्स सहेजी गईं।',
    filterAll: 'सभी',
    filterGas: 'गैस',
    filterFire: 'आग',
    filterSmoke: 'धुआं',
    filterPower: 'बिजली',
    filterValve: 'वाल्व',
    filterFan: 'पंखा',
    severityColumn: 'स्तर',
    statusColumn: 'स्थिति',
    timestampColumn: 'दिनांक और समय',
    gasHistoryColumn: 'गैस (ADC)',
    smokeHistoryColumn: 'धुआं (PPM)',
    temperatureHistoryColumn: 'तापमान (°C)',
    humidityHistoryColumn: 'नमी (%)',
    flameHistoryColumn: 'आग',
    eventSearchEmpty: 'कोई घटना नहीं मिली।',
    never: 'कभी नहीं',
    signIn: 'साइन इन', createAccount: 'खाता बनाएँ', operatorSignIn: 'ऑपरेटर साइन इन', registerOperator: 'नया ऑपरेटर पंजीकरण', emailAddress: 'ईमेल पता', password: 'पासवर्ड', enterEmail: 'अपना ईमेल पता दर्ज करें।', enterPassword: 'अपना पासवर्ड दर्ज करें।', minPassword: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।',
    emailVerificationSent: "आपके ईमेल पर सत्यापन लिंक भेजा गया है। खाता सत्यापित करने के लिए लिंक पर क्लिक करें, फिर साइन इन करें।",
    verifyEmailRequired: "डैशबोर्ड में जाने से पहले अपना ईमेल सत्यापित करें।",
    resendVerification: "सत्यापन ईमेल फिर भेजें",
    forgotPassword: 'पासवर्ड भूल गए?', passwordResetSent: 'पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया है।',
    authSignInHelp: 'सुरक्षा रीडिंग और नियंत्रण देखने के लिए साइन इन करें।', authRegisterHelp: 'इस सुरक्षा सिस्टम का उपयोग करने के लिए खाता बनाएँ।', pleaseEnterEmail: 'अपना ईमेल पता दर्ज करें।', pleaseEnterPassword: 'अपना पासवर्ड दर्ज करें।', passwordTooShort: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।',
    backToConsole: 'वापस जाएँ', lastUpdated: 'अंतिम अपडेट', privacyTitle: 'गोपनीयता', termsTitle: 'नियम', sound: 'आवाज़', selectAlertSound: 'अलर्ट की आवाज़ चुनें', both: 'दोनों', gasOnly: 'केवल गैस', smokeOnly: 'केवल धुआँ', trendDescription: 'समय के साथ सेंसर रीडिंग।', warn: 'चेतावनी', last: 'नवीनतम', statusLabel: 'स्थिति', showPassword: 'पासवर्ड दिखाएँ', hidePassword: 'पासवर्ड छिपाएँ', legalIntro: 'यह जानकारी सुरक्षा प्रणाली और इसके संचालन संबंधी डेटा के उपयोग के बारे में है।', privacyData: 'सिस्टम सुरक्षा स्थिति दिखाने और घटनाएँ दर्ज करने के लिए सेंसर रीडिंग, उपकरण स्थिति और खाते की जानकारी का उपयोग करता है।', termsSafety: 'यह वेबसाइट रीडिंग देखने और जुड़े उपकरणों को नियंत्रित करने में मदद करती है।', termsResponsibility: 'आपात स्थिति में स्थानीय सुरक्षा निर्देशों का पालन करें। केवल इस वेबसाइट पर निर्भर न रहें।', working: 'काम हो रहा है…', commandSaved: 'बदलाव सेव हो गया।', commandFailed: 'बदलाव सेव नहीं हो सका। कनेक्शन जाँचकर फिर कोशिश करें।', minimum: 'न्यूनतम', maximum: 'अधिकतम', latest: 'नवीनतम', authFailed: 'साइन इन नहीं हो सका। जानकारी जाँचकर फिर कोशिश करें।', menuLabel: 'मेन्यू खोलें', lightMode: 'लाइट मोड', darkMode: 'डार्क मोड',
  },
  bho: {
    brandName: 'Sanketseva',
    brandSubtitle: 'IoT रसोई गैस, आग अउर धुआं सुरक्षा प्रणाली',
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन',
    waitingForSensors: 'लाइव सेंसर डेटा के इंतजार में',
    demoReading: 'डेमो रीडिंग',
    lastKnownReading: 'पिछली रीडिंग',
    valveNeedsLiveReadings: 'डिवाइस से लाइव सेंसर रीडिंग मिले के बादे गैस वाल्व खुली।',
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
    systemOfflineDesc: 'सुरक्षा उपकरण से नया जानकारी नइखे मिलत। बिजली आ कनेक्शन जांचीं।',

    easyUnderstandingTitle: 'सुरक्षा गाइड',
    easyUnderstandingSubtitle: 'गैस रिसाव, चिंगारी आ धुआं से बचाव',
    howItWorks: 'Sanketseva कइसे काम करेला',
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
    sensorWifiDesc: 'कनेक्शन की शक्ति',

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
    settingsSavedSuccess: 'सुरक्षा सेटिंग सहेजल गइल।',
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

    hardwareRelayBus: 'उपकरण कनेक्शन',
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
    currentReading: 'रीडिंग',
    safeLimit: 'सुरक्षित सीमा',
    condition: 'हालत',
    activeIncident: 'आपात घटना',
    dismiss: 'हटावीं',
    monitoringHeaderTitle: 'सेंसर के रीडिंग',
    monitoringHeaderSubtitle: 'रउरा सुरक्षा उपकरण से ताज़ा जानकारी।',
    alertsHeaderTitle: 'अलर्ट लॉग',
    alertsHeaderSubtitle: 'आपातकालीन घटना आ सुरक्षा कार्रवाई',
    dashboardTitle: 'रसोई सुरक्षा के हाल',
    houseStatusTitle: 'रसोई के उपकरण',
    houseStatusSubtitle: 'उपकरण के लाइव हाल। धूसर चिन्ह बंद आ रंगीन चिन्ह चालू बा।',
    dashboardSubtitle: 'रसोई के सेंसर आ सुरक्षा उपकरण के ताज़ा स्थिति।',
    protectionActive: 'सुरक्षा चालू बा',
    liveReadingsTitle: 'सेंसर के ताज़ा रीडिंग',
    equipmentSubtitle: 'सुरक्षा उपकरण के स्थिति देखीं आ चलाईं।',
    console: 'होम',
    viewAlertPopup: 'अलर्ट देखीं',
    powerOffBadge: 'बिजली बंद',
    privacyPolicy: 'गोपनीयता',
    termsConditions: 'नियम',
    mainsPower: 'बिजली',
    powerOnShort: 'चालू',
    powerOffShort: 'बंद',
    statusGas: 'गैस',
    statusFire: 'आग',
    statusSmoke: 'धुआं',
    statusPower: 'बिजली',
    statusValve: 'गैस वाल्व',
    statusElevated: 'बढ़ल',
    statusClean: 'साफ',
    statusNone: 'ना',
    statusShut: 'बंद',
    historyTitle: 'सुरक्षा के इतिहास',
    historySubtitle: 'पुरान अलर्ट आ सेंसर रीडिंग देखीं।',
    safetyEventsTab: 'सुरक्षा घटना',
    sensorDataTab: 'सेंसर रीडिंग',
    exportCsv: 'CSV डाउनलोड करीं',
    searchEvents: 'घटना खोजीं...',
    timeColumn: 'समय',
    eventColumn: 'घटना',
    actionColumn: 'कइल कार्रवाई',
    noMatchingEvents: 'खोज में कवनो घटना ना मिलल।',
    noActionRecorded: 'कवनो कार्रवाई दर्ज नइखे',
    resolved: 'सुलझ गइल',
    statusDetected: 'पता चलल',
    statusClear: 'साफ',
    statusComfortable: 'सामान्य',
    systemConfigTitle: 'सुरक्षा सेटिंग',
    systemConfigDesc: 'चुनीं कि अलर्ट आ अपने-आप सुरक्षा कार्रवाई कब शुरू होखे।',
    safetyAutoCutoffTitle: 'अलर्ट के सीमा',
    autoCutoffHelp: 'खतरा सीमा पर सिस्टम चुनील सुरक्षा कार्रवाई करी।',
    gasWarningLabel: 'गैस चेतावनी स्तर (ADC)',
    gasWarningHelp: 'गैस बढ़े पर हवा निकाले वाला पंखा चली। डिफ़ॉल्ट: 400।',
    gasDangerLabel: 'गैस खतरा स्तर (ADC)',
    gasDangerHelp: 'ई स्तर पर गैस वाल्व बंद होई। डिफ़ॉल्ट: 500।',
    smokeDangerLabel: 'धुआं खतरा स्तर (PPM)',
    smokeDangerHelp: 'ई स्तर पर अलर्ट शुरू होई। डिफ़ॉल्ट: 300।',
    tempWarningLabel: 'तापमान चेतावनी (°C)',
    tempWarningHelp: 'कमरा के तापमान इहाँ पहुंचे पर चेतावनी मिली। डिफ़ॉल्ट: 50।',
    tempDangerLabel: 'तापमान खतरा स्तर (°C)',
    tempDangerHelp: 'ई तापमान पर सुरक्षा कार्रवाई होई। डिफ़ॉल्ट: 60।',
    autoPowerLeak: 'गैस मिले पर बिजली बंद करीं',
    autoPowerFire: 'आग मिले पर बिजली बंद करीं',
    autoPowerSmoke: 'धुआं मिले पर बिजली बंद करीं',
    saveConfiguration: 'सेटिंग सहेजीं',
    soundSettingsTitle: 'अलर्ट आवाज़',
    soundMuteState: 'आवाज के स्थिति',
    mutedByYou: 'म्यूट बा',
    soundArmed: 'अलर्ट खातिर चालू',
    saveSettingsError: 'सेटिंग ना सहेजल जा सकल। कनेक्शन जांच के फेर कोशिश करीं।',
    validNumberError: 'हर सीमा खातिर सही नंबर डालीं।',
    positiveValueError: 'हर सीमा शून्य से ऊपर होखे के चाहीं।',
    gasLimitOrderError: 'गैस खतरा सीमा चेतावनी सीमा से ऊपर होखे के चाहीं।',
    tempLimitOrderError: 'तापमान खतरा सीमा चेतावनी सीमा से ऊपर होखे के चाहीं।',
    playSoundPreview: 'आवाज सुनाईं',
    politeChime: 'हल्का घंटी',
    softPulse: 'धीमा धुन',
    standardSiren: 'सामान्य सायरन',
    recommended: 'सुझाव',
    defaultBadge: 'डिफ़ॉल्ट',
    calmBadge: 'धीमा',
    loudBadge: 'तेज',
    politeChimeDesc: 'शांत अलर्ट खातिर हल्का मधुर आवाज।',
    softPulseDesc: 'अलर्ट खातिर धीमा आ स्थिर धुन।',
    standardSirenDesc: 'जरूरी अलर्ट खातिर तेज सायरन।',
    safetySettingsSaved: 'सुरक्षा सेटिंग सहेजल गइल।',
    filterAll: 'सब',
    filterGas: 'गैस',
    filterFire: 'आग',
    filterSmoke: 'धुआं',
    filterPower: 'बिजली',
    filterValve: 'वाल्व',
    filterFan: 'पंखा',
    severityColumn: 'स्तर',
    statusColumn: 'स्थिति',
    timestampColumn: 'तारीख आ समय',
    gasHistoryColumn: 'गैस (ADC)',
    smokeHistoryColumn: 'धुआं (PPM)',
    temperatureHistoryColumn: 'तापमान (°C)',
    humidityHistoryColumn: 'नमी (%)',
    flameHistoryColumn: 'आग',
    eventSearchEmpty: 'कवनो घटना ना मिलल।',
    never: 'कबो ना',
    signIn: 'लॉगिन करीं', createAccount: 'खाता बनाईं', operatorSignIn: 'ऑपरेटर लॉगिन', registerOperator: 'नया ऑपरेटर जोड़ीं', emailAddress: 'ईमेल पता', password: 'पासवर्ड', enterEmail: 'अपना ईमेल पता डालीं।', enterPassword: 'अपना पासवर्ड डालीं।', minPassword: 'पासवर्ड कम से कम 6 अक्षर के होखे के चाहीं।',
    emailVerificationSent: "रउरा ईमेल पर सत्यापन लिंक भेजल गइल बा। खाता सत्यापित करे खातिर लिंक पर क्लिक करीं, फेर लॉगिन करीं।",
    verifyEmailRequired: "डैशबोर्ड पर जाए से पहिले आपन ईमेल सत्यापित करीं।",
    resendVerification: "सत्यापन ईमेल फेर भेजीं",
    forgotPassword: 'पासवर्ड भुला गइल बानी?', passwordResetSent: 'पासवर्ड रीसेट लिंक रउरा ईमेल पर भेजल गइल बा।',
    authSignInHelp: 'सुरक्षा रीडिंग आ कंट्रोल देखे खातिर लॉगिन करीं।', authRegisterHelp: 'सुरक्षा सिस्टम चलावे खातिर खाता बनाईं।', pleaseEnterEmail: 'अपना ईमेल पता डालीं।', pleaseEnterPassword: 'अपना पासवर्ड डालीं।', passwordTooShort: 'पासवर्ड कम से कम 6 अक्षर के होखे के चाहीं।',
    backToConsole: 'वापस जाईं', lastUpdated: 'आखिरी अपडेट', privacyTitle: 'गोपनीयता', termsTitle: 'नियम', sound: 'आवाज', selectAlertSound: 'अलर्ट के आवाज चुनीं', both: 'दूनो', gasOnly: 'खाली गैस', smokeOnly: 'खाली धुआं', trendDescription: 'समय के साथ सेंसर रीडिंग।', warn: 'चेतावनी', last: 'नया', statusLabel: 'स्थिति', showPassword: 'पासवर्ड देखीं', hidePassword: 'पासवर्ड छिपाईं', legalIntro: 'ई जानकारी सुरक्षा सिस्टम आ ओकर संचालन डेटा के बारे में बा।', privacyData: 'सिस्टम सुरक्षा स्थिति देखावे आ घटना दर्ज करे खातिर सेंसर रीडिंग, उपकरण स्थिति आ खाता जानकारी के उपयोग करेला।', termsSafety: 'ई वेबसाइट रीडिंग देखे आ जुड़ल उपकरण चलावे में मदद करेला।', termsResponsibility: 'आपातकाल में स्थानीय सुरक्षा निर्देश मानीं। खाली एह वेबसाइट पर निर्भर मत रहीं।', working: 'काम हो रहल बा…', commandSaved: 'बदलाव सहेजल गइल।', commandFailed: 'बदलाव ना सहेजल जा सकल। कनेक्शन देख के फेर कोशिश करीं।', minimum: 'न्यूनतम', maximum: 'अधिकतम', latest: 'नया', authFailed: 'लॉगिन ना हो सकल। जानकारी जाँच के फेर कोशिश करीं।', menuLabel: 'मेन्यू खोलीं', lightMode: 'लाइट मोड', darkMode: 'डार्क मोड',
  },
};
