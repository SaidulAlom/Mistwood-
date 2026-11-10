/* ============================================================
   Signature dishes — cards roll horizontally, section colour shifts per dish.
   ============================================================ */

export default function Dishes() {
  return (
    <>
      <section className="dishes" id="dishes">
        <div className="dishes-head">
          <p className="kicker kicker-light" data-reveal="up">Signature dishes</p>
          <h2 className="dishes-title" data-reveal="up">ROLL IT, <em>DON'T STOP</em></h2>
          <p className="dishes-note handwritten" data-reveal="up">scroll → and watch the kitchen change colour</p>
        </div>

        <div className="dishes-pin">
          <div className="dishes-track" id="dishesTrack">

            <article className="dish-card" data-color="#A85F12" data-cursor="view">
              <div className="dish-img">
                <picture><source srcSet="/images/momo.webp" type="image/webp" /><img src="/images/momo.jpg" alt="Steamed momo" width="900" height="1100" loading="lazy" /></picture>
                <span className="dish-no">01</span>
              </div>
              <div className="dish-meta">
                <h3>Steamed Momo</h3>
                <p>Plump, steamy, folded by hand every morning.</p>
              </div>
            </article>

            <article className="dish-card" data-color="#9C6B22" data-cursor="view">
              <div className="dish-img">
                <picture><source srcSet="/images/thukpa.webp" type="image/webp" /><img src="/images/thukpa.jpg" alt="Thukpa noodle soup" width="900" height="1100" loading="lazy" /></picture>
                <span className="dish-no">02</span>
              </div>
              <div className="dish-meta">
                <h3>Thukpa</h3>
                <p>Soup that wraps you in a hug. Every. Single. Time.</p>
              </div>
            </article>

            <article className="dish-card" data-color="#8F2A1E" data-cursor="view">
              <div className="dish-img">
                <picture><source srcSet="/images/pizza.webp" type="image/webp" /><img src="/images/pizza.jpg" alt="Chicken sausage pizza" width="900" height="1100" loading="lazy" /></picture>
                <span className="dish-no">03</span>
              </div>
              <div className="dish-meta">
                <h3>Chicken Sausage Pizza</h3>
                <p>Wood-fired, cheese-pull, forty-minute magic.</p>
              </div>
            </article>

            <article className="dish-card" data-color="#7A2E18" data-cursor="view">
              <div className="dish-img">
                <picture><source srcSet="/images/bbq.webp" type="image/webp" /><img src="/images/bbq.jpg" alt="Barbeque platter" width="900" height="1100" loading="lazy" /></picture>
                <span className="dish-no">04</span>
              </div>
              <div className="dish-meta">
                <h3>Barbeque Platter</h3>
                <p>The whole gang, grilled over live coals.</p>
              </div>
            </article>

            <article className="dish-card" data-color="#9A3726" data-cursor="view">
              <div className="dish-img">
                <picture><source srcSet="/images/chilli.webp" type="image/webp" /><img src="/images/chilli.jpg" alt="Chicken chilli" width="900" height="1100" loading="lazy" /></picture>
                <span className="dish-no">05</span>
              </div>
              <div className="dish-meta">
                <h3>Chicken Chilli</h3>
                <p>Indo-Chinese fire with a bright green edge.</p>
              </div>
            </article>

            <article className="dish-card" data-color="#A85F12" data-cursor="view">
              <div className="dish-img">
                <picture><source srcSet="/images/chicken65.webp" type="image/webp" /><img src="/images/chicken65.jpg" alt="Chicken 65" width="900" height="1100" loading="lazy" /></picture>
                <span className="dish-no">06</span>
              </div>
              <div className="dish-meta">
                <h3>Chicken 65</h3>
                <p>Crisp outside, juicy inside. Sixty-five minutes of craving.</p>
              </div>
            </article>

            <article className="dish-card" data-color="#1E4D38" data-cursor="view">
              <div className="dish-img">
                <picture><source srcSet="/images/seafood.webp" type="image/webp" /><img src="/images/seafood.jpg" alt="Fresh seafood platter" width="900" height="1100" loading="lazy" /></picture>
                <span className="dish-no">07</span>
              </div>
              <div className="dish-meta">
                <h3>Fresh Seafood</h3>
                <p>From the river to your plate before it blinks.</p>
              </div>
            </article>

            <article className="dish-card" data-color="#A98A4E" data-cursor="view">
              <div className="dish-img">
                <picture><source srcSet="/images/shake.webp" type="image/webp" /><img src="/images/shake.jpg" alt="Vanilla milkshake" width="900" height="1100" loading="lazy" /></picture>
                <span className="dish-no">08</span>
              </div>
              <div className="dish-meta">
                <h3>Vanilla Shake</h3>
                <p>Thick, frosty, childhood in a glass.</p>
              </div>
            </article>

            <article className="dish-card" data-color="#5E3E27" data-cursor="view">
              <div className="dish-img">
                <picture><source srcSet="/images/coffee.webp" type="image/webp" /><img src="/images/coffee.jpg" alt="Filter coffee" width="900" height="1100" loading="lazy" /></picture>
                <span className="dish-no">09</span>
              </div>
              <div className="dish-meta">
                <h3>Filter Coffee</h3>
                <p>South Indian filter aroma, slow mornings.</p>
              </div>
            </article>

          </div>
        </div>
        <p className="dishes-hint handwritten" aria-hidden="true">↓ keep scrolling — the plate spins with you</p>
      </section>
    </>
  );
}
