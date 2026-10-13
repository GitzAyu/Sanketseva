/**
 * AudioAlertService - Browser-native Web Audio API emergency sound synthesizer.
 * Generates polite, pleasant acoustic chimes and harmonic alerts by default,
 * with optional classic sirens. No external audio files needed.
 */

export type AlertSoundStyle = 'polite' | 'soft_pulse' | 'classic';
export type HazardAudioType = 'lpg' | 'flame' | 'smoke' | 'critical';

class AudioAlertService {
  private ctx: AudioContext | null = null;
  private isMutedState: boolean = false;
  private isAlarmPlaying: boolean = false;
  private soundStyle: AlertSoundStyle = 'polite';
  private intervalId: number | null = null;
  private currentHazard: HazardAudioType | null = null;
  private activeNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
  private listeners: Set<
    (isPlaying: boolean, hazard: HazardAudioType | null, style: AlertSoundStyle) => void
  > = new Set();

  constructor() {
    try {
      const savedMute = localStorage.getItem('gasguard_audio_muted');
      if (savedMute !== null) {
        this.isMutedState = savedMute === 'true';
      }
      const savedStyle = localStorage.getItem('gasguard_audio_style') as AlertSoundStyle | null;
      if (savedStyle === 'polite' || savedStyle === 'soft_pulse' || savedStyle === 'classic') {
        this.soundStyle = savedStyle;
      } else {
        this.soundStyle = 'polite'; // Default to polite alert sound as requested
      }
    } catch {
      // ignore
    }

    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      };
      window.addEventListener('click', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true });
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public subscribe(
    cb: (isPlaying: boolean, hazard: HazardAudioType | null, style: AlertSoundStyle) => void
  ): () => void {
    this.listeners.add(cb);
    cb(this.isAlarmPlaying, this.currentHazard, this.soundStyle);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isAlarmPlaying, this.currentHazard, this.soundStyle));
  }

  public isMuted(): boolean {
    return this.isMutedState;
  }

  public isPlaying(): boolean {
    return this.isAlarmPlaying;
  }

  public getCurrentHazard(): HazardAudioType | null {
    return this.currentHazard;
  }

  public getSoundStyle(): AlertSoundStyle {
    return this.soundStyle;
  }

  public setSoundStyle(style: AlertSoundStyle): void {
    this.soundStyle = style;
    try {
      localStorage.setItem('gasguard_audio_style', style);
    } catch {
      // ignore
    }
    this.notify();
    if (this.isAlarmPlaying && this.currentHazard) {
      this.startAlarm(this.currentHazard);
    }
  }

  public setMuted(muted: boolean): void {
    this.isMutedState = muted;
    try {
      localStorage.setItem('gasguard_audio_muted', String(muted));
    } catch {
      // ignore
    }
    if (muted) {
      this.stopAlarm();
    }
    this.notify();
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMutedState);
    return this.isMutedState;
  }

  /**
   * Starts audible alert sound based on current soundStyle.
   */
  public startAlarm(hazard: HazardAudioType = 'critical'): void {
    if (this.isMutedState) return;
    const ctx = this.initContext();
    if (!ctx) return;

    // Prevent retriggering identical active cycle
    if (this.isAlarmPlaying && this.currentHazard === hazard && this.intervalId !== null) {
      return;
    }

    this.stopAlarm();
    this.isAlarmPlaying = true;
    this.currentHazard = hazard;
    this.notify();

    if (this.soundStyle === 'polite') {
      this.playPoliteChimeLoop(ctx, hazard);
    } else if (this.soundStyle === 'soft_pulse') {
      this.playSoftPulseLoop(ctx);
    } else {
      this.playClassicSirenLoop(ctx, hazard);
    }
  }

  /**
   * POLITE ALERT SOUND:
   * Smooth, harmonic acoustic double-chime with soft envelope attack and gentle decay.
   * Clear and noticeable, but pleasant, calm, and non-jarring.
   */
  private playSinglePoliteChime(ctx: AudioContext, pitchOffset: number = 0) {
    if (!this.isAlarmPlaying || this.isMutedState) return;

    // Harmonious chord notes: E5 (659.25Hz) -> G#5 (830.6Hz)
    const baseFreq1 = 659.25 + pitchOffset; // Note E5
    const baseFreq2 = 830.61 + pitchOffset; // Note G#5
    const now = ctx.currentTime;

    // Note 1 (Warm chime 1)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq1, now);

    // Smooth envelope: soft rise, gentle acoustic decay
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.12, now + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.7);

    // Note 2 (Warm higher chime, slightly delayed by 140ms for classic polite chime feel)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baseFreq2, now + 0.14);

    gain2.gain.setValueAtTime(0.001, now);
    gain2.gain.setValueAtTime(0.001, now + 0.14);
    gain2.gain.linearRampToValueAtTime(0.14, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.14);
    osc2.stop(now + 0.9);

    this.activeNodes.push({ osc: osc1, gain: gain1 }, { osc: osc2, gain: gain2 });
  }

  private playPoliteChimeLoop(ctx: AudioContext, hazard: HazardAudioType) {
    // Play immediately
    const offset = hazard === 'flame' ? 60 : hazard === 'smoke' ? 30 : 0;
    this.playSinglePoliteChime(ctx, offset);

    // Repeat politely every 2.4 seconds
    this.intervalId = window.setInterval(() => {
      if (!this.isAlarmPlaying || this.isMutedState) {
        if (this.intervalId) clearInterval(this.intervalId);
        return;
      }
      this.playSinglePoliteChime(ctx, offset);
    }, 2400);
  }

  /**
   * SOFT PULSE SOUND:
   * Gentle sinusoidal wave that swells and softens calmly.
   */
  private playSoftPulseLoop(ctx: AudioContext) {
    const playPulse = () => {
      if (!this.isAlarmPlaying || this.isMutedState) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5 note

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.8);
      this.activeNodes.push({ osc, gain });
    };

    playPulse();
    this.intervalId = window.setInterval(playPulse, 1800);
  }

  /**
   * CLASSIC SIREN SOUND (For users who prefer industrial sirens):
   */
  private playClassicSirenLoop(ctx: AudioContext, hazard: HazardAudioType) {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.12, now);
      osc.connect(gain);
      gain.connect(ctx.destination);

      let toggle = false;
      const freqHigh = hazard === 'smoke' ? 2400 : 880;
      const freqLow = hazard === 'smoke' ? 1800 : 660;

      const step = () => {
        if (!this.isAlarmPlaying || !this.ctx) return;
        const t = ctx.currentTime;
        osc.frequency.setValueAtTime(toggle ? freqLow : freqHigh, t);
        toggle = !toggle;
      };

      step();
      osc.start();
      this.activeNodes.push({ osc, gain });
      this.intervalId = window.setInterval(step, 400);
    } catch (e) {
      console.warn('Audio synthesis note:', e);
    }
  }

  /**
   * Stops the ongoing alert sound immediately.
   */
  public stopAlarm(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.activeNodes.forEach(({ osc, gain }) => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch {
        // ignore
      }
    });
    this.activeNodes = [];
    this.isAlarmPlaying = false;
    this.currentHazard = null;
    this.notify();
  }

  /**
   * Test plays the alert sound once.
   */
  public testSound(): void {
    const ctx = this.initContext();
    if (!ctx) return;
    this.stopAlarm();
    this.isAlarmPlaying = true;
    this.currentHazard = 'critical';
    this.notify();

    if (this.soundStyle === 'polite') {
      this.playSinglePoliteChime(ctx, 0);
    } else if (this.soundStyle === 'soft_pulse') {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.8);
      this.activeNodes.push({ osc, gain });
    } else {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(780, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
      this.activeNodes.push({ osc, gain });
    }

    setTimeout(() => {
      this.stopAlarm();
    }, 1000);
  }
}

export const audioAlertService = new AudioAlertService();
