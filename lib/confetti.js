/**
 * Confetti — tiny canvas particle burst, no dependencies.
 *
 * The <canvas id="confetti"> element is rendered once by <ConfettiCanvas />
 * and painted from here. Used by the reservation success state and the
 * draggable chili.
 */
let canvas = null;
let ctx = null;
let parts = [];
let raf = null;
let dpr = 1;

const COLORS = ['#F28C28', '#F6EEDC', '#D7332B', '#2E7D5B', '#FF9D3D'];

function ensureCanvas() {
  if (canvas && canvas.isConnected) return true;
  canvas = document.getElementById('confetti');
  if (!canvas) return false;
  ctx = canvas.getContext('2d');
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  resize();
  window.addEventListener('resize', resize);
  return true;
}

function resize() {
  if (!canvas) return;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  parts = parts.filter((p) => p.life > 0 && p.y < window.innerHeight * 1.15);

  parts.forEach((p) => {
    p.vy += p.g;
    p.vx *= 0.995;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life -= 0.008;

    ctx.save();
    ctx.translate(p.x * dpr, p.y * dpr);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });

  if (parts.length) {
    raf = requestAnimationFrame(tick);
  } else {
    raf = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/** Fire a burst of confetti from a screen coordinate. */
export function burst(x, y, count = 110) {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!ensureCanvas()) return;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 9;
    parts.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      g: 0.28 + Math.random() * 0.12,
      w: (5 + Math.random() * 6) * dpr,
      h: (7 + Math.random() * 8) * dpr,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 1,
    });
  }

  if (!raf) raf = requestAnimationFrame(tick);
}
