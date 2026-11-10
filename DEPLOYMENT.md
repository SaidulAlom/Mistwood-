# Deployment — Mistwood Restaurant

Everything the build needs is in this folder. It is a **Next.js 15 App Router**
project that statically prerenders to plain HTML/CSS/JS — no database, no
server runtime, no third-party services required to go live.

```bash
npm install
npm run build      # 4 static routes
npm run start      # or: npx serve out (if you switch to output: 'export')
```

---

## 1. Before you point a domain at it

### a. Set the site URL (required)

`lib/site.js` reads `NEXT_PUBLIC_SITE_URL`, which drives the canonical tag, Open
Graph URLs, `robots.txt`, `sitemap.xml` and the JSON-LD `url`. Until it is set,
all of those reference the placeholder `https://mistwood-restaurant.example.com`.

```bash
NEXT_PUBLIC_SITE_URL=https://your-real-domain.com
```

Set it in the host's dashboard **before the first production build** — it is
inlined at build time, so changing it later requires a rebuild.

### b. Point the forms at an inbox (recommended)

Both the reservation form and the contact form POST JSON to
`NEXT_PUBLIC_CONTACT_ENDPOINT`. Without it the forms still validate and show
their success state, but **nothing is delivered** — the booking only exists in
the visitor's browser.

```bash
NEXT_PUBLIC_CONTACT_ENDPOINT=https://formspree.io/f/xxxxxxx
```

The payloads are already tagged, so one endpoint can serve both:

| Field     | Reservation                | Contact              |
|-----------|----------------------------|----------------------|
| `type`    | `"reservation"`            | `"contact"`          |
| details   | `name, phone, date, time, guests, notes` | `name, email, phone, topic, message` |
| `source`  | `"mistwood-website"`       | `"mistwood-website"` |

Options, in order of least effort:

1. **Formspree / Getform / Basin** — paste the form URL into the env var. Free
   tier covers a restaurant's volume. Fastest route.
2. **Own endpoint** — drop a route handler at `app/api/contact/route.js` and
   point the env var at `/api/contact`. Requires a host that runs Node
   functions (Vercel, Netlify, Cloudflare).
3. **Email API** — Resend / Postmark inside that route handler, sending to the
   restaurant's inbox.

Bots: the contact form carries an off-screen `company` honeypot, and the
provider's own spam filtering sits behind it.

### c. Replace the placeholder content

| Where | What it is now | What it needs |
|---|---|---|
| `lib/menuData.js` | Prices and dish descriptions marked representative | Verified prices |
| `public/images/*` | Royalty-free stock of the *style* of food | Real photos of the actual dishes and room |
| `lib/reviewData.js` | Paraphrased themes from Google reviews, names shortened | Owner's approval before publishing |
| `app/layout.jsx` | `aggregateRating` 4.1 / 139 reviews (real), postal code 791113 | Confirm the code matches the Maps listing |

The reviews block paraphrases public Google reviews rather than quoting them
verbatim, which keeps it defensible, but the owner should still sign off.

### d. Legal

The contact form collects a name, email and phone number. Indian DPDP Act
expectations, and general good practice, mean the page should link a short
privacy note saying what is collected and that it is used only to reply. There
is no privacy page yet — add one, or add two lines under the form.

---

## 2. Hosting

**Vercel** — push the folder to a Git repo, import it, add the two environment
variables, deploy. Zero config; the recommended path.

**Netlify** — install `@netlify/plugin-nextjs`, same two variables.

**Any static host** (Cloudflare Pages, S3, nginx, GitHub Pages) — add
`output: 'export'` to `next.config.mjs`, run `npm run build`, upload `out/`.
Everything already prerenders, so nothing is lost. Only caveat: the
`headers()` block in `next.config.mjs` is a Next server feature, so on a pure
static host set those three headers in the host's config instead
(`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy: camera=(), microphone=(), geolocation=()`).

No `X-Frame-Options` / `frame-ancestors` is set on purpose — nothing on the site
needs to refuse framing, and the preview environment embeds it.

---

## 3. After the domain resolves

- [ ] `https://domain.com/robots.txt` and `/sitemap.xml` show the real domain
- [ ] Submit the sitemap in Google Search Console; request indexing
- [ ] Run the Rich Results test on `/` — expect Restaurant + LocalBusiness
- [ ] Paste `/` into the Facebook and WhatsApp debuggers to refresh the OG card
- [ ] Check the Google Business Profile: add the website URL, and the hours
      (10:00–21:00 daily) so they match the site exactly
- [ ] Submit a real booking and a real message, confirm both land in the inbox
- [ ] Lighthouse → mobile → Performance / Accessibility / Best-practices / SEO
- [ ] Open on an actual phone on mobile data, not just desktop devtools

Measured on this build (Chromium, 4× CPU throttle, 1.6 Mbps / 150 ms RTT):

| Metric | Mobile | Desktop |
|---|---|---|
| First Contentful Paint | 1.26 s | 0.21 s |
| Largest Contentful Paint | 4.1 s | 1.9 s |
| Cumulative Layout Shift | 0.000 | 0.001 |
| Transferred (first view) | 704 KB | 2.4 MB |
| Requests | 16 | 25 |

The LCP is the hero headline, which deliberately lands after the ~1.2 s intro.
The intro is skipped entirely for `prefers-reduced-motion`, for Save-Data
visitors, on 2G/3G connections, and on repeat visits within the same session —
so most repeat visitors see the hero almost immediately. If a hard 90+ on
throttled mobile matters more than the intro, shorten the counter in
`components/ScrollFX.jsx` (`duration: 0.95`) to ~0.4 s.

---

## 4. Verification harness

```bash
npx next start -H 0.0.0.0 -p 3000 &     # must be running first
SHOT_DIR=/tmp/qashots node scripts/qa.mjs
```

29 assertions against the live build: preloader, hero split text, pinned
sections, self-hosted fonts, JSON-LD geo, map embed, hours, review counts,
gallery + lightbox, menu tabs, both forms' validation and success states,
confetti, custom cursor, zero horizontal overflow at desktop and 390 px,
mobile menu, and the reduced-motion fallback. Screenshots land in `SHOT_DIR`.
