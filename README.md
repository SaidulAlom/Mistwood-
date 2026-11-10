# 🌲 Mistwood Restaurant — Next.js

Premium single-page site for **Mistwood Restaurant**, Shillong, Meghalaya —
*“Taste of the Northeast, Served Like Home.”*

Bold oversized typography, scroll storytelling and cinematic sections with a
glassmorphism layer over the top. GSAP + ScrollTrigger for motion, Lenis for
smooth scroll, Next.js App Router for the build. All imagery is original or
royalty-free; the logo mark and every animation are bespoke.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

Node 18.18+ (developed on Node 20).

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | static prerender, metadata API, `next/font` |
| Styling | **CSS Modules-free global stylesheet** (`app/globals.css`) | one design system, CSS variables, no build step for styles |
| Motion | **GSAP 3 + ScrollTrigger** | pinned sections, split-text, parallax, horizontal roll |
| Smooth scroll | **Lenis** | wired into GSAP's ticker |
| Fonts | **next/font (Anton, Inter, Caveat)** | self-hosted → no external requests, no layout shift |

TypeScript was deliberately skipped: the app is a single prerendered page with
no data layer, so `.jsx` keeps the codebase small and the build instant.

---

## Structure

```
hornbill-next/
├── app/
│   ├── layout.jsx          # metadata, OG/Twitter, JSON-LD, fonts, <html>
│   ├── page.jsx            # section composition (server component)
│   ├── not-found.jsx       # styled 404 (returns a real HTTP 404)
│   ├── robots.js           # /robots.txt from SITE_URL
│   ├── sitemap.js          # /sitemap.xml from SITE_URL
│   └── globals.css         # theme tokens → base → sections → responsive
├── components/
│   ├── ScrollFX.jsx        # ★ all imperative motion (one client component)
│   ├── Navbar.jsx          # glass pill + mobile overlay + sticky CTA
│   ├── Preloader.jsx       # bird + % counter + curtain wipe
│   ├── Cursor.jsx          # dot + ring (VIEW / EAT)
│   ├── Atmosphere.jsx      # grain, orbs, progress bar, skip link
│   ├── Hero.jsx            # stacked headline + parallax + floating cutouts
│   ├── Marquee.jsx         # text strip (variant="reverse" for the second one)
│   ├── Story.jsx           # pinned section, headline fills word by word
│   ├── Dishes.jsx          # horizontal “roll it” carousel (colour per dish)
│   ├── ToBlocks.jsx        # TO GATHER / TO SAVOR / TO CELEBRATE
│   ├── Menu.jsx            # glass tabs + sliding pill + menu download
│   ├── Gallery.jsx         # bento grid + accessible lightbox
│   ├── Reviews.jsx         # rating badge + dual auto-scroll rows
│   ├── Info.jsx            # hours / price / services / amenities
│   ├── Reserve.jsx         # frosted form + success animation
│   ├── Location.jsx        # embedded map, address, directions
│   ├── ContactForm.jsx     # "send us a note" form in the Contact section
│   ├── Footer.jsx          # cursor-reactive CTA + wordmark fill
│   ├── Chili.jsx           # draggable “PULL ME” → sizzle + confetti
│   └── ConfettiCanvas.jsx  # shared particle layer
├── lib/
│   ├── lenis.js            # smooth-scroll singleton + scrollToId()
│   ├── splitText.js        # char/word splitter (idempotent)
│   ├── confetti.js         # canvas particle burst
│   ├── sizzle.js           # Web Audio noise burst (no audio files)
│   ├── menuData.js         # menu items + text-file export
│   ├── galleryData.js      # bento tiles
│   ├── reviewData.js       # paraphrased guest quotes
│   └── site.js             # SITE_URL, phone, WhatsApp, map, address
├── scripts/qa.mjs          # headless browser QA (Playwright), 32 assertions
├── .env.example            # the two env vars this build reads
├── DEPLOYMENT.md           # pre-launch checklist + measured performance
├── next.config.mjs         # security headers, cache policy, dev origins
└── public/images/          # WebP + JPEG pairs (hero, dishes, interiors…)
```

### How React and GSAP stay out of each other’s way

- **One client component owns all imperative motion.** `ScrollFX.jsx` builds
  everything inside a `gsap.context()` and reverts it on unmount, so
  StrictMode’s double-mount (and HMR) can’t leave orphaned tweens or pins.
- **State-driven UI is React’s job:** nav/mobile menu, menu tabs, lightbox,
  reservation form, chili drag. No GSAP touching React-owned classes.
- **Server components stay static**, so GSAP can split their text without
  React re-rendering over the top of the injected `<span>`s.
- `splitText()` is idempotent (`data-split-done`) — calling it twice is a no-op.

---

## What’s on the page

1. **Preloader** — bird flies across, percentage counts up, curtain wipe.
2. **Hero** — “TASTE OF / THE NORTH / EAST”, parallax food backdrop, drifting
   momo / thukpa / pizza cutouts, glass rating chip, magnetic buttons.
3. **Story** — pinned: *“WE’RE HERE FOR THE EVERYDAY MOMENTS.”* fills
   character by character, then the photo and copy rise in.
