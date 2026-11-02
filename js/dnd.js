/**
 * D&D CHARACTER CAMPAIGN TABLE & INTERACTIVE D20 DIE
 * Manages character attributes, 3D dice physics, trait unlocks,
 * and Polaroid photo carousel.
 */

class DnDCampaignManager {
  constructor() {
    this.die = document.getElementById('d20-die');
    this.rollBtn = document.getElementById('roll-d20-btn');
    this.resultBanner = document.getElementById('d20-result');
    this.traitText = document.getElementById('d20-trait-text');
    this.rollCountBadge = document.getElementById('roll-count');
    this.polaroidPhoto = document.getElementById('polaroid-img');
    this.polaroidCaption = document.getElementById('polaroid-caption');
    this.prevPhotoBtn = document.getElementById('photo-prev');
    this.nextPhotoBtn = document.getElementById('photo-next');

    this.isRolling = false;
    this.rollCount = 0;
    this.currentPhotoIdx = 0;

    this.photos = [
      {
        src: 'assets/images/aditya-profile.jpg',
        title: "Aditya Jinu (Field Profile '84)",
        caption: '1st Year B.Tech CSE (AI/ML) • Ready for the unknown'
      },
      {
        src: 'assets/images/aditya-snow.jpg',
        title: "Expedition: The Frost Ridge",
        caption: 'Extreme climate terrain research • High altitude stamina'
      },
      {
        src: 'assets/images/aditya-mountain.jpg',
        title: "Summit Reconnaissance",
        caption: 'Strategic perspective on high-scale systems'
      }
    ];

    this.traits = {
      20: {
        title: "NATURAL 20! CRITICAL HIT ⚔️",
        desc: "Trained a complex Deep Learning model with zero overfitting and 99.4% test accuracy on first convergence! The Demogorgon surrendered."
      },
      19: {
        title: "NEURAL ARCHITECT (Roll: 19) 🧠",
        desc: "Turns chaotic, multidimensional real-world datasets into clean, high-performance tensor pipelines before breakfast."
      },
      18: {
        title: "PERCEPTION CHECK PASSED (Roll: 18) 🔍",
        desc: "Spotted a sneaky off-by-one index bug and memory leak in 2,500 lines of Python code at 3:15 AM without breaking a sweat."
      },
      17: {
        title: "HAWKINS AV CLUB CHAMPION (Roll: 17) ⚡",
        desc: "Configured neural network architectures, hyperparameter searches, and real-time visualization dashboards in a single uninterrupted flow."
      },
      16: {
        title: "SHIELD OF ADAPTABILITY (Roll: 16) 🛡️",
        desc: "Thrives on rapid tech shifts. Hand Aditya a brand-new AI framework and he'll deploy a working model by Monday."
      },
      15: {
        title: "ALGORITHM PROPHECY (Roll: 15) 🔮",
        desc: "Reads gradient descent loss curves like ancient runes, instantly diagnosing learning rate plateaus and vanishing gradients."
      },
      14: {
        title: "BACKEND TITAN (Roll: 14) 🦾",
        desc: "Builds bulletproof asynchronous APIs and modular Python microservices that effortlessly handle high concurrency."
      },
      13: {
        title: "DEXTEROUS PIXEL WEAVER (Roll: 13) 🎨",
        desc: "Crafts responsive 60fps animations, glassmorphism layouts, and immersive UI interactions that blow reviewers away."
      },
      12: {
        title: "SCROLL OF CLEAN CODE (Roll: 12) 📜",
        desc: "Refactors legacy spaghetti functions into elegant, self-documenting, modular Object-Oriented code."
      },
      11: {
        title: "POTION OF ENDURANCE (Roll: 11) ☕",
        desc: "Survived a 48-hour NST hackathon sprint powered solely by coffee, adrenaline, and pure passion for intelligent tech."
      },
      10: {
        title: "OPTIMIZATION SENSE (Roll: 10) 🎯",
        desc: "Strikes the sweet spot between algorithmic complexity and compute efficiency. Big-O notation is second nature."
      },
      9: {
        title: "CURIOUS EXPLORER (Roll: 9) 🧭",
        desc: "Constantly devouring bleeding-edge arXiv research papers on transformers, LLM reasoning, and computer vision."
      },
      8: {
        title: "LOGIC PUZZLE MASTER (Roll: 8) 🧩",
        desc: "Solves intricate graph theory, dynamic programming, and data structure challenges for recreational fun."
      },
      7: {
        title: "TRANSMITTER TUNER (Roll: 7) 📡",
        desc: "Wires up WebSockets, REST APIs, and asynchronous pipelines with surgical precision and fault tolerance."
      },
      6: {
        title: "LAB ALCHEMIST (Roll: 6) 🧪",
        desc: "Synthesizes mathematical intuition, linear algebra, and Python into practical AI prototypes that solve real human problems."
      },
      5: {
        title: "SPRINT RUNNER (Roll: 5) 🏃‍♂️",
        desc: "Prototyped a complete MVP frontend and model inference backend in under 12 hours from scratch."
      },
      4: {
        title: "FELLOWSHIP ALLY (Roll: 4) 🤝",
        desc: "A magnetic team player who elevates everyone in the project through clear communication, empathy, and high spirits."
      },
      3: {
        title: "MIDNIGHT CODER (Roll: 3) 🕯️",
        desc: "Writes the most ingenious algorithmic breakthroughs when the world is asleep and the synthwave beat is thumping."
      },
      2: {
        title: "BUG EXTERMINATOR (Roll: 2) 🥊",
        desc: "Tracked an elusive null pointer exception across four separate modules and eliminated it with extreme prejudice."
      },
      1: {
        title: "NATURAL 1! WILD SURGE (Roll: 1) 🎲",
        desc: "Trained a 100-epoch model on CPU by mistake. Fan screamed, room got 5° warmer, but the model still hit 95% accuracy!"
      }
    };

    this.init();
  }

