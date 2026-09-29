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
  // 3 pequeños impactos sucesivos simulando el rebote del dado
  [0, 0.08, 0.18].forEach((offset) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(220 + Math.random() * 80, now + offset);
    osc.frequency.exponentialRampToValueAtTime(80, now + offset + 0.06);

    gain.gain.setValueAtTime(0.15, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + offset);
    osc.stop(now + offset + 0.07);
  });
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

  gain.gain.setValueAtTime(isFinal ? 0.25 : 0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + (isFinal ? 0.4 : 0.15));

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + (isFinal ? 0.45 : 0.2));
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
    gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.12 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.12);
    osc.stop(now + idx * 0.12 + 0.65);
  });
}
