/**
 * qa.mjs — headless QA for the Mistwood site.
 *
 * Loads the running site in Chromium, records console/page errors, walks
 * through every section capturing screenshots, and exercises the
 * interactive pieces (menu tabs, lightbox, reservation, mobile menu).
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = process.env.URL || 'http://127.0.0.1:3000/';
const OUT = process.env.SHOT_DIR || './qa-shots';
fs.mkdirSync(OUT, { recursive: true });

const problems = [];
const results = [];
const pass = (name, extra = '') => results.push(`  ✅ ${name}${extra ? ' — ' + extra : ''}`);
const fail = (name, extra = '') => {
  results.push(`  ❌ ${name}${extra ? ' — ' + extra : ''}`);
  problems.push(name);
};

const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });

/* ---------------------------------------------------------------- desktop */
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const consoleErrors = [];
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text());
});
page.on('pageerror', (e) => consoleErrors.push('PAGEERROR: ' + e.message));

await page.goto(URL, { waitUntil: 'networkidle', timeout: 45000 });

/* wait out the preloader (2.1s counter + 1.05s curtain) */
await page.waitForTimeout(4200);

const loaded = await page.evaluate(() => document.body.classList.contains('loaded'));
loaded ? pass('preloader revealed the page (body.loaded)') : fail('preloader never finished');

const splitCount = await page.evaluate(() => document.querySelectorAll('.hero-title .char').length);
splitCount >= 19 ? pass('hero headline split into chars', splitCount + ' chars') : fail('hero split', String(splitCount));

const pins = await page.evaluate(() => document.querySelectorAll('.pin-spacer').length);
pins >= 2 ? pass('pinned sections created', pins + ' pin-spacers') : fail('pins', String(pins));

const fontsOk = await page.evaluate(() => document.fonts.check('700 40px Anton') && document.fonts.check('400 16px Inter'));
fontsOk ? pass('self-hosted Anton + Inter loaded') : fail('fonts not loaded');

const data = await page.evaluate(() => ({
  geo: document.querySelector('script[type="application/ld+json"]')?.textContent.includes('25.5788'),
  map: !!document.querySelector('.location-map iframe'),
  directions: document.querySelector('a[href*="maps.google.com"]')?.href || null,
  hours10: document.body.innerText.includes('10 AM – 9 PM') || document.body.innerText.includes('10 AM — 9 PM'),
  reviews: document.querySelectorAll('.review-card').length,
  gallery: document.querySelectorAll('.tile').length,
}));
data.geo ? pass('JSON-LD has map coordinates') : fail('JSON-LD geo');
data.map ? pass('map iframe embedded') : fail('map iframe');
data.directions ? pass('Get Directions uses the Google Maps link', data.directions) : fail('directions link');
data.hours10 ? pass('opening hours say 10 AM') : fail('hours not updated');
data.reviews === 16 ? pass('testimonial row duplicated for the loop', data.reviews + ' cards') : fail('reviews', String(data.reviews));
data.gallery === 12 ? pass('gallery has 12 tiles (full bento rows)') : fail('gallery tiles', String(data.gallery));

const heroBox = await page.locator('.hero-title').boundingBox();
heroBox && heroBox.height > 150 ? pass('hero headline is oversized', Math.round(heroBox.height) + 'px tall') : fail('hero headline size');

await page.screenshot({ path: `${OUT}/01-hero.png` });

/* scroll through the page with real wheel events so Lenis runs */
const stops = [
  ['03-story', 1500],
  ['04-story-fill', 1400],
  ['05-dishes-a', 1200],
  ['06-dishes-b', 1100],
  ['07-toblocks', 2200],
  ['08-menu', 1400],
  ['09-gallery', 1400],
  ['10-reviews', 1200],
  ['11-info-reserve', 1400],
  ['12-location', 1200],
  ['13-footer', 1600],
];
for (const [name, dist] of stops) {
  await page.mouse.wheel(0, dist);
  await page.waitForTimeout(1100);
  await page.screenshot({ path: `${OUT}/${name}.png` });
}

