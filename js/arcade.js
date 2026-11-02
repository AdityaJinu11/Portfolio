/**
 * HAWKINS PALACE ARCADE - INSERT COIN INTRO EXPERIENCE
 * Handles arcade cabinet UI, coin slot click, sound synthesis trigger,
 * violent CRT glitch transition, and unlocking the main portfolio.
 */

class ArcadeIntro {
  constructor() {
    this.screen = document.getElementById('arcade-screen');
    this.coinBtn = document.getElementById('insert-coin-btn');
    this.mainPortfolio = document.getElementById('main-portfolio');
    this.isEntered = false;

    this.init();
  }

  init() {
    if (!this.screen || !this.coinBtn) return;

    // Click handler for INSERT COIN button
    this.coinBtn.addEventListener('click', () => this.triggerStart());

    // Allow pressing Space or Enter key
    window.addEventListener('keydown', (e) => {
      if (!this.isEntered && (e.code === 'Enter' || e.code === 'Space')) {
        e.preventDefault();
        this.triggerStart();
      }
    });

    // Replay arcade button in header if present
    const replayBtn = document.getElementById('replay-arcade-btn');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => this.showArcadeAgain());
    }
  }

  triggerStart() {
    if (this.isEntered) return;
    this.isEntered = true;

    // 1. Play coin chime & violent zap
    if (window.hawkinsAudio) {
      window.hawkinsAudio.resume();
      window.hawkinsAudio.playCoinSound();
      setTimeout(() => {
        window.hawkinsAudio.playArcadeZap();
      }, 140);
    }

    // 2. Add violent glitch classes
    this.screen.classList.add('arcade-violent-glitch');
    document.body.classList.add('glitch-shake');

    // Update button text
    if (this.coinBtn) {
      this.coinBtn.innerHTML = '<span class="blink-fast">AUTHENTICATING ADITYA JINU...</span>';
    }

    // 3. Complete glitch & reveal main world
    setTimeout(() => {
      this.screen.classList.add('arcade-exit');
      document.body.classList.remove('glitch-shake');

      if (this.mainPortfolio) {
        this.mainPortfolio.classList.remove('portfolio-hidden');
        this.mainPortfolio.classList.add('portfolio-revealed');
      }

      // Start eerie ambient synth track
      if (window.hawkinsAudio) {
        setTimeout(() => {
          window.hawkinsAudio.startAmbientSynth();
          const cassette = document.getElementById('cassette-widget');
          if (cassette) cassette.classList.add('playing');
        }, 300);
      }

      // Hide arcade from flow after animation finishes
      setTimeout(() => {
        this.screen.style.display = 'none';
      }, 900);
    }, 750);
  }

  showArcadeAgain() {
    this.isEntered = false;
    this.screen.style.display = 'flex';
    this.screen.classList.remove('arcade-exit', 'arcade-violent-glitch');
    this.coinBtn.innerHTML = '<span class="coin-icon">🪙</span> INSERT COIN TO CONTINUE';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.arcadeIntro = new ArcadeIntro();
});
