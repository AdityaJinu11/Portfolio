/**
 * JOYCE'S CHRISTMAS LIGHTS ALPHABET CIPHER & WALKIE-TALKIE TRANSMITTER
 * Lights up string fairy bulbs in real-time as user types,
 * decodes secret easter egg words, and plays Demogorgon growl on dispatch.
 */

class ChristmasLightsCipher {
  constructor() {
    this.wall = document.getElementById('alphabet-wall');
    this.nameInput = document.getElementById('cipher-name');
    this.emailInput = document.getElementById('cipher-email');
    this.messageInput = document.getElementById('cipher-message');
    this.form = document.getElementById('cipher-form');
    this.statusBanner = document.getElementById('transmission-status');
    this.easterEggBtns = document.querySelectorAll('.cipher-code-tag');

    this.bulbElements = {};
    this.isTransmitting = false;

    this.bulbColors = [
      '#ff3b30', // Ruby Red
      '#ff9500', // Amber
      '#34c759', // Emerald Green
      '#00c7be', // Aqua Cyan
      '#5856d6', // Indigo
      '#af52de', // Purple
      '#ff2d55'  // Neon Pink
    ];

    this.alphabetRows = [
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'],
      ['R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    ];

    this.init();
  }

  init() {
    this.buildAlphabetWall();
    this.setupTypingListeners();
    this.setupEasterEggs();
    this.setupFormSubmit();
  }

  buildAlphabetWall() {
    if (!this.wall) return;
    this.wall.innerHTML = '';

    let colorIdx = 0;
    this.alphabetRows.forEach((row, rIdx) => {
      const rowDiv = document.createElement('div');
      rowDiv.className = `cipher-row row-${rIdx + 1}`;

      row.forEach((letter) => {
        const item = document.createElement('div');
        item.className = 'cipher-letter-item';
        item.id = `cipher-letter-${letter}`;

        const bulbColor = this.bulbColors[colorIdx % this.bulbColors.length];
        colorIdx++;

        item.innerHTML = `
          <div class="light-wire"></div>
          <div class="light-bulb" style="--bulb-color: ${bulbColor};" data-letter="${letter}">
            <div class="bulb-glass"></div>
            <div class="bulb-filament"></div>
          </div>
          <span class="painted-letter">${letter}</span>
        `;

        rowDiv.appendChild(item);
        this.bulbElements[letter] = item.querySelector('.light-bulb');

        // Allow clicking individual bulbs
        item.addEventListener('click', () => {
          this.flashBulb(letter, true);
        });
      });

      this.wall.appendChild(rowDiv);
    });
  }

  setupTypingListeners() {
    const inputs = [this.nameInput, this.emailInput, this.messageInput];

    inputs.forEach((input) => {
      if (!input) return;

      input.addEventListener('input', (e) => {
        const val = input.value;
        if (!val) return;
        const lastChar = val[val.length - 1].toUpperCase();

        if (this.bulbElements[lastChar]) {
          this.flashBulb(lastChar, true);
        }
      });
    });
  }

  flashBulb(letter, playSound = true) {
    const bulb = this.bulbElements[letter];
    if (!bulb) return;

    bulb.classList.add('lit');
    if (playSound && window.hawkinsAudio) {
      window.hawkinsAudio.playBulbBuzz(letter);
    }

    setTimeout(() => {
      bulb.classList.remove('lit');
    }, 420);
  }

  playSequence(word, callback) {
    const letters = word.toUpperCase().replace(/[^A-Z]/g, '').split('');
    let idx = 0;

    const step = () => {
      if (idx >= letters.length) {
        if (callback) callback();
        return;
      }
      const char = letters[idx];
      this.flashBulb(char, true);
      idx++;
      setTimeout(step, 480);
    };

    step();
  }

  setupEasterEggs() {
    this.easterEggBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const word = btn.getAttribute('data-word');
        if (!word || this.isTransmitting) return;

        this.isTransmitting = true;
        btn.classList.add('active');

        this.playSequence(word, () => {
          this.isTransmitting = false;
          btn.classList.remove('active');
        });
      });
    });
  }

  setupFormSubmit() {
    if (!this.form) return;

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleTransmission();
    });
  }

  handleTransmission() {
    if (this.isTransmitting) return;
    this.isTransmitting = true;

    const sender = this.nameInput ? this.nameInput.value.trim() : 'Adventurer';
    const email = this.emailInput ? this.emailInput.value.trim() : '';
    const message = this.messageInput ? this.messageInput.value.trim() : '';

    // 1. Chaotic strobe of all Christmas lights
    let flashCount = 0;
    const allLetters = Object.keys(this.bulbElements);
    const strobeInterval = setInterval(() => {
      const randomLetter = allLetters[Math.floor(Math.random() * allLetters.length)];
      this.flashBulb(randomLetter, false);
      flashCount++;
      if (flashCount > 28) {
        clearInterval(strobeInterval);
      }
    }, 45);

    // 2. Play deep Demogorgon rumble & growl!
    if (window.hawkinsAudio) {
      window.hawkinsAudio.playDemogorgonGrowl();
    }

    // 3. Show Void Transmission Banner
    if (this.statusBanner) {
      this.statusBanner.classList.add('active');
      this.statusBanner.innerHTML = `
        <div class="void-alert">
          <div class="demogorgon-icon">⚡👾⚡</div>
          <h3>TRANSMISSION RECEIVED IN THE VOID!</h3>
          <p>Hawkins Frequency Locked. Carrier pigeon dispatched to <strong>aditya.jinu11@gmail.com</strong>.</p>
          <div class="transmission-details">
            <span><strong>FROM:</strong> ${sender} (${email || 'Anonymous'})</span><br>
            <span><strong>MESSAGE:</strong> "${message || 'Incoming connection request'}"</span>
          </div>
          <div class="direct-contact-actions">
            <a href="mailto:aditya.jinu11@gmail.com?subject=Portfolio%20Connection%20from%20${encodeURIComponent(sender)}&body=${encodeURIComponent(message)}" class="action-btn-primary">
              🚀 OPEN DIRECT EMAIL CLIENT
            </a>
            <button type="button" class="action-btn-secondary" onclick="navigator.clipboard.writeText('+917869061976'); alert('Copied Aditya\\'s Phone (+91 7869061976) to clipboard!');">
              📞 COPY PHONE (+91 7869061976)
            </button>
          </div>
        </div>
      `;
    }

    setTimeout(() => {
      this.isTransmitting = false;
    }, 2000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cipherSystem = new ChristmasLightsCipher();
});
