/**
 * Menu data.
 *
 * One array drives the tabbed menu, the sliding pill and the
 * "Download full menu" text file — add a dish in one place only.
 *
 * veg: false → non-veg dot, true → veg dot
 */
import { SITE_NAME, ADDRESS, PHONE_DISPLAY, SITE_TAGLINE } from '@/lib/site';

export const MENU_TABS = [
  {
    key: 'starters',
    label: 'Starters',
    items: [
      { name: 'Crispy Chicken 65', price: 320, veg: false },
      { name: 'Chicken Chilli', price: 380, veg: false },
      { name: 'Chicken Wings (Fried)', price: 350, veg: false },
      { name: 'French Fries', price: 180, veg: true },
      { name: 'Garlic Bread with Cheese', price: 220, veg: true },
      { name: 'Crispy Veg Strips', price: 240, veg: true },
    ],
  },
  {
    key: 'momos',
    label: 'Momos & Noodles',
    items: [
      { name: 'Steamed Chicken Momo (8 pcs)', price: 300, veg: false },
      { name: 'Steamed Veg Momo (8 pcs)', price: 250, veg: true },
      { name: 'Pan-fried Momo (8 pcs)', price: 320, veg: false },
      { name: 'Thukpa — Chicken Noodle Soup', price: 320, veg: false },
      { name: 'Chicken Hakka Noodles', price: 280, veg: false },
      { name: 'Veg Hakka Noodles', price: 260, veg: true },
      { name: 'Extra Momo Sauce', price: 50, veg: true },
    ],
  },
  {
    key: 'mains',
    label: 'Main Course',
    items: [
      { name: 'Chicken Curry (Northeast Homestyle)', price: 450, veg: false },
      { name: 'Fish Tenga (Sour Fish Curry)', price: 480, veg: false },
      { name: 'Pork Bhapa (Steamed Pork)', price: 420, veg: false },
      { name: 'Mutton Curry', price: 550, veg: false },
      { name: 'Dal Baati Churma', price: 380, veg: true },
      { name: 'Dal & Rice', price: 180, veg: true },
      { name: 'Mixed Veg Curries', price: 280, veg: true },
    ],
  },
  {
    key: 'pizza',
    label: 'Pizza & Fast Food',
    items: [
      { name: 'Chicken Sausage Pizza', price: 480, veg: false },
      { name: 'Margherita', price: 420, veg: true },
      { name: 'Farm House', price: 520, veg: false },
      { name: 'Chicken Fried Rice', price: 320, veg: false },
      { name: 'Crispy Chicken Burger', price: 280, veg: false },
      { name: 'Peri Peri Chicken', price: 340, veg: false },
      { name: 'Veggie Wrap', price: 260, veg: true },
    ],
  },
  {
    key: 'bbq',
    label: 'BBQ',
    items: [
      { name: 'Barbeque Platter (Mixed Grill)', price: 750, veg: false },
      { name: 'Tandoori Chicken (Full Leg)', price: 480, veg: false },
      { name: 'Seekh Kebab (6 pcs)', price: 450, veg: false },
      { name: 'Grilled Fish Fillet', price: 580, veg: false },
      { name: 'BBQ Veg Platter', price: 620, veg: true },
      { name: 'Masala Papad', price: 80, veg: true },
    ],
  },
  {
    key: 'drinks',
    label: 'Drinks & Desserts',
    items: [
      { name: 'Vanilla Milkshake', price: 260, veg: false },
      { name: 'Fresh Fruit Juice', price: 180, veg: true },
      { name: 'Masala Lassi', price: 200, veg: true },
      { name: 'Filter Coffee', price: 150, veg: true },
      { name: 'Cold Coffee', price: 220, veg: true },
      { name: 'Chocolate Brownie with Ice Cream', price: 240, veg: true },
      { name: 'Ice Cream (Single Scoop)', price: 180, veg: true },
    ],
  },
];

/** Build the downloadable plain-text menu from the same data. */
export function buildMenuText() {
  const lines = [
    `${SITE_NAME.toUpperCase()} — FULL MENU`,
    `${ADDRESS} · ${PHONE_DISPLAY}`,
    'Open daily · 10 AM – 9 PM · ₹200–₹1,200 per person',
    '',
  ];

  MENU_TABS.forEach((tab) => {
    lines.push('—— ' + tab.label.toUpperCase() + ' ——');
    tab.items.forEach((item) => {
      lines.push('  ' + item.name + '  ·  ₹' + item.price);
    });
    lines.push('');
  });

  lines.push(`${SITE_TAGLINE}. © 2026 ${SITE_NAME}`);
  return lines.join('\n');
}
