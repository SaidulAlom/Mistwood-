'use client';

/* ============================================================
   ScrollFX — the motion layer.
   Lenis smooth scroll wired into GSAP's ticker, custom cursor,
   magnetic buttons, drifting orbs, the preloader timeline, hero
   intro, scroll reveals, parallax, the pinned story, the pinned
   horizontal dish roll, the "TO …" panels, footer wordmark fill
   and the scroll-progress bar.

   Everything imperative lives here so the rest of the app can stay
   declarative. All of it is created inside a gsap.context() and
   torn down on unmount, which keeps React StrictMode happy.
   ============================================================ */

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { splitText } from '@/lib/splitText';
import { setLenis } from '@/lib/lenis';

/* the preloader should only ever play once per page load, even if the
   effect is re-run (StrictMode dev double-mount, HMR) */
let preloaderPlayed = false;

export default function ScrollFX() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    /* Save-Data or a 2G/3G connection: skip the intro and show the page at once */
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const leanNetwork =
      !!conn && (conn.saveData === true || /(^|-)(2g|3g)$/.test(conn.effectiveType || ''));

    const cleanups = [];
    const on = (target, type, fn, opts) => {
      target.addEventListener(type, fn, opts);
      cleanups.push(() => target.removeEventListener(type, fn, opts));
    };
    const after = (ms, fn) => {
      const id = setTimeout(fn, ms);
      cleanups.push(() => clearTimeout(id));
      return id;
    };

    let lenis = null;
    let tickerFn = null;

    /** make the real page visible (curtains may still be on top of it) */
    const markLoaded = () => document.body.classList.add('loaded');

    /** full teardown of the intro layer — used by the failsafe paths */
    const revealPage = () => {
      markLoaded();
      const pre = document.getElementById('preloader');
      if (pre) pre.classList.add('done');
      document.querySelectorAll('.curtain').forEach((c) => {
        c.style.display = 'none';
      });
    };

    const hideCurtains = () => {
      document.querySelectorAll('.curtain').forEach((c) => {
        c.style.display = 'none';
      });
    };

    /* --------------------------------------------------------
       1. LENIS — smooth scroll, synced to GSAP's ticker
       -------------------------------------------------------- */
    if (!reduceMotion) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
      setLenis(lenis);
      lenis.on('scroll', ScrollTrigger.update);

      tickerFn = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
    }

    /* any in-page anchor gets smooth-scrolled through Lenis */
    const onAnchorClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -10, duration: 1.1 });
      else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    on(document, 'click', onAnchorClick);

    /* --------------------------------------------------------
       2. CUSTOM CURSOR — dot + ring, grows to show VIEW / EAT
       -------------------------------------------------------- */
    if (finePointer && !reduceMotion) {
      document.documentElement.classList.remove('no-custom-cursor');

      const dot = document.querySelector('.cursor-dot');
      const ring = document.querySelector('.cursor-ring');
      const label = ring?.querySelector('.cursor-label');

      if (dot && ring) {
        const xDot = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
        const yDot = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
        const xRing = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3' });
        const yRing = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3' });

        on(window, 'mousemove', (e) => {
          xDot(e.clientX);
          yDot(e.clientY);
          xRing(e.clientX);
          yRing(e.clientY);
        });

        const HOVERABLE = 'a, button, [data-cursor], .tile, .dish-card, .review-card, input, select';

        on(document, 'mouseover', (e) => {
          const el = e.target.closest(HOVERABLE);
          if (!el) return;
          const text = el.getAttribute('data-cursor') || (el.querySelector('img') ? 'VIEW' : 'EAT');
          if (label) label.textContent = text.toUpperCase();
          ring.classList.add('has-text');
        });

        on(document, 'mouseout', (e) => {
          if (e.target.closest(HOVERABLE)) ring.classList.remove('has-text');
        });
      }
    } else {
      document.documentElement.classList.add('no-custom-cursor');
    }

    /* --------------------------------------------------------
       3. MAGNETIC BUTTONS
       -------------------------------------------------------- */
    if (finePointer && !reduceMotion) {
      document.querySelectorAll('.magnetic').forEach((btn) => {
        const strength = 0.35;
        const inner = btn.querySelector('span') || btn;

        const move = (e) => {
          const r = btn.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) * strength;
          const dy = (e.clientY - (r.top + r.height / 2)) * strength;
          gsap.to(btn, { x: dx, y: dy, duration: 0.5, ease: 'power3.out' });
          gsap.to(inner, { x: dx * 0.4, y: dy * 0.4, duration: 0.5, ease: 'power3.out' });
        };

        const reset = () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, .5)' });
          gsap.to(inner, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, .5)' });
        };

        on(btn, 'mousemove', move);
        on(btn, 'mouseleave', reset);
      });
    }

    /* --------------------------------------------------------
       4. GRADIENT ORBS — drift with the mouse
       -------------------------------------------------------- */
    if (finePointer && !reduceMotion) {
      const orbs = Array.from(document.querySelectorAll('.orb'));
      const strengths = [0.03, 0.05, 0.02];

      orbs.forEach((orb, i) => {
        const xTo = gsap.quickTo(orb, 'x', { duration: 1.4, ease: 'power3' });
        const yTo = gsap.quickTo(orb, 'y', { duration: 1.4, ease: 'power3' });
        const s = strengths[i % strengths.length];

        on(window, 'mousemove', (e) => {
          xTo((e.clientX - window.innerWidth / 2) * s);
          yTo((e.clientY - window.innerHeight / 2) * s);
        });
      });
    }

    /* --------------------------------------------------------
       5. THE CONTEXT — everything GSAP-owned, revertible
       -------------------------------------------------------- */
    const ctx = gsap.context(() => {
      /* ---------- 5a. PRELOADER + HERO INTRO ---------- */
      const startHeroIntro = () => {
        /* reduced motion: the hero is simply there, no entrance tween */
        if (reduceMotion) return;

        const heroChars = document.querySelectorAll('.hero-title .char');
        gsap.from(heroChars, {
          yPercent: 120,
          opacity: 0,
          duration: 0.75,
          stagger: 0.022,
          ease: 'power4.out',
          delay: 0.05,
        });
        gsap.from('.hero-tag', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 });
        gsap.from('.hero-sub', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 });
        gsap.from('.hero-actions', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.65 });
        gsap.from('.hero-chip', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.8 });
        gsap.from('.cutout', {
          scale: 0.3,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: 'elastic.out(1, .6)',
          delay: 0.4,
        });
        gsap.from('.scroll-hint', { opacity: 0, duration: 0.8, delay: 1.2 });
      };

      /* straight to the page — used for reduced motion, repeat visits,
         and as the failsafe path */
      const skipPreloader = () => {
        const pre = document.getElementById('preloader');
        if (pre) {
          pre.classList.add('done');
          pre.style.display = 'none';
        }
        document.querySelectorAll('.curtain').forEach((c) => {
          c.style.display = 'none';
        });
        revealPage();
        startHeroIntro();
      };

      const runPreloader = () => {
        const pre = document.getElementById('preloader');
        if (!pre) {
          revealPage();
          return;
        }

        const num = pre.querySelector('.pre-num');
        const bar = pre.querySelector('.pre-bar-fill');
        const bird = pre.querySelector('.pre-bird');

        if (reduceMotion) {
          skipPreloader();
          return;
        }

        const counter = { v: 0 };

        const tl = gsap.timeline({
          onComplete: () => {
            pre.classList.add('done');
            try {
              sessionStorage.setItem('mistwood-seen', '1'); // skip on repeat visits
            } catch (err) {
              /* private mode — no problem, it just plays again */
            }

            /* the page goes live underneath the wipe, so the hero paints
               while the curtains are still parting */
            markLoaded();
            startHeroIntro();

            document.querySelector('.curtain-top')?.classList.add('wipe-top');
            document.querySelector('.curtain-bottom')?.classList.add('wipe-bottom');

            after(820, () => {
              hideCurtains();
              ScrollTrigger.refresh();
            });
          },
        });

        tl.fromTo(
          bird,
          { x: -260, rotate: -12, opacity: 0.15 },
          { x: 260, rotate: 10, opacity: 1, duration: 1.05, ease: 'power3.inOut' },
          0
        );
        tl.to(
          counter,
          {
            v: 100,
            duration: 0.95,
            ease: 'power2.inOut',
            onUpdate: () => {
              const v = Math.round(counter.v);
              if (num) num.textContent = v;
              if (bar) bar.style.width = v + '%';
            },
          },
          0
        );
      };

      /* failsafe: never leave a visitor staring at a blank page */
      after(4500, revealPage); // last-resort failsafe

      /* split the hero headline into chars for the intro reveal */
      document.querySelectorAll('[data-split="hero"]').forEach((el) => splitText(el));

      let alreadySeen = false;
      try {
        alreadySeen = sessionStorage.getItem('mistwood-seen') === '1';
      } catch (err) {
        alreadySeen = false;
      }

      if (!preloaderPlayed && !alreadySeen && !leanNetwork) {
        preloaderPlayed = true;
        runPreloader();
      } else {
        skipPreloader();
      }

      /* ---------- 5b. GENERIC SCROLL REVEALS ---------- */
      if (!reduceMotion) {
        document.querySelectorAll('[data-reveal="up"]').forEach((el) => {
          /* the pinned story owns its own timeline, and the hero has the
             load intro — a scroll reveal on top of either one leaves the
             element stuck at opacity 0 above the fold */
          if (el.closest('[data-pin-story]') || el.closest('.hero')) return;
          gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          });
        });

        document.querySelectorAll('.clip-img').forEach((wrap) => {
          if (wrap.closest('[data-pin-story]')) return;
          const img = wrap.querySelector('img');

          gsap.fromTo(
            wrap,
            { clipPath: 'inset(0 0 100% 0)' },
            {
              clipPath: 'inset(0 0 0% 0)',
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: { trigger: wrap, start: 'top 82%' },
            }
          );

          if (img) {
            gsap.from(img, {
              yPercent: 14,
              duration: 1.3,
              ease: 'power3.out',
              scrollTrigger: { trigger: wrap, start: 'top 82%' },
            });
          }
        });
      }

      /* ---------- 5c. HERO PARALLAX ---------- */
      if (!reduceMotion) {
        gsap.to('.hero-bg img', {
          yPercent: 20,
          scale: 1.12,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        });

        gsap.to('.cutout', {
          y: (i, el) => parseFloat(el.dataset.parallax) || 60,
          rotation: (i, el) => parseFloat(el.dataset.rot) || 10,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        });
      }

      /* ---------- 5d. STORY — pinned word-by-word fill ---------- */
      const story = document.querySelector('[data-pin-story]');
      const storyHeadline = story?.querySelector('[data-fill]');
      if (story && storyHeadline) {
        splitText(storyHeadline, { words: true });
        const chars = storyHeadline.querySelectorAll('.char');

        if (!reduceMotion) {
          const contentEls = Array.from(story.querySelectorAll('[data-reveal="up"]'));
          const storyImg = story.querySelector('.story-img');
          const storyImgInner = storyImg ? storyImg.querySelector('img') : null;

          gsap.set(chars, { yPercent: 115 });
          gsap.set(contentEls, { opacity: 0, y: 50 });
          if (storyImg) gsap.set(storyImg, { clipPath: 'inset(0 0 100% 0)' });
          if (storyImgInner) gsap.set(storyImgInner, { yPercent: 14 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: story,
              start: 'top top',
              end: '+=260%',
              pin: true,
              scrub: 0.5,
            },
          });

          tl.to(chars, { yPercent: 0, stagger: 0.012, ease: 'none' }, 0);
          tl.to(contentEls, { opacity: 1, y: 0, stagger: 0.14, duration: 0.8, ease: 'power3.out' }, 0.5);
          if (storyImg) tl.to(storyImg, { clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.out' }, 0.5);
          if (storyImgInner) tl.to(storyImgInner, { yPercent: 0, duration: 1.2, ease: 'power3.out' }, 0.5);
        }
      }

      /* ---------- 5e. DISHES — pinned horizontal roll ---------- */
      const dishes = document.querySelector('.dishes');
      const pin = document.querySelector('.dishes-pin');
      const track = document.getElementById('dishesTrack');

      if (dishes && pin && track && !reduceMotion) {
        const cards = Array.from(track.querySelectorAll('.dish-card'));
        const colors = cards.map((c) => c.dataset.color);
        let activeIdx = -1;

        gsap.from(cards, {
          y: 80,
          opacity: 0,
          stagger: 0.06,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: dishes, start: 'top 70%' },
        });

        const getDistance = () => Math.max(0, track.scrollWidth - pin.clientWidth + 60);

        gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => '+=' + getDistance(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(cards.length - 1, Math.round(self.progress * (cards.length - 1)));
              if (idx === activeIdx) return;
              activeIdx = idx;
              cards.forEach((c, i) => c.classList.toggle('is-focused', i === idx));
              gsap.to(dishes, {
                backgroundColor: colors[idx],
                duration: 0.9,
                ease: 'power2.out',
                overwrite: true,
              });
            },
          },
        });
      }

      /* ---------- 5f. "TO …" SEQUENCE (PINNED SCROLL-TRIGGERED PHRASES) ---------- */
      const sequence = document.querySelector('[data-to-sequence]');
      if (sequence && !reduceMotion) {
        const phrases = Array.from(sequence.querySelectorAll('.to-phrase'));
        const bgItems = Array.from(sequence.querySelectorAll('.to-bg-item'));
        const trackerBar = sequence.querySelector('#toTrackerBar');
        const trackerStep = sequence.querySelector('#toTrackerStep');

        // Initial setup:
        // Phrase 0 starts prominently centered and visible
        gsap.set(phrases[0], { yPercent: 0, opacity: 1, scale: 1 });
        if (bgItems[0]) gsap.set(bgItems[0], { opacity: 1, scale: 1.05 });
        if (trackerBar) gsap.set(trackerBar, { scaleX: 0.33 });
        if (trackerStep) trackerStep.textContent = '01';

        // Subsequent phrases start off below the stage, hidden
        for (let i = 1; i < phrases.length; i++) {
          gsap.set(phrases[i], { yPercent: 75, opacity: 0, scale: 1.04 });
          if (bgItems[i]) gsap.set(bgItems[i], { opacity: 0, scale: 1.08 });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sequence,
            start: 'top top',
            end: '+=280%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (!trackerStep) return;
              const p = self.progress;
              if (p < 0.35) {
                if (trackerStep.textContent !== '01') trackerStep.textContent = '01';
              } else if (p < 0.68) {
                if (trackerStep.textContent !== '02') trackerStep.textContent = '02';
              } else {
                if (trackerStep.textContent !== '03') trackerStep.textContent = '03';
              }
            },
          },
        });

        // 1. Initial dwell time — keep TO GATHER centered & sticky as user starts scrolling
        tl.to({}, { duration: 1.4 });

        // 2. Transition from TO GATHER -> TO SAVOR
        tl.addLabel('trans1', 1.4);

        // TO GATHER exits smoothly upward with subtle fade
        tl.to(
          phrases[0],
          {
            yPercent: -65,
            opacity: 0,
            scale: 0.96,
            duration: 2.0,
            ease: 'power2.inOut',
          },
          'trans1'
        );
        if (bgItems[0]) {
          tl.to(bgItems[0], { opacity: 0, scale: 1.0, duration: 2.0, ease: 'power1.inOut' }, 'trans1');
        }

        // TO SAVOR rises upward from bottom to center with smooth opacity
        tl.to(
          phrases[1],
          {
            yPercent: 0,
            opacity: 1,
            scale: 1,
            duration: 2.0,
            ease: 'power2.inOut',
          },
          'trans1+=0.2'
        );
        if (bgItems[1]) {
          tl.to(bgItems[1], { opacity: 1, scale: 1.04, duration: 2.0, ease: 'power1.inOut' }, 'trans1');
        }
        if (trackerBar) {
          tl.to(trackerBar, { scaleX: 0.66, duration: 2.0, ease: 'power1.inOut' }, 'trans1');
        }

        // 3. Middle dwell time — keep TO SAVOR centered & sticky
        tl.to({}, { duration: 1.4 });

        // 4. Transition from TO SAVOR -> TO CELEBRATE
        tl.addLabel('trans2', 4.8);

        // TO SAVOR exits smoothly upward with subtle fade
        tl.to(
          phrases[1],
          {
            yPercent: -65,
            opacity: 0,
            scale: 0.96,
            duration: 2.0,
            ease: 'power2.inOut',
          },
          'trans2'
        );
        if (bgItems[1]) {
          tl.to(bgItems[1], { opacity: 0, scale: 1.0, duration: 2.0, ease: 'power1.inOut' }, 'trans2');
        }

        // TO CELEBRATE rises upward from bottom to center with smooth opacity
        tl.to(
          phrases[2],
          {
            yPercent: 0,
            opacity: 1,
            scale: 1,
            duration: 2.0,
            ease: 'power2.inOut',
          },
          'trans2+=0.2'
        );
        if (bgItems[2]) {
          tl.to(bgItems[2], { opacity: 1, scale: 1.04, duration: 2.0, ease: 'power1.inOut' }, 'trans2');
        }
        if (trackerBar) {
          tl.to(trackerBar, { scaleX: 1.0, duration: 2.0, ease: 'power1.inOut' }, 'trans2');
        }

        // 5. Final dwell time — keep TO CELEBRATE centered & sticky before releasing pin
        tl.to({}, { duration: 1.8 });
      }

      /* ---------- 5g. FOOTER — cursor-reactive headline + wordmark ---------- */
      const headline = document.querySelector('[data-tilt]');
      if (headline) {
        splitText(headline);
        const els = Array.from(headline.querySelectorAll('.char'));
        els.forEach((el) => el.classList.add('fc-char'));

        if (finePointer && !reduceMotion) {
          const xTos = els.map((el) => gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' }));
          const yTos = els.map((el) => gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' }));
          const rTos = els.map((el) => gsap.quickTo(el, 'rotation', { duration: 0.5, ease: 'power3' }));
          const zone = headline.parentElement;

          const onMove = (e) => {
            const r = zone.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
            const dy = (e.clientY - (r.top + r.height / 2)) / r.height;

            els.forEach((el, i) => {
              const spread = (i - (els.length - 1) / 2) / (els.length / 2);
              xTos[i](dx * 46 * (1 - Math.abs(spread) * 0.5) + spread * 14);
              yTos[i](dy * 30 * (1 - Math.abs(spread) * 0.5));
              rTos[i](spread * dx * 22);
            });
          };

          const onLeave = () => {
            els.forEach((el) =>
              gsap.to(el, { x: 0, y: 0, rotation: 0, duration: 0.8, ease: 'elastic.out(1, .5)' })
            );
          };

          on(zone, 'mousemove', onMove);
          on(zone, 'mouseleave', onLeave);
        }
      }

      const wordmark = document.querySelector('.wordmark');
      if (wordmark && !reduceMotion) {
        gsap.fromTo(
          wordmark,
          { backgroundSize: '0% 100%' },
          {
            backgroundSize: '100% 100%',
            ease: 'none',
            scrollTrigger: {
              trigger: wordmark.parentElement,
              start: 'top 92%',
              end: 'bottom bottom',
              scrub: true,
            },
          }
        );
      }

      /* ---------- 5h. SCROLL PROGRESS BAR ---------- */
      const progressBar = document.querySelector('.scroll-progress span');
      if (progressBar) {
        if (reduceMotion) {
          on(window, 'scroll', () => {
            const h = document.documentElement;
            progressBar.style.transform =
              'scaleX(' + h.scrollTop / (h.scrollHeight - h.clientHeight || 1) + ')';
          });
        } else {
          gsap.to(progressBar, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { start: 0, end: 'max', scrub: true },
          });
        }
      }
    });

    /* --------------------------------------------------------
       6. MEASUREMENT — keep pinned sections honest
       -------------------------------------------------------- */
    const refresh = () => ScrollTrigger.refresh();
    on(window, 'load', refresh);
    on(window, 'mistwood:layout', refresh);
    if (document.fonts?.ready) document.fonts.ready.then(refresh);

    ScrollTrigger.config({ ignoreMobileResize: true });

    /* --------------------------------------------------------
       7. TEARDOWN
       -------------------------------------------------------- */
    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (tickerFn) gsap.ticker.remove(tickerFn);
      if (lenis) {
        lenis.destroy();
        setLenis(null);
      }
    };
  }, []);

  return null;
}
