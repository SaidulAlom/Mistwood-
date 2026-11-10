/* ============================================================
   TO GATHER / TO SAVOR / TO CELEBRATE — full-screen pinned statements.
   ============================================================ */

export default function ToBlocks() {
  return (
    <>
      <section className="toblock" id="to-gather" data-to>
        <div className="to-img clip-img" data-parallax-img="0.25">
          <picture><source srcSet="/images/gather.webp" type="image/webp" /><img src="/images/gather.jpg" alt="Family and friends sharing a meal" width="1200" height="900" loading="lazy" /></picture>
        </div>
        <div className="to-inner">
          <span className="to-num">01</span>
          <h2 className="to-type"><span className="to-out">TO</span> <em className="to-fill">GATHER</em></h2>
          <p className="to-cap">For family dinners, long tables, and laughter that spills into the night.</p>
        </div>
      </section>

      <section className="toblock" id="to-savor" data-to>
        <div className="to-img clip-img" data-parallax-img="0.35">
          <picture><source srcSet="/images/chilli.webp" type="image/webp" /><img src="/images/chilli.jpg" alt="Chicken chilli sizzling" width="1200" height="900" loading="lazy" /></picture>
        </div>
        <div className="to-inner">
          <span className="to-num">02</span>
          <h2 className="to-type"><span className="to-out">TO</span> <em className="to-fill">SAVOR</em></h2>
          <p className="to-cap">Recipes passed down Northeast mountain kitchens — made fresh every single morning.</p>
        </div>
      </section>

      <section className="toblock" id="to-celebrate" data-to>
        <div className="to-img clip-img" data-parallax-img="0.3">
          <picture><source srcSet="/images/bbq.webp" type="image/webp" /><img src="/images/bbq.jpg" alt="Barbeque night" width="1200" height="900" loading="lazy" /></picture>
        </div>
        <div className="to-inner">
          <span className="to-num">03</span>
          <h2 className="to-type"><span className="to-out">TO</span> <em className="to-fill">CELEBRATE</em></h2>
          <p className="to-cap">Birthdays, barbeque nights, and every milestone worth a second round.</p>
        </div>
      </section>
    </>
  );
}
