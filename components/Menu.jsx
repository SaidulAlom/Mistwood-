'use client';

/* ============================================================
   Menu — frosted-glass card, tabbed panels with a sliding
   orange pill, veg / non-veg dots, downloadable full menu.
   ============================================================ */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MENU_TABS, buildMenuText } from '@/lib/menuData';

export default function Menu() {
  const [activeKey, setActiveKey] = useState(MENU_TABS[0].key);
  const [pill, setPill] = useState({ left: 6, top: 6, width: 0, height: 34 });

  const tabsRef = useRef(null);
  const tabRefs = useRef({});

  /* measure the active tab and slide the pill underneath it */
  const movePill = useCallback(() => {
    const wrap = tabsRef.current;
    const tab = tabRefs.current[activeKey];
    if (!wrap || !tab) return;

    setPill({
      left: tab.offsetLeft,
      top: tab.offsetTop,
      width: tab.offsetWidth,
      height: tab.offsetHeight,
    });
  }, [activeKey]);

  useLayoutEffect(() => {
    movePill();

    /* fonts change the tab widths — re-measure once they land */
    if (document.fonts?.ready) document.fonts.ready.then(movePill);

    const onResize = () => movePill();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [movePill]);

  /* ScrollTrigger caches section heights — refresh once images settle */
  useEffect(() => {
    const id = setTimeout(() => window.dispatchEvent(new Event('mistwood:layout')), 60);
    return () => clearTimeout(id);
  }, [activeKey]);

  const download = () => {
    const blob = new Blob([buildMenuText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mistwood-menu.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const activeTab = MENU_TABS.find((t) => t.key === activeKey) || MENU_TABS[0];

  return (
    <section className="menu" id="menu">
      <div className="menu-head">
        <p className="kicker kicker-light" data-reveal="up">
          The menu
        </p>
        <h2 className="menu-title" data-reveal="up">
          EVERYTHING THAT <em>FEELS HOME</em>
        </h2>
        <p className="menu-note" data-reveal="up">
          ₹200 – ₹1,200 per person · prices inclusive of taxes
        </p>
      </div>

      <div className="menu-glass glass" data-reveal="up">
        <button
          className="menu-download magnetic"
          id="downloadMenu"
          data-cursor="eat"
          onClick={download}
        >
          <span>
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              aria-hidden="true"
              style={{ marginRight: '8px', verticalAlign: '-2px' }}
            >
              <path
                d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Download full menu
          </span>
        </button>

        <div className="menu-tabs" role="tablist" ref={tabsRef}>
          <span
            className="tab-pill"
            aria-hidden="true"
            style={{
              left: pill.left,
              top: pill.top,
              width: pill.width,
              height: pill.height,
              transition: 'left .5s cubic-bezier(.22,1,.36,1), top .5s cubic-bezier(.22,1,.36,1), width .5s cubic-bezier(.22,1,.36,1), height .5s cubic-bezier(.22,1,.36,1)',
            }}
          />
          {MENU_TABS.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              ref={(el) => {
                tabRefs.current[tab.key] = el;
              }}
              className={'menu-tab' + (tab.key === activeKey ? ' active' : '')}
              data-tab={tab.key}
              aria-selected={tab.key === activeKey}
              onClick={() => setActiveKey(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <p className="menu-legend">
          <i className="dot dot-v"></i> Veg &nbsp;&nbsp; <i className="dot dot-nv"></i> Non-veg
          &nbsp;&nbsp;
          <i
            className="dot dot-nv"
            style={{ background: '#D7332B', boxShadow: '0 0 0 3px rgba(215,51,43,.18)' }}
          ></i>{' '}
          Signature
        </p>

        {MENU_TABS.map((tab) => (
          <div
            key={tab.key}
            className={'menu-panel' + (tab.key === activeKey ? ' active' : '')}
            role="tabpanel"
            data-panel={tab.key}
            aria-hidden={tab.key !== activeKey}
          >
            {tab.items.map((item) => (
              <div className="menu-item" key={item.name}>
                <i className={'dot ' + (item.veg ? 'dot-v' : 'dot-nv')}></i>
                <span className="mi-name">{item.name}</span>
                <span className="mi-dots"></span>
                <span className="mi-price">₹{item.price}</span>
              </div>
            ))}
          </div>
        ))}

        <p className="menu-foot handwritten" aria-live="polite">
          {activeTab.items.length} things on this page · ask us what's fresh today
        </p>
      </div>
    </section>
  );
}