4. **Signature dishes** — pinned horizontal carousel; the whole section’s
   background morphs to each dish’s colour as it takes focus.
5. **TO GATHER / TO SAVOR / TO CELEBRATE** — full-screen statements, outlined
   type + parallax imagery.
6. **Menu** — glass card, six tabs with a sliding pill, veg/non-veg dots,
   one-click “Download full menu”.
7. **Gallery** — 12-tile bento grid, hover zoom, keyboard-accessible lightbox.
8. **Reviews** — 4.1 ★ badge, two auto-scrolling rows of glass cards.
9. **Info strip** — hours, price, services, amenities.
10. **Reservation** — frosted form, inline validation, animated success
    (SVG tick + confetti), WhatsApp and call buttons.
11. **Location & contact** — embedded Google Map (real pin), address cards,
    “Get Directions”, and a full-width glass **contact form**: name, email,
    optional phone, topic, message, inline validation, honeypot and a
    tick-and-confetti success state. Falls back to the WhatsApp / call buttons
    for people who'd rather talk.
12. **Footer** — cursor-reactive headline, big **MISTWOOD** wordmark that fills
    as you reach the bottom, social icons.
13. **Playtime** — draggable chili that sizzles (synthesised) and throws confetti.

---

## Performance & accessibility

- Pages are **statically prerendered** — `/`, `/robots.txt`, `/sitemap.xml` and
  the 404 are all static, so hosting needs no server runtime.
- First-load JS ≈ 165 kB (GSAP + Lenis included); shared chunk 103 kB.
- Measured in Chromium at 4× CPU throttle, 1.6 Mbps / 150 ms RTT:
  **FCP 1.26 s · LCP 4.1 s · CLS 0.000 · 704 kB, 16 requests** on mobile;
  FCP 0.21 s · LCP 1.9 s on desktop. LCP is the hero headline landing after the
  intro; the intro is skipped for reduced motion, Save-Data, 2G/3G, and repeat
  visits in the same session.
- Fonts are self-hosted and preloaded by `next/font` (no external font requests).
- Images ship as **WebP with JPEG fallback** via `<picture>`, `loading="lazy"`
  below the fold, `fetchPriority="high"` on the hero.
- `prefers-reduced-motion` is respected everywhere: no Lenis, no pins, no
  preloader, no marquees — a clean static layout (verified in QA).
- Custom cursor only for fine pointers; touch gets native behaviour.
- Lightbox and mobile menu trap focus sensibly, close on `Esc`, and restore
  scroll position.
- Semantic landmarks, `aria-*` on tabs/dialog/form errors, skip link, visible
  focus rings.

## Form delivery

Both the reservation form and the contact form POST JSON to one endpoint:

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_CONTACT_ENDPOINT=https://formspree.io/f/xxxxxxx
```

| Form | Method | Payload |
|---|---|---|
| `#reserve` | `type: 'reservation'` | `name, phone, date, time, guests, notes, source` |
| `.contact-form` | `type: 'contact'` | `name, email, phone, topic, message, source` |

Without the endpoint both forms still validate, animate their success state and
show the phone number as a fallback — but nothing is delivered, so set it before
launch. A failed request shows an inline error naming the phone number instead of
pretending it worked. Works with Formspree, Getform, a Vercel/Netlify function,
or your own `app/api/contact/route.js`. The contact form also carries an
off-screen honeypot (`company`).

## Verified with a real browser

`scripts/qa.mjs` drives headless Chromium through the whole page:

```bash
npm run start          # in one terminal (or npm run dev)
npm run qa             # in another (needs: npx playwright install chromium)
```

Screenshots land in `SHOT_DIR` (default `./qa-shots`).

Last run: **32/32 checks passed, 0 console errors** — preloader reveal, character
split, both pinned sections, self-hosted fonts, menu tab switching, lightbox
open/next/close, reservation validation + success, contact form presence,
validation and success, chili drag confetti, cursor mount, zero horizontal
overflow on desktop and mobile, mobile overlay menu, the reduced-motion
fallback, and the 404 route (status code, body visibility, headline).

---

## Business data used

- **Address** — Plot 14, Misty Pine Ridge, Forest Hills, Shillong, Meghalaya 793003
- **Phone** — 098765 43210 (`tel:+919876543210`)
- **Hours** — open daily, 10 AM – 9 PM
- **Rating** — 4.1 ★ from 139 Google reviews
- **Price** — ₹200 – ₹1,200 per person
- **Map** — https://maps.google.com/?q=Shillong,+Meghalaya (25.5788, 91.8933)

Guest quotes in the reviews strip are paraphrased from public review themes;
menu items, prices and dish photos are representative placeholders — swap them
in `lib/menuData.js` and `public/images/`.

---

## Notes

- `.marquee` / `.reviews-track` loops are pure CSS animations, so they keep
  running even if GSAP fails to load.
- If JavaScript is disabled entirely, the page still renders (there is a
  reduced-motion / no-JS fallback for every hidden-by-default element).
- To deploy: see **DEPLOYMENT.md** for the pre-launch checklist, or in short —
  `npm run build` then host on Vercel, or add
  `output: 'export'` in `next.config.mjs` for a fully static bundle.
# Mistwood-
