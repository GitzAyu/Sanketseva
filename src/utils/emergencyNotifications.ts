/**
 * Emergency Notification Service
 * Dispatches browser system notifications (Notification API) and coordinates in-app emergency alert broadcasts.
 */

export interface EmergencyAlertPayload {
  id: string;
  hazardType: 'LPG' | 'FLAME' | 'SMOKE' | 'TEMPERATURE' | 'CRITICAL';
  title: string;
  message: string;
  value?: string | number;
  timestamp: number;
  actionsSuggested: string[];
}

type AlertListener = (alert: EmergencyAlertPayload | null) => void;

class EmergencyNotificationService {
  private currentActiveAlert: EmergencyAlertPayload | null = null;
  private listeners: Set<AlertListener> = new Set();
  private lastNotificationTime: number = 0;
  private notificationCooldownMs: number = 8000; // 8s cooldown between native OS notification popups

  constructor() {
    this.requestPermission();
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    if (Notification.permission === 'default') {
      try {
        return await Notification.requestPermission();
      } catch {
        return 'denied';
      }
    }
    return Notification.permission;
  }

  public subscribe(cb: AlertListener): () => void {
    this.listeners.add(cb);
    cb(this.currentActiveAlert);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.currentActiveAlert));
  }

  public getActiveAlert(): EmergencyAlertPayload | null {
    return this.currentActiveAlert;
  }

  /**
   * Triggers an emergency notification across browser and in-app display.
   */
  public triggerEmergency(payload: Omit<EmergencyAlertPayload, 'id' | 'timestamp'>): void {
    const alert: EmergencyAlertPayload = {
      ...payload,
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
    };
    this.currentActiveAlert = alert;
    this.notify();

    // Trigger Native Browser Desktop/Mobile Notification if permitted
    const now = Date.now();
    if (now - this.lastNotificationTime > this.notificationCooldownMs) {
      this.lastNotificationTime = now;
      this.dispatchNativeNotification(alert);
    }
  }

  private dispatchNativeNotification(alert: EmergencyAlertPayload) {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    try {
      const n = new Notification(`🚨 ${alert.title}`, {
        body: `${alert.message}\nSuggested: ${alert.actionsSuggested.join(', ')}`,
        icon: '/favicon.svg',
        tag: 'gasguard-emergency',
        requireInteraction: true,
      });
      n.onclick = () => {
        window.focus();
        n.close();
      };
    } catch {
      // In some sandboxed iframes Notification constructor might throw, ignore safely
    }
  }

  /**
   * Clears the current emergency alert
   */
  public dismissAlert(): void {
    this.currentActiveAlert = null;
    this.notify();
  }
}

export const emergencyNotificationService = new EmergencyNotificationService();
