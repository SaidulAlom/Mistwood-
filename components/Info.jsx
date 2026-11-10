/* ============================================================
   Info strip — hours, price, services, amenities.
   ============================================================ */

export default function Info() {
  return (
    <>
      <section className="info" id="info">
        <div className="info-grid">
          <div className="info-card glass" data-reveal="up">
            <svg viewBox="0 0 24 24" width="26" height="26"><circle cx="12" cy="12" r="9" stroke="#F28C28" strokeWidth="2" fill="none"/><path d="M12 7v5l3.5 2" stroke="#F28C28" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
            <h3>Hours</h3>
            <p>Open daily<br />10 AM – 9 PM<br />(kitchen till 8:45 PM)</p>
          </div>
          <div className="info-card glass" data-reveal="up">
            <svg viewBox="0 0 24 24" width="26" height="26"><path d="M12 2v20M17 5.5C17 4.1 15.4 3 14 3 12 3 12 4.5 12 4.5C12 4.5 12 3 10 3 8.6 3 7 4.1 7 5.5M9 14.5c1 1.2 4 1.2 5 0" stroke="#F28C28" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
            <h3>Price</h3>
            <p>₹200 – ₹1,200<br />per person<br />all-inclusive</p>
          </div>
          <div className="info-card glass" data-reveal="up">
            <svg viewBox="0 0 24 24" width="26" height="26"><path d="M3 7h12v10H3zM15 10h4l3 3v3h-7" stroke="#F28C28" strokeWidth="2" fill="none" strokeLinejoin="round"/><circle cx="7" cy="17" r="2" stroke="#F28C28" strokeWidth="2" fill="none"/><circle cx="18" cy="17" r="2" stroke="#F28C28" strokeWidth="2" fill="none"/></svg>
            <h3>Services</h3>
            <p>Dine-in · Takeaway<br />Delivery<br />No-contact delivery</p>
          </div>
          <div className="info-card glass" data-reveal="up">
            <svg viewBox="0 0 24 24" width="26" height="26"><path d="M12 2l7 3v7c0 4.5-3 8-7 10-4-2-7-5.5-7-10V5z" stroke="#F28C28" strokeWidth="2" fill="none" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#F28C28" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <h3>Amenities</h3>
            <p>Wheelchair-accessible seating · Restroom · Cards &amp; NFC · Free street parking · Reservations</p>
          </div>
        </div>
      </section>
    </>
  );
}
