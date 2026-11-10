/**
 * splitText — wrap every character of an element in a <span class="char">.
 *
 * Used for the hero headline and the pinned story headline. Child elements
 * (like <em>) are preserved by deep-cloning them before they are re-split.
 *
 * `words: true` additionally masks each word in an overflow-hidden .word
 * wrapper, which is what produces the "fill up from below" effect.
 *
 * Idempotent: elements that are already split are left alone, so React's
 * StrictMode double-mount (dev only) cannot split twice.
 */
export function splitText(el, opts = {}) {
  if (!el || el.dataset.splitDone === 'true') return el;

  const wrapWords = !!opts.words;
  const nodes = Array.from(el.childNodes);
  el.textContent = '';

  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = node.textContent.split(/\s+/).filter(Boolean);

      parts.forEach((part, i) => {
        if (wrapWords) {
          const word = document.createElement('span');
          word.className = 'word';
          Array.from(part).forEach((ch) => {
            const c = document.createElement('span');
            c.className = 'char';
            c.textContent = ch;
            word.appendChild(c);
          });
          el.appendChild(word);
        } else {
          /* plain character split — no masking wrapper */
          Array.from(part).forEach((ch) => {
            const c = document.createElement('span');
            c.className = 'char';
            c.textContent = ch;
            el.appendChild(c);
          });
        }

        if (i < parts.length - 1) el.appendChild(document.createTextNode(' '));
      });
    } else {
      /* deep clone so children (e.g. <em>) survive the re-split */
      const clone = node.cloneNode(true);
      splitText(clone, opts);
      el.appendChild(clone);
    }
  });

  el.dataset.splitDone = 'true';
  return el;
}
