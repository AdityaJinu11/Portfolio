/**
 * HAWKINS PARTICLE SYSTEM & DIMENSIONAL SHADER
 * - Right Side Up: Rising fiery red embers and mouse spark trail
 * - The Upside Down: Falling misty spores, ash flakes, and flashlight spotlight
 */

class DimensionalParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particles-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.sparks = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.splitX = window.innerWidth * 0.5; // Center split line
    this.activeDimension = 'split'; // 'split', 'rightside', 'upsidedown'
    this.mouse = { x: -100, y: -100, isOver: false, side: 'left' };
    this.vines = [];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.generateBackgroundParticles(120);
    this.generateVines();
    this.setupListeners();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    if (this.activeDimension === 'split') {
      this.splitX = this.width * 0.5;
    }
  }

  generateBackgroundParticles(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle(isSpawnAtBottom = false) {
    const isLeftSide = Math.random() < 0.5;
    const x = isLeftSide 
      ? Math.random() * (this.activeDimension === 'split' ? this.splitX : this.width)
      : (this.activeDimension === 'split' ? this.splitX + Math.random() * (this.width - this.splitX) : Math.random() * this.width);

    const isUpside = this.activeDimension === 'upsidedown' || (this.activeDimension === 'split' && x >= this.splitX);

    return {
      x: x,
      y: isSpawnAtBottom 
        ? (isUpside ? -10 : this.height + 10) 
        : Math.random() * this.height,
      radius: Math.random() * 2.5 + 0.8,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: isUpside ? (Math.random() * 0.9 + 0.3) : -(Math.random() * 1.1 + 0.4),
      alpha: Math.random() * 0.6 + 0.2,
      maxAlpha: Math.random() * 0.7 + 0.3,
      isUpside: isUpside,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      sway: Math.random() * 0.02 + 0.01,
      swayOffset: Math.random() * 100
    };
  }

  createSpark(x, y) {
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      this.sparks.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        radius: Math.random() * 2.2 + 1,
        life: 1.0,
        decay: Math.random() * 0.04 + 0.02,
        color: Math.random() > 0.3 ? '#ff3333' : '#ffaa00'
      });
    }
  }

  generateVines() {
    this.vines = [];
    const numTendrils = 8;
    for (let i = 0; i < numTendrils; i++) {
      const startX = this.width * 0.5 + Math.random() * (this.width * 0.45);
      const startY = Math.random() * this.height;
      const segments = [];
      let curX = startX;
      let curY = startY;
      for (let s = 0; s < 12; s++) {
        curX += (Math.random() - 0.3) * 35;
        curY += (Math.random() - 0.2) * 45;
        segments.push({ x: curX, y: curY });
      }
      this.vines.push({ startX, startY, segments });
    }
  }

  setupListeners() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.isOver = true;
      this.mouse.side = this.mouse.x < this.splitX ? 'left' : 'right';

      // If on left side (Right Side Up), emit spark trail!
      if (this.mouse.side === 'left' && (this.activeDimension === 'split' || this.activeDimension === 'rightside')) {
        this.createSpark(this.mouse.x, this.mouse.y);
      }
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.isOver = false;
    });

    // Listen for custom dimension switches
    window.addEventListener('dimensionChange', (e) => {
      this.setDimension(e.detail.dimension);
    });
  }

  setDimension(dim) {
    this.activeDimension = dim;
    this.particles.forEach((p) => {
      const isUpside = this.activeDimension === 'upsidedown' || (this.activeDimension === 'split' && p.x >= this.splitX);
      p.isUpside = isUpside;
      p.speedY = isUpside ? (Math.random() * 0.9 + 0.3) : -(Math.random() * 1.1 + 0.4);
    });
  }

  update() {
    // 1. Update background ambient particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.pulse += p.pulseSpeed;
      p.x += p.speedX + Math.sin(p.pulse + p.swayOffset) * 0.5;
      p.y += p.speedY;

      // Re-evaluate dimension if in split mode
      p.isUpside = this.activeDimension === 'upsidedown' || (this.activeDimension === 'split' && p.x >= this.splitX);

      // Boundary wraps
      if (p.isUpside) {
        if (p.y > this.height + 15) {
          p.y = -10;
          p.x = this.activeDimension === 'split' ? this.splitX + Math.random() * (this.width - this.splitX) : Math.random() * this.width;
        }
      } else {
        if (p.y < -15) {
          p.y = this.height + 10;
          p.x = this.activeDimension === 'split' ? Math.random() * this.splitX : Math.random() * this.width;
        }
      }

      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;
    }

    // 2. Update interactive mouse sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.12; // gravity
      s.life -= s.decay;
      if (s.life <= 0) {
        this.sparks.splice(i, 1);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw Right Side Up particles (fiery red/orange embers)
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const alpha = Math.abs(Math.sin(p.pulse)) * (p.maxAlpha - 0.15) + 0.15;

      this.ctx.save();
      if (!p.isUpside) {
        // Glowing red/orange ember
        this.ctx.shadowColor = '#ff2200';
        this.ctx.shadowBlur = p.radius * 4;
        this.ctx.fillStyle = `rgba(255, ${Math.floor(70 + alpha * 100)}, 20, ${alpha})`;
      } else {
        // Cold cyan/ash spore
        this.ctx.shadowColor = '#4cc9f0';
        this.ctx.shadowBlur = p.radius * 3;
        this.ctx.fillStyle = `rgba(160, 220, 245, ${alpha * 0.85})`;
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // Draw active mouse sparks
    for (let i = 0; i < this.sparks.length; i++) {
      const s = this.sparks[i];
      this.ctx.save();
      this.ctx.shadowColor = s.color;
      this.ctx.shadowBlur = 8;
      this.ctx.fillStyle = s.color;
      this.ctx.globalAlpha = Math.max(0, s.life);
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius * s.life, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // Draw Upside Down Flashlight Beam on Right Side
    if (this.mouse.isOver && (this.mouse.side === 'right' || this.activeDimension === 'upsidedown')) {
      this.drawFlashlightEffect();
    }
  }

  drawFlashlightEffect() {
    const mx = this.mouse.x;
    const my = this.mouse.y;
    const radius = 175;

    this.ctx.save();
    // Radial flashlight cone
    const grad = this.ctx.createRadialGradient(mx, my, 10, mx, my, radius);
    grad.addColorStop(0, 'rgba(180, 230, 255, 0.18)');
    grad.addColorStop(0.4, 'rgba(76, 201, 240, 0.09)');
    grad.addColorStop(0.85, 'rgba(40, 110, 170, 0.03)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(mx, my, radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Reveal hidden biological vines under flashlight beam
    this.ctx.lineWidth = 1.8;
    this.ctx.strokeStyle = 'rgba(100, 190, 215, 0.45)';
    this.ctx.shadowColor = '#4cc9f0';
    this.ctx.shadowBlur = 6;

    for (const vine of this.vines) {
      const dist = Math.hypot(vine.startX - mx, vine.startY - my);
      if (dist < radius + 60) {
        this.ctx.beginPath();
        this.ctx.moveTo(vine.startX, vine.startY);
        for (const seg of vine.segments) {
          this.ctx.lineTo(seg.x, seg.y);
        }
        this.ctx.stroke();
      }
    }

    this.ctx.restore();
  }

  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// Auto init when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.particleSystem = new DimensionalParticleSystem();
});
