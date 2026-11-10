/* ============================================================
   Preloader — bird flies across, % counter, curtain wipe.
   ============================================================ */

export default function Preloader() {
  return (
    <>
      <div id="preloader" aria-hidden="true">
        <div className="pre-inner">

          <svg className="pre-bird" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">

            <path className="pre-bird-body" d="M78 34c0-16 18-19 23-6 3.6 8.4-4.4 10-8.6 13.6l19.4 29.4c11 5.6 7.6-16-16.4-22.4C76.6 48.2 67.2 38 78 34Z" fill="#F6EEDC"/>

            <path d="M97 20c5.4-10 17-12 21.6-6 3.4 4.2 1.6 10.4-2 12.6L97 32c-2.6-1.4-1.6-5.6 0-8Z" fill="#F28C28"/>

            <path d="M117 37c29.6 5.2 47 19.6 59 38.4C150 61.6 124.6 56 108 61.4c-10-9.8-18-20-22.6-33.2 1.2-2.2 3-3.8 5.4-5.2Z" fill="#F28C28"/>

            <circle cx="96" cy="38" r="5" fill="#0F2A1D"/>
            <circle cx="97" cy="38" r="2.4" fill="#161616"/>

            <path d="M74 56c18.4 17.6 34 8.4 36.8 1.2 3.4-8.6-2.4-19.4-16-22.4C82.6 41.6 72.4 50.6 74 56Z" fill="#0F2A1D" opacity=".85"/>

            <path d="M74 62.6L42 70l26 11.4L104 81l-30-18.4z" fill="#F6EEDC" opacity=".9"/>

            <path d="M92 44.4c12.6 11.4 34 13.6 50.4 3.4-14-9-33.6-9.4-47.4-1.8 2.6 5.6 8.6 8.4 12.4 9.4-5.4 2.2-9 2-15.4-1Z" fill="#161616" opacity=".8"/>

            <path d="M98 74v16M108 74v16" stroke="#F28C28" strokeWidth="4" strokeLinecap="round"/>
          </svg>

          <div className="pre-meta">
            <div className="pre-bar"><span className="pre-bar-fill"></span></div>
            <div className="pre-count"><span className="pre-num">0</span><i>%</i></div>
          </div>
        </div>
      </div>

      <div className="curtain curtain-top" aria-hidden="true"></div>
      <div className="curtain curtain-bottom" aria-hidden="true"></div>
    </>
  );
}
