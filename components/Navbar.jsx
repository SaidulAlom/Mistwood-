'use client';

/* ============================================================
   Navbar — floating glass pill that shrinks on scroll,
   active-section highlighting, full-screen mobile overlay.
   ============================================================ */

import { useCallback, useEffect, useState } from 'react';
import { scrollToId, startScroll, stopScroll } from '@/lib/lenis';

const LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'story', label: 'About' },
  { id: 'menu', label: 'Menu' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'location', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('hero');

  /* shrink the pill once the hero starts leaving */
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        frame = 0;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* highlight whichever section is under the middle of the viewport */
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  /* lock the page behind the mobile overlay */
  useEffect(() => {
    if (open) {
      stopScroll();
      const onKey = (e) => e.key === 'Escape' && setOpen(false);
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
    startScroll();
  }, [open]);

  const go = useCallback((e, id) => {
    e.preventDefault();
    setOpen(false);
    scrollToId('#' + id);
  }, []);

  return (
    <>
      <header className={'nav' + (scrolled ? ' scrolled' : '')} id="nav">
        <div className="nav-inner glass">
          <a
            className="nav-brand"
            href="#hero"
            aria-label="Mistwood Restaurant — home"
            onClick={(e) => go(e, 'hero')}
          >
            {/* Brand mark */}
            <svg className="brand-mark" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 34c0-10 10-12 14-5 3 5-3 7-6 9l14 16c8 4 6-13-12-17-10-2-11-7-1-10z" fill="#F28C28" />
              <circle cx="36" cy="29" r="3" fill="#F6EEDC" />
              <path d="M16 34c0 8-8 9-9 0-1-4 2-6 4-8z" fill="#D7332B" />
            </svg>
            <span className="brand-text">
              Mistwood<i>★</i>
            </span>
          </a>

          <nav className="nav-links" aria-label="Primary">
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={'#' + link.id}
                className={'nav-link' + (active === link.id ? ' active' : '')}
                onClick={(e) => go(e, link.id)}
              >
                <span>{link.label}</span>
              </a>
            ))}
          </nav>

          <a
            className="btn btn-primary btn-sm magnetic nav-reserve"
            href="#reserve"
            data-cursor="eat"
            onClick={(e) => go(e, 'reserve')}
          >
            <span>Reserve</span>
          </a>

          <button
            className={'nav-burger' + (open ? ' open' : '')}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Mobile full-screen overlay menu */}
      <div
        className={'mobile-menu' + (open ? ' open' : '')}
        id="mobileMenu"
        aria-hidden={!open}
      >
        <div className="mobile-menu-inner">
          <button className="mobile-close" aria-label="Close menu" onClick={() => setOpen(false)}>
            ✕
          </button>
          <nav className="mobile-links" aria-label="Mobile">
            {LINKS.map((link, i) => (
              <a key={link.id} href={'#' + link.id} onClick={(e) => go(e, link.id)}>
                <i>{String(i + 1).padStart(2, '0')}</i>
                {link.label}
              </a>
            ))}
            <a className="mobile-reserve" href="#reserve" onClick={(e) => go(e, 'reserve')}>
              Reserve a Table →
            </a>
          </nav>
          <p className="mobile-foot">
            Open daily · 10 AM – 9 PM · Upper Pine Ridge, Shillong
          </p>
        </div>
      </div>

      {/* Sticky floating Call/Reserve on mobile */}
      <a
        className="float-cta magnetic"
        href="#reserve"
        data-cursor="eat"
        onClick={(e) => go(e, 'reserve')}
      >
        <span>Call / Reserve</span>
      </a>
    </>
  );
}
