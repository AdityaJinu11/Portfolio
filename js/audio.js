/**
 * HAWKINS SOUND SYSTEM (Web Audio API Synthesizer)
 * Synthesizes retro 80s arcade zaps, lo-fi synthwave arpeggios,
 * dice clatters, VCR mechanical clicks, and eerie Demogorgon growls.
 */

class HawkinsAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.tempo = 115; // BPM
    this.step = 0;
    this.masterGain = null;
    this.bgmGain = null;
    this.sfxGain = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.bgmGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);
  }

  resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // 1. Arcade Coin Inserter Sound (two crisp metallic resonant chimes)
  playCoinSound() {
    if (this.isMuted) return;
    this.resume();
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, now); // B5
    osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain1);
    gain1.connect(this.sfxGain);

    osc1.start(now);
    osc1.stop(now + 0.35);
  }

  // 2. Violent 80s Arcade Zap & Glitch
  playArcadeZap() {
    if (this.isMuted) return;
    this.resume();
    const now = this.ctx.currentTime;

    // Fast downward pitch sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1600, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.28);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    // Filter sweep
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(4000, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.3);

    // Layer with short noise burst for glitch grit
    this.playNoiseBurst(0.15, 0.4);
  }

  // Short retro noise burst
  playNoiseBurst(duration = 0.1, volume = 0.3) {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 3;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
  }

  // 3. D&D 20-sided Die Clatter
  playDiceRoll() {
    if (this.isMuted) return;
    this.resume();
    // Simulate tumbling clicks
    const clicks = [0.0, 0.06, 0.13, 0.21, 0.28, 0.37, 0.48];
    clicks.forEach((delay, idx) => {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const pitch = 200 + Math.random() * 180 + (idx === clicks.length - 1 ? 60 : 0);
        osc.frequency.setValueAtTime(pitch, now);
        osc.frequency.exponentialRampToValueAtTime(pitch * 0.4, now + 0.04);

        gain.gain.setValueAtTime(0.25 - idx * 0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.05);
      }, delay * 1000);
    });
  }

  // 4. VCR Mechanical Tape Click & Motor Whir
  playVcrInsert() {
    if (this.isMuted) return;
    this.resume();
    const now = this.ctx.currentTime;

    // Heavy mechanical latch click
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(140, now);
    osc1.frequency.exponentialRampToValueAtTime(40, now + 0.08);
    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc1.connect(gain1);
    gain1.connect(this.sfxGain);
    osc1.start(now);
    osc1.stop(now + 0.09);

    // Second motorized whir
    setTimeout(() => {
      if (!this.ctx || this.isMuted) return;
      const t = this.ctx.currentTime;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(95, t);
      osc2.frequency.linearRampToValueAtTime(130, t + 0.25);
      osc2.frequency.exponentialRampToValueAtTime(50, t + 0.45);

      gain2.gain.setValueAtTime(0.2, t);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      const f = this.ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 650;

      osc2.connect(f);
      f.connect(gain2);
      gain2.connect(this.sfxGain);
      osc2.start(t);
      osc2.stop(t + 0.45);
    }, 120);
  }

  // 5. Electric Christmas Lightbulb Click & Buzz
  playBulbBuzz(letter = 'A') {
    if (this.isMuted) return;
    this.resume();
    const now = this.ctx.currentTime;

    // Pitch mapped to letter frequency (A=220, Z=580)
    const code = letter.charCodeAt(0) || 65;
    const baseFreq = 220 + ((code - 65) % 26) * 14;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(baseFreq, now);

    // Warm electrical buzz filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(baseFreq * 2, now);
    filter.Q.value = 4;

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // 6. Demogorgon Sub-Bass Roar & Spooky Growl
  playDemogorgonGrowl() {
    if (this.isMuted) return;
    this.resume();
    const now = this.ctx.currentTime;

    // Deep sub bass wave
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sawtooth';
    sub.frequency.setValueAtTime(65, now);
    sub.frequency.linearRampToValueAtTime(32, now + 1.2);
    sub.frequency.exponentialRampToValueAtTime(20, now + 1.8);

    subGain.gain.setValueAtTime(0.6, now);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 1.8);

    // Distortion wave shaping
    const distortion = this.ctx.createWaveShaper();
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    const k = 50;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    distortion.curve = curve;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, now);
    filter.frequency.linearRampToValueAtTime(140, now + 1.8);

    sub.connect(distortion);
    distortion.connect(filter);
    filter.connect(subGain);
    subGain.connect(this.sfxGain);

    sub.start(now);
    sub.stop(now + 1.8);

    // Rumble tremor noise
    this.playNoiseBurst(1.4, 0.35);
  }

  // 7. Ambient Hawkins Synthwave BGM (The Arpeggiator & Pad)
  startAmbientSynth() {
    if (this.bgmPlaying) return;
    this.resume();
    this.bgmPlaying = true;

    // Classic 8-note synthwave arpeggio: C3, E3, G3, B3, C4, B3, G3, E3
    const notes = [
      130.81, // C3
      164.81, // E3
      196.00, // G3
      246.94, // B3
      261.63, // C4
      246.94, // B3
      196.00, // G3
      164.81  // E3
    ];

    const stepDuration = 60 / this.tempo / 2; // Eighth note tempo

    const tick = () => {
      if (!this.bgmPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const freq = notes[this.step % notes.length];

      // Arpeggio pluck
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800 + Math.sin(now * 0.5) * 350, now);
      filter.Q.value = 3;

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 0.95);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(now);
      osc.stop(now + stepDuration * 0.95);

      // Play soft bass drone on every 8 steps
      if (this.step % 8 === 0) {
        this.playBassDrone(now, stepDuration * 7.5);
      }

      this.step++;
      this.bgmTimer = setTimeout(tick, stepDuration * 1000);
    };

    tick();
  }

  playBassDrone(now, duration) {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(65.41, now); // C2

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  stopAmbientSynth() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  toggleBgm() {
    if (this.bgmPlaying) {
      this.stopAmbientSynth();
      return false;
    } else {
      this.startAmbientSynth();
      return true;
    }
  }
}

// Global audio engine instance
window.hawkinsAudio = new HawkinsAudioEngine();
