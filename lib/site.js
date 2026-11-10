/**
 * Site-wide constants and brand identity.
 *
 * SITE_URL drives canonical URLs, Open Graph, sitemap and JSON-LD.
 * Centralized brand, location, and contact parameters ensure single-source configuration.
 */
export const SITE_NAME = 'Mistwood Restaurant';
export const SITE_WORDMARK = 'MISTWOOD';
export const SITE_TAGLINE = 'Taste of the Northeast, Served Like Home';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mistwood-restaurant.example.com').replace(
  /\/$/,
  ''
);

export const PHONE_DISPLAY = '098765 43210';
export const PHONE_TEL = '+919876543210';
export const WHATSAPP = 'https://wa.me/919876543210';
export const WHATSAPP_CONTACT = 'https://wa.me/919876543210?text=Hello%20Mistwood%20Restaurant';
export const WHATSAPP_RESERVE = 'https://wa.me/919876543210?text=Table%20request%20at%20Mistwood%20Restaurant';

export const MAP_LINK = 'https://maps.google.com/?q=Shillong,+Meghalaya';
export const MAP_EMBED = 'https://maps.google.com/maps?q=Shillong,+Meghalaya&t=&z=15&ie=UTF8&iwloc=&output=embed';

export const ADDRESS_SHORT = 'Upper Pine Ridge, Shillong';
export const ADDRESS_HEADING_LINE1 = 'UPPER PINE RIDGE,';
export const ADDRESS_HEADING_LINE2 = 'EAST KHASI HILLS';
export const ADDRESS_STREET = 'Plot 14, Misty Pine Ridge, Forest Hills';
export const ADDRESS_LOCALITY = 'Shillong';
export const ADDRESS_REGION = 'Meghalaya';
export const ADDRESS_POSTAL = '793003';
export const ADDRESS = `${ADDRESS_STREET}, ${ADDRESS_LOCALITY}, ${ADDRESS_REGION} ${ADDRESS_POSTAL}`;

export const GEO_LAT = 25.5788;
export const GEO_LNG = 91.8933;

export const OPENING_HOURS = '10 AM – 9 PM';
