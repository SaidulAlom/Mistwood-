/* ============================================================
   Guest reviews — rating badge + two auto-scrolling testimonial
   rows (the second row is the same list again, which is what
   makes the CSS marquee loop seamlessly).
   ============================================================ */

import { REVIEWS } from '@/lib/reviewData';

function Row({ ariaHidden = false }) {
  return (
    <div className="reviews-track" aria-hidden={ariaHidden || undefined}>
      {REVIEWS.map((review) => (
        <article className="review-card glass" key={review.name + review.quote.slice(0, 12)}>
          <p>“{review.quote}”</p>
          <span>— {review.name}</span>
        </article>
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section className="reviews" id="reviews">
      <div className="reviews-head">
        <div className="rating-badge glass" data-reveal="up">
          <span className="rb-score">4.1</span>
          <span className="rb-star">★</span>
          <small>139 Google reviews</small>
        </div>
        <h2 className="reviews-title" data-reveal="up">
          WHAT GUESTS <em>SAY</em>
        </h2>
      </div>

      <div className="reviews-marquee" aria-hidden="true">
        <Row />
        <Row ariaHidden />
      </div>
    </section>
  );
}
