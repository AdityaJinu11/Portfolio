/* ============================================================
   main.js — vandanar.design-inspired interactive portfolio
   - Fluid ink canvas effect (interactive, mouse-stirred)
   - Scroll reveal
   - Mobile nav toggle
   - Codeforces live data
   ============================================================ */

// ── Fluid ink & wave canvas ────────────────────────────────
(function () {
  const canvas = document.getElementById('fluid-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, dpr;
  let mouse = { x: -9999, y: -9999, px: -9999, py: -9999 };
  let time = 0;

  const MAX_PARTICLES = 180;
  const particles = [];
  const waves = [];
  const ambientBlobs = [];
  const motes = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);

  // Persistent ambient fluid blobs so background is always clearly visible
  const blobPalettes = [
    '240, 237, 230',
    '205, 192, 170',
    '165, 158, 148',
    '225, 215, 198',
  ];

  for (let i = 0; i < 7; i++) {
    ambientBlobs.push({
      x: Math.random() * (W || 1200),
      y: Math.random() * (H || 800),
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 220 + 180,
      alpha: Math.random() * 0.08 + 0.09,
      hue: blobPalettes[i % blobPalettes.length],
      phase: Math.random() * Math.PI * 2,
    });
  }

  // Persistent floating motes that react to waves and cursor
  for (let i = 0; i < 42; i++) {
    motes.push({
      x: Math.random() * (W || 1200),
      y: Math.random() * (H || 800),
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 2.2 + 1.1,
      alpha: Math.random() * 0.35 + 0.2,
      hue: blobPalettes[i % blobPalettes.length],
    });
  }

  function spawnParticle(x, y, vx, vy, size, alpha, decay) {
    if (particles.length >= MAX_PARTICLES) {
      particles.shift();
    }
    particles.push({
      x, y, vx, vy,
      size: size || (Math.random() * 75 + 45),
      alpha: alpha || (Math.random() * 0.18 + 0.14),
      life: 1,
      decay: decay || (Math.random() * 0.008 + 0.005),
      hue: Math.random() > 0.45 ? '240, 237, 230' : '212, 196, 170',
    });
  }

  function triggerWave(x, y) {
    // Multi-ring expanding wave effect
    for (let i = 0; i < 3; i++) {
      waves.push({
        x,
        y,
        radius: 6 + i * 10,
        maxRadius: Math.max(W, H) * (0.28 + i * 0.1),
        speed: 5.5 - i * 0.7,
        alpha: 0.55 - i * 0.12,
        lineWidth: 2.2 - i * 0.5,
        hue: i === 0 ? '240, 237, 230' : '212, 196, 170',
      });
    }

    // Releasing ink burst particles
    const burstCount = 18;
    for (let i = 0; i < burstCount; i++) {
      const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.3;
      const speed = Math.random() * 4.5 + 2.0;
      spawnParticle(
        x + Math.cos(angle) * 8,
        y + Math.sin(angle) * 8,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        Math.random() * 65 + 35,
        Math.random() * 0.22 + 0.16,
        Math.random() * 0.012 + 0.008
      );
    }

    // Push nearby motes outward from the click/touch wave
    motes.forEach(m => {
      const dx = m.x - x;
      const dy = m.y - y;
      const dist = Math.hypot(dx, dy);
      if (dist < 260 && dist > 1) {
        const force = (1 - dist / 260) * 5.5;
        m.vx += (dx / dist) * force;
        m.vy += (dy / dist) * force;
      }
    });
  }

  function handleMove(x, y) {
    mouse.px = mouse.x;
    mouse.py = mouse.y;
    mouse.x = x;
    mouse.y = y;

    if (mouse.px < -1000) return;

    const dx = mouse.x - mouse.px;
    const dy = mouse.y - mouse.py;
    const speed = Math.hypot(dx, dy);
    if (speed > 2) {
      const count = Math.min(4, Math.max(1, Math.floor(speed / 5)));
      for (let i = 0; i < count; i++) {
        spawnParticle(
          mouse.x + (Math.random() - 0.5) * 18,
          mouse.y + (Math.random() - 0.5) * 18,
          dx * 0.12 + (Math.random() - 0.5) * 0.8,
          dy * 0.12 + (Math.random() - 0.5) * 0.8
        );
      }
    }
  }

  // Mouse events
  document.addEventListener('mousemove', e => handleMove(e.clientX, e.clientY));
  document.addEventListener('mousedown', e => triggerWave(e.clientX, e.clientY));

  // Touch events
  document.addEventListener('touchstart', e => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      mouse.x = t.clientX;
      mouse.y = t.clientY;
      mouse.px = t.clientX;
      mouse.py = t.clientY;
      triggerWave(t.clientX, t.clientY);
    }
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (e.touches.length > 0) {
      const t = e.touches[0];
      handleMove(t.clientX, t.clientY);
    }
  }, { passive: true });

  // Scroll-triggered atmospheric particles
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (Math.abs(sy - lastScrollY) > 50) {
      for (let i = 0; i < 4; i++) {
        spawnParticle(
          Math.random() * W,
          Math.random() * H,
          (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 0.6
        );
      }
    }
    lastScrollY = sy;
  }, { passive: true });

  function draw() {
    time += 0.012;
    ctx.clearRect(0, 0, W, H);

    // 1. Draw ambient drifting fluid blobs
    for (let i = 0; i < ambientBlobs.length; i++) {
      const b = ambientBlobs[i];
      b.x += b.vx + Math.sin(time + b.phase) * 0.25;
      b.y += b.vy + Math.cos(time * 0.8 + b.phase) * 0.25;

      // Gentle cursor attraction/repulsion
      if (mouse.x > 0) {
        const dx = mouse.x - b.x;
        const dy = mouse.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 320 && dist > 1) {
          b.x += (dx / dist) * 0.35;
          b.y += (dy / dist) * 0.35;
        }
      }

      if (b.x < -b.radius) b.x = W + b.radius;
      if (b.x > W + b.radius) b.x = -b.radius;
      if (b.y < -b.radius) b.y = H + b.radius;
      if (b.y > H + b.radius) b.y = -b.radius;

      const pulseR = b.radius * (1 + Math.sin(time * 1.2 + b.phase) * 0.08);
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, pulseR);
      grad.addColorStop(0, `rgba(${b.hue}, ${b.alpha})`);
      grad.addColorStop(0.55, `rgba(${b.hue}, ${(b.alpha * 0.45).toFixed(3)})`);
      grad.addColorStop(1, `rgba(${b.hue}, 0)`);

      ctx.beginPath();
      ctx.arc(b.x, b.y, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // 2. Draw floating motes
    for (let i = 0; i < motes.length; i++) {
      const m = motes[i];
      m.vx *= 0.985;
      m.vy *= 0.985;
      m.x += m.vx + Math.sin(time + i) * 0.15;
      m.y += m.vy + Math.cos(time + i) * 0.15;

      if (m.x < 0) m.x = W;
      if (m.x > W) m.x = 0;
      if (m.y < 0) m.y = H;
      if (m.y > H) m.y = 0;

      ctx.beginPath();
      ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${m.hue}, ${m.alpha})`;
      ctx.fill();
    }

    // 3. Draw interactive ink trail & burst particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vx += (Math.random() - 0.5) * 0.05;
      p.vy += (Math.random() - 0.5) * 0.05;
      p.vx *= 0.975;
      p.vy *= 0.975;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      const a = p.alpha * Math.sin(p.life * Math.PI);
      const r = p.size * (1.15 - p.life * 0.35);

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      grad.addColorStop(0, `rgba(${p.hue}, ${a.toFixed(3)})`);
      grad.addColorStop(0.5, `rgba(${p.hue}, ${(a * 0.45).toFixed(3)})`);
      grad.addColorStop(1, `rgba(${p.hue}, 0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // 4. Draw expanding click/touch wave rings
    for (let i = waves.length - 1; i >= 0; i--) {
      const w = waves[i];
      w.radius += w.speed;
      w.speed *= 0.988;
      const progress = w.radius / w.maxRadius;
      const currentAlpha = w.alpha * (1 - progress);

      if (progress >= 1 || currentAlpha <= 0.005) {
        waves.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${w.hue}, ${currentAlpha.toFixed(3)})`;
      ctx.lineWidth = Math.max(0.5, w.lineWidth * (1 - progress * 0.7));
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    draw();
  }
})();

// ── Scroll reveal ──────────────────────────────────────────
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = document.querySelectorAll('.section, footer');

  if (reduced || !('IntersectionObserver' in window)) {
    sections.forEach(el => el.classList.add('is-visible'));
    return;
  }

  sections.forEach(el => el.classList.add('reveal-pending'));

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        entry.target.classList.remove('reveal-pending');
      } else {
        entry.target.classList.remove('is-visible');
        entry.target.classList.add('reveal-pending');
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -6% 0px' });

  sections.forEach(el => obs.observe(el));
})();

// ── Mobile nav ─────────────────────────────────────────────
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  links.addEventListener('click', e => {
    if (e.target.closest('a')) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

// ── Codeforces live data ───────────────────────────────────
(function () {
  const solvedEl = document.getElementById('cf-solved');
  const statusEl = document.getElementById('cf-status');
  if (!solvedEl || !statusEl) return;

  fetch('https://codeforces.com/api/user.status?handle=Nitoma11')
    .then(r => {
      if (!r.ok) throw new Error('API error');
      return r.json();
    })
    .then(data => {
      if (data.status !== 'OK' || !Array.isArray(data.result)) throw new Error('Bad data');
      const solved = new Set(
        data.result
          .filter(s => s.verdict === 'OK')
          .map(s => `${s.problem.contestId}-${s.problem.index}`)
      );
      solvedEl.textContent = solved.size.toLocaleString();
      statusEl.textContent = 'Unique problems with an accepted solution';
    })
    .catch(() => {
      solvedEl.textContent = '—';
      statusEl.textContent = 'Could not load live data. Open Codeforces profile ↗';
    });
})();

// ── Smooth nav active state ────────────────────────────────
(function () {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('main section[id], section[id]');

  if (!('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
})();