/* dishes background colour should have changed away from the base green */
const dishesBg = await page.evaluate(() => {
  const el = document.querySelector('.dishes');
  return el ? getComputedStyle(el).backgroundColor : 'none';
});
dishesBg !== 'rgb(15, 42, 29)' ? pass('dish section colour shifted on scroll', dishesBg) : fail('dishes colour unchanged');

/* wordmark fill */
const wm = await page.evaluate(() => {
  const el = document.querySelector('.wordmark');
  return el ? getComputedStyle(el).backgroundSize : 'none';
});
pass('footer wordmark background-size', wm);

/* ------------------------------------------------------- interactions */
await page.evaluate(() => document.querySelector('#menu').scrollIntoView({ block: 'center' }));
await page.waitForTimeout(600);

await page.click('.menu-tab[data-tab="bbq"]');
await page.waitForTimeout(700);
const bbqActive = await page.evaluate(() => {
  const panel = document.querySelector('.menu-panel[data-panel="bbq"]');
  const pill = document.querySelector('.tab-pill');
  return {
    panel: panel?.classList.contains('active'),
    items: panel?.querySelectorAll('.menu-item').length,
    pillLeft: pill?.style.left,
  };
});
bbqActive.panel && bbqActive.items === 6
  ? pass('menu tab switch works', '6 BBQ items, pill at ' + bbqActive.pillLeft)
  : fail('menu tab switch', JSON.stringify(bbqActive));
await page.screenshot({ path: `${OUT}/14-menu-bbq.png` });

/* lightbox */
await page.evaluate(() => document.querySelector('#gallery').scrollIntoView({ block: 'center' }));
await page.waitForTimeout(500);
await page.locator('.tile').first().click();
await page.waitForTimeout(600);
const lbOpen = await page.evaluate(() => {
  const lb = document.querySelector('#lightbox');
  return {
    open: lb?.classList.contains('open'),
    aria: lb?.getAttribute('aria-hidden'),
    src: document.querySelector('#lb-img')?.getAttribute('src'),
    cap: document.querySelector('#lb-cap')?.textContent,
  };
});
lbOpen.open && lbOpen.aria === 'false' ? pass('lightbox opens', lbOpen.cap) : fail('lightbox open', JSON.stringify(lbOpen));
await page.screenshot({ path: `${OUT}/15-lightbox.png` });

await page.keyboard.press('ArrowRight');
await page.waitForTimeout(400);
const cap2 = await page.evaluate(() => document.querySelector('#lb-cap')?.textContent);
cap2 !== lbOpen.cap ? pass('lightbox next arrow advances', cap2) : fail('lightbox next');
await page.keyboard.press('Escape');
await page.waitForTimeout(500);
const lbClosed = await page.evaluate(() => !document.querySelector('#lightbox')?.classList.contains('open'));
lbClosed ? pass('lightbox closes on Escape') : fail('lightbox close');

/* reservation validation + success */
await page.evaluate(() => document.querySelector('#reserve').scrollIntoView({ block: 'center' }));
await page.waitForTimeout(500);
await page.click('#reserveForm button[type="submit"]');
await page.waitForTimeout(400);
const errShown = await page.evaluate(() => document.querySelectorAll('#reserveForm .field-error').length);
errShown === 5 ? pass('reservation blocks empty submit', errShown + ' fields flagged') : fail('reservation validation', String(errShown));

