'use client';

/* ============================================================
   Gallery — bento grid of ambience shots + accessible lightbox
   (click, arrow keys, Escape, backdrop click, focus management).
   ============================================================ */

import { useCallback, useEffect, useRef, useState } from 'react';
import { GALLERY_TILES } from '@/lib/galleryData';
import { startScroll, stopScroll } from '@/lib/lenis';

export default function Gallery() {
  const [index, setIndex] = useState(null);
  const closeRef = useRef(null);
  const lastFocused = useRef(null);
  const open = index !== null;
  const tile = open ? GALLERY_TILES[index] : null;

  const close = useCallback(() => setIndex(null), []);

  const step = useCallback((dir) => {
    setIndex((i) => (i === null ? i : (i + dir + GALLERY_TILES.length) % GALLERY_TILES.length));
  }, []);

  /* open the tile, remembering what to give focus back to */
  const openAt = (i) => {
    lastFocused.current = document.activeElement;
    setIndex(i);
  };

  /* lock scrolling + keyboard controls while the lightbox is up */
  useEffect(() => {
    if (!open) return;

    stopScroll();
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      startScroll();
      lastFocused.current?.focus?.();
    };
  }, [open, close, step]);

  return (
    <>
      <section className="gallery" id="gallery">
        <div className="gallery-head">
          <p className="kicker kicker-light" data-reveal="up">
            Ambience
          </p>
          <h2 className="gallery-title" data-reveal="up">
            WARM LIGHTS, <em>LONG TABLES</em>
          </h2>
          <div className="gallery-tags" data-reveal="up">
            <span className="tag-chip">Casual</span>
            <span className="tag-chip">Trendy</span>
            <span className="tag-chip">Good for groups</span>
            <span className="tag-chip">Good for kids</span>
          </div>
        </div>

        <div className="bento">
          {GALLERY_TILES.map((t, i) => (
            <button
              key={t.img}
              className={'tile ' + t.cls}
              data-cursor="view"
              data-lightbox={'/images/' + t.img + '.jpg'}
              data-cap={t.cap}
              onClick={() => openAt(i)}
              aria-label={'View photo: ' + t.cap}
            >
              <picture>
                <source srcSet={'/images/' + t.img + '.webp'} type="image/webp" />
                <img
                  src={'/images/' + t.img + '.jpg'}
                  alt={t.alt}
                  width={t.w}
                  height={t.h}
                  loading="lazy"
                />
              </picture>
              <span className="tile-cap">{t.cap}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <div
        className={'lightbox' + (open ? ' open' : '')}
        id="lightbox"
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <button className="lb-close" aria-label="Close" onClick={close} ref={closeRef}>
          ✕
        </button>
        <button className="lb-nav lb-prev" aria-label="Previous" onClick={() => step(-1)}>
          ‹
        </button>
        <figure className="lb-figure">
          {tile && <img id="lb-img" src={'/images/' + tile.img + '.jpg'} alt={tile.alt} />}
          <figcaption id="lb-cap">
            {tile ? tile.cap + ' · ' + (index + 1) + '/' + GALLERY_TILES.length : ''}
          </figcaption>
        </figure>
        <button className="lb-nav lb-next" aria-label="Next" onClick={() => step(1)}>
          ›
        </button>
      </div>
    </>
  );
}
