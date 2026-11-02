/**
 * HAWKINS PORTFOLIO CONTROLLER
 * Coordinates Split-Screen Illusion, Dimension Swapping,
 * Cassette Player Audio HUD, and Smooth Scroll Physics.
 */

class HawkinsPortfolioApp {
  constructor() {
    this.heroContainer = document.getElementById('split-hero-container');
    this.leftSide = document.getElementById('side-right-side-up');
    this.rightSide = document.getElementById('side-upside-down');
    this.splitDivider = document.getElementById('split-divider');
    this.cassetteBtn = document.getElementById('cassette-toggle-btn');
    this.cassetteWidget = document.getElementById('cassette-widget');
    this.dimensionButtons = document.querySelectorAll('.dim-tab-btn');

    this.isDraggingSplit = false;
    this.currentDimension = 'split';

    this.init();
  }

  init() {
    this.setupSplitSlider();
    this.setupSplitScrollParallax();
    this.setupDimensionControls();
    this.setupCassettePlayer();
    this.setupNavLinks();
    this.setupShortcuts();
  }

  // 1. Split Screen Divider Interaction
  setupSplitSlider() {
    if (!this.heroContainer || !this.splitDivider) return;

    const handleMove = (clientX) => {
      const rect = this.heroContainer.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      let percent = (relativeX / rect.width) * 100;
      percent = Math.max(15, Math.min(85, percent)); // Clamp range

      document.documentElement.style.setProperty('--split-percent', `${percent}%`);

      if (window.particleSystem) {
        window.particleSystem.splitX = (percent / 100) * window.innerWidth;
      }
    };

    // Mouse drag on divider
    this.splitDivider.addEventListener('mousedown', (e) => {
      this.isDraggingSplit = true;
      document.body.classList.add('resizing-split');
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDraggingSplit) {
        handleMove(e.clientX);
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isDraggingSplit) {
        this.isDraggingSplit = false;
        document.body.classList.remove('resizing-split');
      }
    });

    // Touch support for mobile devices
    this.splitDivider.addEventListener('touchstart', (e) => {
      this.isDraggingSplit = true;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isDraggingSplit && e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDraggingSplit = false;
    });
  }

  // 2. The Split Scroll Effect (Left side scrolls down, Right side inversely parallaxed)
  setupSplitScrollParallax() {
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = this.heroContainer ? this.heroContainer.offsetHeight : 800;

      if (scrollY <= heroHeight * 1.5) {
        const leftContent = document.querySelector('#side-right-side-up .hero-dimension-content');
        const rightContent = document.querySelector('#side-upside-down .hero-dimension-content');

        if (leftContent) {
          // Standard downward scroll feel
          leftContent.style.transform = `translateY(${scrollY * 0.12}px)`;
        }
        if (rightContent) {
          // Inverted opposing upward parallax effect!
          rightContent.style.transform = `translateY(-${scrollY * 0.18}px)`;
        }
      }

      lastScrollY = scrollY;
    }, { passive: true });
  }

  // 3. Dimension Toggle Tabs (Right Side Up vs. Upside Down vs. Split)
  setupDimensionControls() {
    this.dimensionButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetDim = btn.getAttribute('data-dimension');
        this.setDimensionMode(targetDim);
      });
    });
  }

  setDimensionMode(dim) {
    this.currentDimension = dim;

    this.dimensionButtons.forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-dimension') === dim);
    });

    if (this.heroContainer) {
      this.heroContainer.classList.remove('mode-split', 'mode-rightside', 'mode-upsidedown');
      this.heroContainer.classList.add(`mode-${dim}`);
    }

    if (dim === 'rightside') {
      document.documentElement.style.setProperty('--split-percent', '98%');
    } else if (dim === 'upsidedown') {
      document.documentElement.style.setProperty('--split-percent', '2%');
    } else {
      document.documentElement.style.setProperty('--split-percent', '50%');
    }

    // Trigger audio zap & update particle system
    if (window.hawkinsAudio) {
      window.hawkinsAudio.playCoinSound();
    }

    window.dispatchEvent(new CustomEvent('dimensionChange', { detail: { dimension: dim } }));
  }

  // 4. Retro Cassette Player Audio HUD
  setupCassettePlayer() {
    if (!this.cassetteBtn || !this.cassetteWidget) return;

    this.cassetteBtn.addEventListener('click', () => {
      if (!window.hawkinsAudio) return;

      const isNowPlaying = window.hawkinsAudio.toggleBgm();
      this.cassetteWidget.classList.toggle('playing', isNowPlaying);

      const statusText = document.getElementById('cassette-status');
      if (statusText) {
        statusText.textContent = isNowPlaying ? 'PLAYING • LO-FI SYNTH' : 'PAUSED • CASSETTE DECK';
      }
    });

    const muteBtn = document.getElementById('mute-all-btn');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        if (!window.hawkinsAudio) return;
        const isMuted = window.hawkinsAudio.toggleMute();
        muteBtn.textContent = isMuted ? '🔇 UNMUTE' : '🔊 MUTE';
      });
    }
  }

  // 5. Smooth Nav Anchor Links
  setupNavLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#' || targetId === '#top') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // 6. Keyboard Shortcuts
  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Avoid if user is currently typing inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === 'm' || e.key === 'M') {
        const muteBtn = document.getElementById('mute-all-btn');
        if (muteBtn) muteBtn.click();
      } else if (e.key === 'd' || e.key === 'D') {
        if (window.dndCampaign) window.dndCampaign.rollDie();
      } else if (e.key === '1') {
        this.setDimensionMode('rightside');
      } else if (e.key === '2') {
        this.setDimensionMode('split');
      } else if (e.key === '3') {
        this.setDimensionMode('upsidedown');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.hawkinsApp = new HawkinsPortfolioApp();
});