await page.fill('#reserveForm [name="name"]', 'Tana');
await page.fill('#reserveForm [name="phone"]', '+91 98765 43210');
const today = new Date().toISOString().split('T')[0];
await page.fill('#reserveForm [name="date"]', today);
await page.selectOption('#reserveForm [name="time"]', '7:30 PM');
await page.selectOption('#reserveForm [name="guests"]', '4');
await page.click('#reserveForm button[type="submit"]');
await page.waitForTimeout(900);
const success = await page.evaluate(() => {
  const form = document.querySelector('#reserveForm');
  return {
    cls: form?.classList.contains('is-success'),
    show: form?.querySelector('.reserve-success')?.classList.contains('show'),
    name: form?.querySelector('.rs-name')?.textContent,
  };
});
success.cls && success.show && success.name === 'Tana'
  ? pass('reservation success state', 'greets “Tana”')
  : fail('reservation success', JSON.stringify(success));
await page.screenshot({ path: `${OUT}/16-reserve-success.png` });

/* contact form (in the Contact section) */
await page.evaluate(() => document.querySelector('.contact-panel').scrollIntoView({ block: 'center' }));
await page.waitForTimeout(600);

const contactShape = await page.evaluate(() => ({
  inContactSection: !!document.querySelector('#location .contact-panel'),
  fields: ['name', 'email', 'phone', 'topic', 'message'].filter(
    (n) => document.querySelector(`.contact-form [name="${n}"]`)
  ).length,
  textarea: !!document.querySelector('.contact-form textarea'),
}));
contactShape.inContactSection && contactShape.fields === 5 && contactShape.textarea
  ? pass('contact form lives in the Contact section', '5 fields + textarea')
  : fail('contact form markup', JSON.stringify(contactShape));

await page.click('.contact-form button[type="submit"]');
await page.waitForTimeout(500);
const contactErrors = await page.evaluate(
  () => document.querySelectorAll('.contact-form .field-error').length
);
contactErrors === 3
  ? pass('contact form validates required fields', '3 flagged')
  : fail('contact validation', String(contactErrors));

await page.fill('.contact-form [name="name"]', 'Tana');
await page.fill('.contact-form [name="email"]', 'tana@example.com');
await page.fill('.contact-form [name="message"]', 'Table for 20 on Saturday?');
await page.click('.contact-form button[type="submit"]');
await page.waitForTimeout(1200);
const contactSent = await page.evaluate(() => {
  const form = document.querySelector('.contact-form');
  const success = form.querySelector('.contact-success');
  return {
    cls: form.classList.contains('is-success'),
    visible: getComputedStyle(success).display !== 'none',
    greeting: success.querySelector('h4 span')?.textContent,
  };
});
contactSent.cls && contactSent.visible && contactSent.greeting === 'Tana'
  ? pass('contact form success state', 'greets “Tana”')
  : fail('contact success', JSON.stringify(contactSent));
await page.screenshot({ path: `${OUT}/17-contact-success.png` });

/* chili drag */
const chili = await page.locator('#chili').boundingBox();
if (chili) {
  await page.mouse.move(chili.x + chili.width / 2, chili.y + chili.height / 2);
  await page.mouse.down();
  await page.mouse.move(chili.x + chili.width / 2 + 70, chili.y + chili.height / 2 + 40, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(700);
  const confetti = await page.evaluate(() => {
    const c = document.querySelector('#confetti');
    return c ? c.width > 0 : false;
  });
  confetti ? pass('chili drag fires confetti canvas') : fail('chili drag');
} else {
  fail('chili not found on screen');
}

/* cursor present */
const cursor = await page.evaluate(() => !!document.querySelector('.cursor-ring.has-text') || !!document.querySelector('.cursor-ring'));
cursor ? pass('custom cursor mounted') : fail('custom cursor missing');

/* horizontal overflow check */
const overflow = await page.evaluate(()  => document.documentElement.scrollWidth - document.documentElement.clientWidth);
overflow <= 2 ? pass('no horizontal overflow', overflow + 'px') : fail('horizontal overflow', overflow + 'px');

/* ----------------------------------------------------------------- mobile */
const mctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
});
const mpage = await mctx.newPage();
const mErrors = [];
mpage.on('pageerror', (e) => mErrors.push(e.message));
await mpage.goto(URL, { waitUntil: 'networkidle', timeout: 45000 });
await mpage.waitForTimeout(4200);
await mpage.screenshot({ path: `${OUT}/20-mobile-hero.png` });

