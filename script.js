/* ════════════════════════════════════════════════════════════
   MIRAIZEN – Coming Soon  |  script.js
   Vanilla JS — no dependencies
═════════════════════════════════════════════════════════════ */

/* ── 1. CONSTELLATION CANVAS ─────────────────────────────── */
(function initConstellation() {
  const canvas = document.getElementById("constellation");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const GOLD       = "rgba(212,175,55,";
  const WHITE      = "rgba(248,248,245,";
  const NODE_COUNT = 70;
  const MAX_DIST   = 160;

  let W, H, nodes = [], mouse = { x: -999, y: -999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Node() {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.vx    = (Math.random() - 0.5) * 0.28;
    this.vy    = (Math.random() - 0.5) * 0.28;
    this.r     = Math.random() * 1.8 + 0.6;
    this.gold  = Math.random() < 0.25;
    this.pulse = Math.random() * Math.PI * 2;
  }

  function spawnNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) nodes.push(new Node());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      n.pulse += 0.018;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // Connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha  = (1 - dist / MAX_DIST) * 0.22;
          const isGold = a.gold || b.gold;
          ctx.beginPath();
          ctx.strokeStyle = isGold ? GOLD + alpha + ")" : WHITE + (alpha * 0.6) + ")";
          ctx.lineWidth   = isGold ? 0.7 : 0.4;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Nodes
    nodes.forEach(n => {
      const glow = 0.55 + Math.sin(n.pulse) * 0.25;
      const col  = n.gold ? GOLD : WHITE;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = col + glow + ")";
      ctx.fill();
      if (n.gold) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 3, 0, Math.PI * 2);
        ctx.fillStyle = GOLD + (glow * 0.08) + ")";
        ctx.fill();
      }
    });

    // Mouse attraction
    nodes.forEach(n => {
      const dx = mouse.x - n.x, dy = mouse.y - n.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200 && dist > 1) {
        n.vx += (dx / dist) * 0.008;
        n.vy += (dy / dist) * 0.008;
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > 0.9) { n.vx = (n.vx / speed) * 0.9; n.vy = (n.vy / speed) * 0.9; }
      }
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize",     () => { resize(); spawnNodes(); });
  window.addEventListener("mousemove",  e  => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener("mouseleave", ()  => { mouse.x = -999; mouse.y = -999; });

  resize();
  spawnNodes();
  draw();
})();


/* ── 2. PARALLAX (mouse) ─────────────────────────────────── */
(function initParallax() {
  const hero = document.getElementById("heroInner");
  if (!hero) return;

  const layers = hero.querySelectorAll("[data-parallax]");
  let cx = window.innerWidth / 2, cy = window.innerHeight / 2;

  window.addEventListener("mousemove", e => { cx = e.clientX; cy = e.clientY; });

  let raf;
  (function loop() {
    const mx = (cx - window.innerWidth  / 2) * -1;
    const my = (cy - window.innerHeight / 2) * -1;
    layers.forEach(el => {
      const depth = parseFloat(el.dataset.parallax) || 0.02;
      el.style.transform = `translate(${mx * depth}px, ${my * depth}px)`;
    });
    raf = requestAnimationFrame(loop);
  })();

  window.addEventListener("touchstart", () => {
    cancelAnimationFrame(raf);
    layers.forEach(el => el.style.transform = "");
  }, { once: true });
})();


/* ── 3. SCROLL REVEAL ────────────────────────────────────── */
(function initReveal() {
  const targets = document.querySelectorAll(".social-section, .footer");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => {
    el.style.opacity    = "0";
    el.style.transform  = "translateY(36px)";
    el.style.transition = "opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)";
    observer.observe(el);
  });
})();


/* ── 4. SOCIAL CARDS — stagger on reveal ─────────────────── */
(function initSocialReveal() {
  const cards   = document.querySelectorAll(".social-card");
  const section = document.querySelector(".social-section");
  if (!section) return;

  // Pre-hide cards for stagger
  cards.forEach(c => {
    c.style.opacity   = "0";
    c.style.transform = "translateY(24px)";
    c.style.transition = "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1), box-shadow 0.38s cubic-bezier(0.25,0.8,0.25,1), border-color 0.38s cubic-bezier(0.25,0.8,0.25,1)";
  });

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      cards.forEach((c, i) => {
        setTimeout(() => {
          c.style.opacity   = "1";
          c.style.transform = "translateY(0)";
        }, i * 90);
      });
      observer.unobserve(section);
    }
  }, { threshold: 0.2 });

  observer.observe(section);
})();
