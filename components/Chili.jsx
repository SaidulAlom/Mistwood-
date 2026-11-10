'use client';

/* ============================================================
   Chili "PULL ME" — the playground.
   Drag it (mouse / touch / pen); pull far enough and it sizzles
   and throws confetti before snapping back on an elastic curve.
   ============================================================ */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { burst } from '@/lib/confetti';
import { playSizzle } from '@/lib/sizzle';

const MAX_PULL = 95; /* px the chili can travel from its resting spot */

export default function Chili() {
  const chiliRef = useRef(null);
  const state = useRef({ dragging: false, sx: 0, sy: 0, moved: 0 });

  useEffect(() => {
    const el = chiliRef.current;
    if (!el) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = state.current;

    const place = (x, y, rotation) => {
      if (reduce) {
        el.style.transform = `translate(${x}px,${y}px) rotate(${rotation}deg)`;
      } else {
        gsap.set(el, { x, y, rotation });
      }
    };

    const onDown = (e) => {
      s.dragging = true;
      s.moved = 0;
      s.sx = e.clientX;
      s.sy = e.clientY;
      el.setPointerCapture?.(e.pointerId);
      gsap.killTweensOf(el);
    };

    const onMove = (e) => {
      if (!s.dragging) return;

      const dx = e.clientX - s.sx;
      const dy = e.clientY - s.sy;
      s.moved = Math.max(s.moved, Math.hypot(dx, dy));

      const x = Math.max(-MAX_PULL, Math.min(MAX_PULL, dx));
      const y = Math.max(-MAX_PULL, Math.min(MAX_PULL, dy));
      const rotation = Math.max(-40, Math.min(40, Math.atan2(dy, dx) * (30 / Math.PI)));

      place(x, y, rotation);
    };

    const onUp = (e) => {
      if (!s.dragging) return;
      s.dragging = false;

      if (s.moved > 45) {
        playSizzle();
        burst(e.clientX, e.clientY, 130);
      }

      if (reduce) {
        el.style.transform = '';
      } else {
        gsap.to(el, { x: 0, y: 0, rotation: 0, duration: 0.7, ease: 'elastic.out(1, .45)' });
      }
    };

    const onKey = (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      playSizzle();
      const r = el.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2, 130);
      if (!reduce) {
        gsap.fromTo(
          el,
          { rotation: -14 },
          { rotation: 0, duration: 0.9, ease: 'elastic.out(1, .35)' }
        );
      }
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('keydown', onKey);

    return () => {
      gsap.killTweensOf(el);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div
      className="chili-drag"
      id="chili"
      ref={chiliRef}
      role="button"
      tabIndex={0}
      aria-label="Drag the chili for a surprise"
    >
      <span className="chili-pulse" aria-hidden="true"></span>
      <svg viewBox="0 0 48 64" width="44" height="58" aria-hidden="true">
        <path
          d="M30 6c-8 0-12 6-12 14 0 6.5 5 10 10 7.5C33.5 24 30.5 16 30 6Z"
          fill="#D7332B"
          stroke="#F6EEDC"
          strokeWidth="2"
        />
        <path
          d="M29 8c3-5 8-6 10-3-1 2-3 3-5 3"
          fill="none"
          stroke="#2E7D3B"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M19 19c3 4 9 4 12 0" stroke="#F6EEDC" strokeWidth="1.6" fill="none" opacity=".8" />
      </svg>
      <span className="chili-hint handwritten">PULL ME</span>
    </div>
  );
}