const mOverflow = await mpage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
mOverflow <= 2 ? pass('mobile: no horizontal overflow') : fail('mobile overflow', mOverflow + 'px');

const burgerVisible = await mpage.locator('.nav-burger').isVisible();
burgerVisible ? pass('mobile: burger visible') : fail('mobile burger hidden');
await mpage.click('.nav-burger');
await mpage.waitForTimeout(800);
const menuOpen = await mpage.evaluate(() => document.querySelector('#mobileMenu')?.classList.contains('open'));
menuOpen ? pass('mobile: overlay menu opens') : fail('mobile menu');
await mpage.screenshot({ path: `${OUT}/21-mobile-menu.png` });

await mpage.click('.mobile-close');
await mpage.waitForTimeout(600);

for (const [name, dist] of [['22-mobile-menu-section', 2600], ['23-mobile-dishes', 2600], ['24-mobile-reserve', 4200]]) {
  await mpage.mouse.wheel(0, dist);
  await mpage.waitForTimeout(1100);
  await mpage.screenshot({ path: `${OUT}/${name}.png` });
}

/* ------------------------------------------------- reduced motion pass */
const rctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
});
const rpage = await rctx.newPage();
await rpage.goto(URL, { waitUntil: 'networkidle', timeout: 45000 });
await rpage.waitForTimeout(1500);
const rVisible = await rpage.evaluate(() => {
  const body = document.body;
  const cs = getComputedStyle(body);
  const pre = document.querySelector('#preloader');
  return {
    visibility: cs.visibility,
    preloaderHidden: !pre || getComputedStyle(pre).display === 'none',
    heroVisible: document.querySelector('.hero-title')?.getBoundingClientRect().height > 50,
  };
});
rVisible.visibility === 'visible' && rVisible.preloaderHidden && rVisible.heroVisible
  ? pass('reduced motion: page fully visible, no preloader')
  : fail('reduced motion', JSON.stringify(rVisible));
await rpage.screenshot({ path: `${OUT}/30-reduced-motion.png` });

/* ---------------------------------------------------------- 404 route */
const four = await ctx.newPage();
const res404 = await four.goto(URL.replace(/\/$/, '') + '/this-page-does-not-exist', { waitUntil: 'load' });
await four.waitForTimeout(1200);
const notFound = await four.evaluate(() => ({
  visible: getComputedStyle(document.body).visibility === 'visible',
  heading: (document.querySelector('.notfound-title')?.textContent || '').replace(/\s+/g, ' ').trim(),
}));
res404.status() === 404 ? pass('404 route returns HTTP 404', String(res404.status())) : fail('404 returned ' + res404.status());
notFound.visible ? pass('404 page is not blank') : fail('404 body hidden');
/THIS DISH/i.test(notFound.heading) ? pass('404 headline renders', notFound.heading) : fail('404 heading: ' + notFound.heading);
await four.close();

/* ------------------------------------------------------------- report */
console.log('\n──────── DESKTOP / MOBILE QA ────────');
results.forEach((r) => console.log(r));

const realErrors = consoleErrors.filter((e) => !/favicon|Download the React DevTools/i.test(e));
console.log('\n──────── CONSOLE ERRORS ────────');
console.log(realErrors.length ? realErrors.slice(0, 12).join('\n') : '  none');
console.log('\n──────── MOBILE PAGE ERRORS ────────');
console.log(mErrors.length ? mErrors.slice(0, 6).join('\n') : '  none');
console.log('\n──────── SUMMARY ────────');
console.log(`  ${results.length - problems.length}/${results.length} checks passed`);
if (problems.length) console.log('  failed: ' + problems.join(', '));

await browser.close();
