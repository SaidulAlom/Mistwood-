/* ============================================================
   Location & contact — embedded map, address, directions,
   and the "send us a note" contact form.
   ============================================================ */

import ContactForm from '@/components/ContactForm';
import {
  SITE_NAME,
  MAP_EMBED,
  MAP_LINK,
  ADDRESS,
  ADDRESS_HEADING_LINE1,
  ADDRESS_HEADING_LINE2,
  PHONE_DISPLAY,
  PHONE_TEL,
} from '@/lib/site';

export default function Location() {
  return (
    <>
      <section className="location" id="location">
        <div className="location-map glass" data-reveal="up">
          <iframe
            title={`${SITE_NAME} location`}
            src={MAP_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          ></iframe>
        </div>

        <div className="location-info">
          <p className="kicker kicker-light" data-reveal="up">Find us</p>
          <h2 className="location-title" data-reveal="up">
            {ADDRESS_HEADING_LINE1}<br />
            <em>{ADDRESS_HEADING_LINE2}</em>
          </h2>

          <div className="location-card glass" data-reveal="up">
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 21s7-6.4 7-11a7 7 0 10-14 0c0 4.6 7 11 7 11z" stroke="#F28C28" strokeWidth="2" fill="none" strokeLinejoin="round"/><circle cx="12" cy="10" r="2.5" stroke="#F28C28" strokeWidth="2" fill="none"/></svg>
            <div><strong>Address</strong>{ADDRESS}</div>
          </div>

          <div className="location-card glass" data-reveal="up">
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 5h4l2 5-2.5 1.5a11 11 0 005 5L19 13l2 5v3a2 2 0 01-2 2A16 16 0 013 7a2 2 0 011-2z" stroke="#F28C28" strokeWidth="2" fill="none" strokeLinejoin="round"/></svg>
            <div><strong>Phone</strong>{PHONE_DISPLAY} <a href={`tel:${PHONE_TEL}`}>Call now →</a></div>
          </div>

          <div className="location-card glass" data-reveal="up">
            <svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="9" stroke="#F28C28" strokeWidth="2" fill="none"/><path d="M12 7v5l3.5 2" stroke="#F28C28" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
            <div><strong>Hours</strong>Open daily, 10 AM – 9 PM</div>
          </div>

          <p className="visitor-hint handwritten" data-reveal="up">First floor, overlooking Pine Ridge view point — look for the warm lantern and wooden sign.</p>

          <a className="btn btn-primary magnetic" href={MAP_LINK} target="_blank" rel="noopener" data-cursor="eat" data-reveal="up"><span>Get Directions</span></a>
        </div>
        {/* contact form panel — spans both columns of the grid */}
        <ContactForm />
      </section>
    </>
  );
}
