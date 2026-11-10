/* ============================================================
   Story — pinned section; headline fills word by word (ScrollFX drives it).
   ============================================================ */

export default function Story() {
  return (
    <>
      <section className="story" id="story" data-pin-story>
        <div className="story-stage">
          <p className="kicker kicker-light" data-reveal="up">Why we exist</p>

          <h2 className="story-headline" data-fill="WE'RE HERE FOR THE EVERYDAY MOMENTS.">WE'RE HERE FOR THE EVERYDAY MOMENTS.</h2>
        </div>

        <div className="story-content">
          <div className="story-img clip-img">
            <picture><source srcSet="/images/story.webp" type="image/webp" /><img src="/images/story.jpg" alt="A homestyle Northeast meal spread on a wooden table" width="1200" height="900" loading="lazy" /></picture>
          </div>
          <div className="story-text">
            <h3 data-reveal="up">A kitchen that felt like home</h3>
            <p data-reveal="up">In 2015, a small kitchen along the misty pine ridge started serving momos to neighbours who wanted something warm and honest. The sign said <em>Mistwood</em> — after the morning mist that winds through the Northeast hills at first light.</p>
            <p data-reveal="up">Ten years later, it's still the same kitchen. Same dough rolled every morning. Same thukpa simmering slowly through the day. Only now there are more tables, more smiles, and a lot more chili oil.</p>
            <p data-reveal="up">We believe food should feel like an invitation, not a transaction. So come as you are — with family, with friends, or with a good book. There's always a seat, a steaming plate, and an extra spoon of sauce.</p>
            <a className="link-arrow" href="#dishes" data-reveal="up">See what's cooking <i>→</i></a>
          </div>
        </div>
      </section>
    </>
  );
}
