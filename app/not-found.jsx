/* ============================================================
   404 — same voice as the site, no dead end.
   ============================================================ */

import Link from 'next/link';
import { PHONE_TEL } from '@/lib/site';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="notfound">
      <div className="notfound-inner">
        <p className="kicker kicker-light">404 · off the menu</p>
        <h1 className="notfound-title">
          THIS DISH
          <br />
          <em>ISN&apos;T ON IT</em>
        </h1>
        <p className="notfound-note">
          The page you were looking for has wandered off. The momos are still where you left them.
        </p>

        <div className="notfound-actions">
          <Link className="btn btn-primary magnetic" href="/">
            <span>Back to home</span>
          </Link>
          <a className="btn btn-ghost magnetic" href={`tel:${PHONE_TEL}`}>
            <span>Call the restaurant</span>
          </a>
        </div>
      </div>
    </main>
  );
}
