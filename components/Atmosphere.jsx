/* ============================================================
   Atmosphere — grain overlay, drifting gradient orbs, scroll progress, skip link.
   ============================================================ */

export default function Atmosphere() {
  return (
    <>
      <div className="grain" aria-hidden="true"></div>
      <div className="orbs" aria-hidden="true">
        <span className="orb orb-1"></span>
        <span className="orb orb-2"></span>
        <span className="orb orb-3"></span>
      </div>
      <div className="scroll-progress" aria-hidden="true"><span></span></div>

      <a className="skip-link" href="#hero">Skip to content</a>
    </>
  );
}
