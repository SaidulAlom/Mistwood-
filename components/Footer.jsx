/* ============================================================
   Footer CTA — cursor-reactive headline, links, wordmark fill.
   ============================================================ */

import { SITE_NAME, SITE_WORDMARK, SITE_TAGLINE, ADDRESS_LOCALITY, ADDRESS_REGION } from '@/lib/site';

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-cta">
          <h2 className="footer-headline" data-tilt="LET'S EAT TOGETHER!">LET'S EAT TOGETHER!</h2>
          <a className="btn btn-primary btn-lg magnetic" href="#reserve" data-cursor="eat"><span>Reserve a Table</span></a>

          <nav className="footer-nav" aria-label="Footer">
            <a href="#hero">Home</a>
            <a href="#menu">Menu</a>
            <a href="#story">About</a>
            <a href="#gallery">Gallery</a>
            <a href="#location">Contact</a>
          </nav>

          <div className="footer-social">
            <a href="#" aria-label="Instagram" data-cursor="view"><svg viewBox="0 0 24 24" width="20" height="20"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="17" cy="7" r="1.4" fill="currentColor"/></svg></a>
            <a href="#" aria-label="Facebook" data-cursor="view"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M13 22v-8h2.7l.4-3H13V9.4c0-.9.3-1.5 1.6-1.5H16V5.1C15.4 5 14.6 5 14 5c-.7 0-1.2.1-1.5.3V2H10c-2.2 0-4 1.4-4 3.7V14c0 2.3 1.8 4 4 4h3z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"/></svg></a>
            <a href="#" aria-label="TikTok" data-cursor="view"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M14 4v9.5a3.5 3.5 0 11-3.5-3.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M14 6.5c0 3 1.8 4.2 4 4.4V11" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/></svg></a>
          </div>
        </div>

        <div className="wordmark-wrap">
          <span className="wordmark" data-fill-bg>{SITE_WORDMARK}</span>
        </div>

        <div className="footer-bottom">
          <p>© 2026 {SITE_NAME} · {ADDRESS_LOCALITY}, {ADDRESS_REGION} · {SITE_TAGLINE}.</p>
          <p className="footer-credit handwritten">Made with chili oil &amp; <span style={{ color: '#D7332B' }}>♥</span> in Northeast</p>
        </div>
      </footer>
    </>
  );
}
