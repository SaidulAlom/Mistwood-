/* ============================================================
   TO GATHER / TO SAVOR / TO CELEBRATE — pinned scroll sequence.
   Smooth, cinematic scroll-triggered transitions where each phrase
   occupies the exact same centered position, rising one at a time
   from the bottom as the user scrolls.
   ============================================================ */

const ITEMS = [
  {
    num: '01',
    outText: 'TO',
    fillWord: 'GATHER',
    caption: 'For family dinners, long tables, and laughter that spills into the night.',
    imgWebp: '/images/gather.webp',
    imgJpg: '/images/gather.jpg',
    alt: 'Family and friends sharing a meal at Mistwood',
  },
  {
    num: '02',
    outText: 'TO',
    fillWord: 'SAVOR',
    caption: 'Recipes passed down Northeast mountain kitchens — made fresh every single morning.',
    imgWebp: '/images/chilli.webp',
    imgJpg: '/images/chilli.jpg',
    alt: 'Chicken chilli sizzling in a rustic pan',
  },
  {
    num: '03',
    outText: 'TO',
    fillWord: 'CELEBRATE',
    caption: 'Birthdays, barbeque nights, and every milestone worth a second round.',
    imgWebp: '/images/bbq.webp',
    imgJpg: '/images/bbq.jpg',
    alt: 'Outdoor barbeque night and glowing embers',
  },
];

export default function ToBlocks() {
  return (
    <section className="to-sequence" id="to-blocks" data-to-sequence>
      {/* Background imagery crossfade container */}
      <div className="to-bg-layers" aria-hidden="true">
        {ITEMS.map((item, idx) => (
          <div
            key={item.fillWord}
            className={`to-bg-item to-bg-item-${idx}`}
            data-bg-index={idx}
          >
            <picture>
              <source srcSet={item.imgWebp} type="image/webp" />
              <img
                src={item.imgJpg}
                alt={item.alt}
                width="1400"
                height="900"
                loading="lazy"
              />
            </picture>
          </div>
        ))}
      </div>

      {/* Sleek step indicator & progress */}
      <div className="to-tracker" aria-hidden="true">
        <div className="to-tracker-pill">
          <span className="to-tracker-step" id="toTrackerStep">01</span>
          <span className="to-tracker-divider">/</span>
          <span className="to-tracker-total">03</span>
        </div>
        <div className="to-tracker-progress">
          <span className="to-tracker-bar" id="toTrackerBar"></span>
        </div>
      </div>

      {/* Pinned viewport stage */}
      <div className="to-stage">
        <div className="to-viewport">
          {ITEMS.map((item, idx) => (
            <div
              key={item.fillWord}
              className={`to-phrase to-phrase-${idx}`}
              data-phrase-index={idx}
            >
              <span className="to-num">{item.num}</span>
              <h2 className="to-type">
                <span className="to-out">{item.outText}</span>
                <em className="to-fill">{item.fillWord}</em>
              </h2>
              <p className="to-cap">{item.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
