/* ============================================================
   Marquee — repeating text strip between sections.
   `variant="reverse"` renders the reversed second strip.
   ============================================================ */

const STRIP_A = 'MOMO • THUKPA • BBQ • PIZZA • SEAFOOD • COFFEE •';
const STRIP_B = 'FRESH DOUGH • MADE BY HAND • OPEN DAILY • HOMESTYLE • CHILI OIL ON EVERY TABLE •';

export default function Marquee({ variant = 'forward' }) {
  const reversed = variant === 'reverse';
  const text = reversed ? STRIP_B : STRIP_A;
  return (
    <div
      className={'marquee marquee-cream' + (reversed ? ' marquee-reverse' : '')}
      aria-hidden="true"
    >
      <div className="marquee-track">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i}>{text}</span>
        ))}
      </div>
    </div>
  );
}
