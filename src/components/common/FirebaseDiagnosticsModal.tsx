import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Copy,
  ExternalLink,
  ShieldAlert,
  Radio,
  Check,
  Server,
  Zap,
} from 'lucide-react';
import {
  testFirebaseDiagnostics,
  FirebaseDiagnosticResult,
  updateActuatorsInFirebase,
  userFirebaseConfig,
  RTDB_BASE_URL,
} from '../../firebase/firebase';
import { useDevice } from '../../context/DeviceContext';

interface FirebaseDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseDiagnosticsModal: React.FC<FirebaseDiagnosticsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { device } = useDevice();
  const [diagnostics, setDiagnostics] = useState<FirebaseDiagnosticResult | null>(null);
  const [testing, setTesting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [testWriteStatus, setTestWriteStatus] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setTesting(true);
    setTestWriteStatus(null);
    try {
      const res = await testFirebaseDiagnostics();
      setDiagnostics(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runDiagnostics();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const rtdbRulesCode = `{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}`;

  const handleCopyRules = () => {
    navigator.clipboard.writeText(rtdbRulesCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendTestWrite = async () => {
    setTesting(true);
    setTestWriteStatus('Sending live test state to Firebase...');
    const res = await updateActuatorsInFirebase(
      {
        valve: device.actuators.valve.state,
        powerCut: device.actuators.powerCut.state,
        fan: device.actuators.fan.state,
        buzzer: device.actuators.buzzer.state,
        extinguisher: device.actuators.extinguisher.state,
      },
      'Sanketseva Diagnostics Probe'
    );
    setTesting(false);
    if (res.success) {
      setTestWriteStatus(
        `✅ Live Firebase sync confirmed! ${
          res.provisionedOk ? 'Cloud Firestore updated. ' : ''
        }${res.userOk ? 'User database updated.' : ''}`
      );
      runDiagnostics();
    } else {
      setTestWriteStatus(`❌ Write failed: ${res.error || 'Permission denied by Firebase Security Rules.'}`);
    }
  };

  const isFirestoreReachable = diagnostics?.userFirestoreReachable;
  const isRtdbReachable = diagnostics?.userRtdbReachable;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="firebase-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto transition-colors duration-200">
        {/* Top-Right Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800 pr-10">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-600 dark:text-emerald-400 shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 id="firebase-modal-title" className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                Sanketseva Sync Status
              </h2>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Real-time synchronization for IoT actuators, power cut breaker, and gas safety interlocks
            </p>
          </div>
        </div>

        {/* Live Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {/* Card 1: User database connection */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Primary database connection</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isRtdbReachable
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                    : diagnostics?.userRtdbError
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {isRtdbReachable ? 'REACHABLE' : diagnostics?.userRtdbError ? 'CHECK RULES' : 'CHECKING'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
              {RTDB_BASE_URL}
            </p>
            {diagnostics?.authAuthenticated && (
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                Auth: {diagnostics.authEmail}
              </p>
            )}
            {diagnostics?.userRtdbError && !isRtdbReachable && (
              <p className="mt-2 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl border border-amber-200 dark:border-amber-900 leading-relaxed font-medium">
                {diagnostics.userRtdbError}
              </p>
            )}
            {isRtdbReachable && (
              <p className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-xl border border-emerald-200 dark:border-emerald-900 leading-relaxed font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Realtime Database read is working. Actuator commands confirm writes when they succeed.</span>
              </p>
            )}
          </div>

          {/* Card 2: Cloud Firestore & Realtime Persistence */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Cloud Persistence</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isFirestoreReachable
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {isFirestoreReachable ? 'REACHABLE' : 'NOT CONNECTED'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
              Firestore connection
            </p>
            <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate mt-0.5">
              Cloud storage connection
            </p>
            <p className={`mt-2 text-[11px] p-2 rounded-xl border leading-relaxed font-medium flex items-center gap-1.5 ${isFirestoreReachable ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900' : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'}`}>
              {isFirestoreReachable ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
              <span>{isFirestoreReachable ? 'Firestore is reachable. Actuator and ESP32 state sync uses Realtime Database.' : diagnostics?.userFirestoreError || 'Firestore has not connected yet.'}</span>
            </p>
          </div>
        </div>

        {/* 1-Minute Fix Guide for User RTDB Rules if locked */}
        {!isRtdbReachable && diagnostics?.userRtdbError && (
          <div className="p-4.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-2xl mb-5 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <h3 className="text-xs font-bold text-amber-950 dark:text-amber-200 uppercase tracking-wider">
                Realtime Database security rules
              </h3>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Sign in to this app and publish authenticated database rules. Do not allow public reads or writes:
            </p>

            <div className="space-y-2 text-xs">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                1. Open Realtime Database Rules in your Firebase Console:
              </p>
              <a
                href={`https://console.firebase.google.com/project/${userFirebaseConfig.projectId}/database/${userFirebaseConfig.projectId}-default-rtdb/rules`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors shadow-2xs text-xs cursor-pointer"
              >
                <span>Open Firebase Console Rules</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <p className="font-semibold text-slate-800 dark:text-slate-200 pt-1">
                2. Paste the authenticated rules from <code>database.rules.json</code> and click <strong>Publish</strong>:
              </p>
              <div className="relative">
                <pre className="bg-slate-900 text-emerald-300 p-3 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                  {rtdbRulesCode}
                </pre>
                <button
                  type="button"
                  onClick={handleCopyRules}
                  className="absolute top-2 right-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-slate-700"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy Auth Rules'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Test Result Message */}
        {testWriteStatus && (
          <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200">
            {testWriteStatus}
          </div>
        )}

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={runDiagnostics}
              disabled={testing}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Checking...' : 'Re-test Connection'}</span>
            </button>

            <button
              type="button"
              onClick={handleSendTestWrite}
              disabled={testing}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Test Actuator Sync Now</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
