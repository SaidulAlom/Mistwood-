/* ============================================================
   Hero — stacked display headline, parallax food, floating cutouts.
   ============================================================ */

export default function Hero() {
  return (
    <>
      <section className="hero" id="hero">
        <div className="hero-bg">
          <picture>
            <source srcSet="/images/hero.webp" type="image/webp" />
            <img src="/images/hero.jpg" alt="Steaming momos on a rustic wooden plate" width="1536" height="1024" fetchPriority="high" />
          </picture>
          <div className="hero-bg-veil"></div>
        </div>

        <figure className="cutout cutout-1" data-parallax="-120" data-rot="18">
          <picture><source srcSet="/images/momo.webp" type="image/webp" /><img src="/images/momo.jpg" alt="Steamed momo" width="800" height="800" loading="lazy" /></picture>
        </figure>
        <figure className="cutout cutout-2" data-parallax="90" data-rot="-14">
          <picture><source srcSet="/images/thukpa.webp" type="image/webp" /><img src="/images/thukpa.jpg" alt="Bowl of thukpa" width="800" height="800" loading="lazy" /></picture>
        </figure>
        <figure className="cutout cutout-3" data-parallax="-70" data-rot="22">
          <picture><source srcSet="/images/pizza.webp" type="image/webp" /><img src="/images/pizza.jpg" alt="Chicken sausage pizza" width="800" height="800" loading="lazy" /></picture>
        </figure>

        <div className="hero-inner">
          <p className="hero-tag handwritten">Taste of the Northeast, Served Like Home.</p>

          <h1 className="hero-title">
            <span className="line"><span data-split="hero">TASTE OF</span></span>
            <span className="line"><span data-split="hero">THE <em>NORTH</em></span></span>
            <span className="line"><span data-split="hero">EAST</span></span>
          </h1>

          <p className="hero-sub" data-reveal="up">A homestyle kitchen nestled in the pine hills — momos, thukpa, wood-fired pizza, barbeque nights, and a plate that always tastes like somebody's house.</p>

          <div className="hero-actions" data-reveal="up">
            <a className="btn btn-ghost magnetic" href="#menu" data-cursor="eat"><span>View Menu</span></a>
            <a className="btn btn-primary magnetic" href="#reserve" data-cursor="eat"><span>Reserve a Table</span></a>
          </div>

          <div className="hero-chip glass" data-reveal="up">
            <span className="star">★</span> 4.1 <em>·</em> 139 Google reviews <em>·</em> Open until 9 PM
          </div>
        </div>

        <a className="scroll-hint" href="#story" aria-label="Scroll to story">
          <span>Scroll</span>
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 4v16M6 14l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>
      </section>
    </>
  );
}