  init() {
    if (this.die) {
      this.die.addEventListener('click', () => this.rollDie());
    }
    if (this.rollBtn) {
      this.rollBtn.addEventListener('click', () => this.rollDie());
    }

    if (this.prevPhotoBtn && this.nextPhotoBtn) {
      this.prevPhotoBtn.addEventListener('click', () => this.cyclePhoto(-1));
      this.nextPhotoBtn.addEventListener('click', () => this.cyclePhoto(1));
    }

    // Interactive attribute bar tooltips
    const statBars = document.querySelectorAll('.stat-row');
    statBars.forEach((row) => {
      row.addEventListener('mouseenter', () => {
        row.classList.add('stat-active');
      });
      row.addEventListener('mouseleave', () => {
        row.classList.remove('stat-active');
      });
    });
  }

  cyclePhoto(direction) {
    this.currentPhotoIdx = (this.currentPhotoIdx + direction + this.photos.length) % this.photos.length;
    const current = this.photos[this.currentPhotoIdx];

    if (this.polaroidPhoto) {
      this.polaroidPhoto.style.opacity = '0';
      setTimeout(() => {
        this.polaroidPhoto.src = current.src;
        this.polaroidPhoto.alt = current.title;
        this.polaroidPhoto.style.opacity = '1';
      }, 150);
    }

    if (this.polaroidCaption) {
      this.polaroidCaption.innerHTML = `<strong>${current.title}</strong><br><span>${current.caption}</span>`;
    }

    if (window.hawkinsAudio) {
      window.hawkinsAudio.playCoinSound();
    }
  }

  rollDie() {
    if (this.isRolling) return;
    this.isRolling = true;
    this.rollCount++;

    if (this.rollCountBadge) {
      this.rollCountBadge.textContent = `Rolls: ${this.rollCount}`;
    }

    // Play dice roll clatter
    if (window.hawkinsAudio) {
      window.hawkinsAudio.playDiceRoll();
    }

    // Add tumbling 3D animation class
    this.die.classList.add('rolling-die');
    this.resultBanner.classList.add('fade-out');

    // Random roll outcome (biased slightly toward high scores for fun!)
    const roll = Math.floor(Math.random() * 20) + 1;

    setTimeout(() => {
      this.die.classList.remove('rolling-die');
      const dieFace = document.getElementById('d20-number');
      if (dieFace) {
        dieFace.textContent = roll;
      }

      // Display unlocked trait
      const traitData = this.traits[roll];
      if (this.resultBanner && this.traitText) {
        this.resultBanner.classList.remove('fade-out', 'nat-20', 'nat-1');
        if (roll === 20) this.resultBanner.classList.add('nat-20');
        if (roll === 1) this.resultBanner.classList.add('nat-1');

        this.resultBanner.querySelector('.trait-header').textContent = traitData.title;
        this.traitText.textContent = traitData.desc;
        this.resultBanner.classList.add('fade-in');
      }

      this.isRolling = false;
    }, 700);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.dndCampaign = new DnDCampaignManager();
});
