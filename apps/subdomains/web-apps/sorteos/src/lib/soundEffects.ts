/**
 * Generador de efectos de sonido procedurales con Web Audio API.
 * No requiere archivos MP3/WAV externos, tiene 0ms de latencia de red y no falla con 404s.
 */

let audioCtx: AudioContext | null = null;
let soundMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isAudioMuted(): boolean {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('sorteos_sound_muted');
    if (stored !== null) return stored === 'true';
  }
  return soundMuted;
}

export function toggleAudioMute(): boolean {
  soundMuted = !isAudioMuted();
  if (typeof window !== 'undefined') {
    localStorage.setItem('sorteos_sound_muted', String(soundMuted));
  }
  return soundMuted;
}

/** Sonido de moneda volando por el aire */
export function playCoinFlipSound(): void {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(1400, now + 0.3);
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.7);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.75);
}

/** Sonido de impacto metálico de la moneda al caer */
export function playCoinLandSound(isCara: boolean = true): void {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const baseFreq = isCara ? 1760 : 1318.51; // A6 or E6

  [baseFreq, baseFreq * 1.5, baseFreq * 2.2].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    const volume = (0.15 / (idx + 1));
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  });
}

/** Sonido de dados chocando */
export function playDiceSound(): void {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  [0, 0.08, 0.18, 0.28].forEach((offset) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(240 + Math.random() * 120, now + offset);
    osc.frequency.exponentialRampToValueAtTime(70, now + offset + 0.07);

    gain.gain.setValueAtTime(0.18, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + offset);
    osc.stop(now + offset + 0.08);
  });
}

/** Sonido de clic/tac de la ruleta al girar */
export function playWheelTick(): void {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1400, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.04);
}

/** Sonido de bola de lotería / número rebotando */
export function playBallBounce(): void {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(587.33, now); // D5
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.16, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.24);
}

/** Sonido de barajado / reparto de tarjetas para equipos */
export function playCardFlip(): void {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(350, now);
  osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.15);
}

/** Sonido de cuenta regresiva (3, 2, 1...) */
export function playCountdownTick(isFinal: boolean = false): void {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = isFinal ? 'triangle' : 'sine';
  osc.frequency.setValueAtTime(isFinal ? 880 : 440, now);

  gain.gain.setValueAtTime(isFinal ? 0.3 : 0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + (isFinal ? 0.45 : 0.2));

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + (isFinal ? 0.5 : 0.22));
}

/** Redoble de tambores / suspense durante cuenta regresiva */
export function playDrumRoll(durationSeconds: number = 2.5): void {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const count = Math.floor(durationSeconds * 20); // 20 hits por segundo
  for (let i = 0; i < count; i++) {
    const time = ctx.currentTime + (i * 0.05);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(160 + Math.random() * 40, time);
    osc.frequency.exponentialRampToValueAtTime(60, time + 0.04);

    const volume = 0.03 + (i / count) * 0.12; // In crescendo emocionante
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.045);
  }
}

/** Fanfarria triunfal de ganador */
export function playWinnerFanfare(): void {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Acordes mayores triunfales: Do - Mi - Sol - Do alta
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.12);

    gain.gain.setValueAtTime(0.001, now + idx * 0.12);
    gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.12 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.65);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.12);
    osc.stop(now + idx * 0.12 + 0.7);
  });
}
