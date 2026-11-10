import { Anton, Inter, Caveat } from 'next/font/google';
import {
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  MAP_LINK,
  ADDRESS_STREET,
  ADDRESS_LOCALITY,
  ADDRESS_REGION,
  ADDRESS_POSTAL,
  PHONE_TEL,
  GEO_LAT,
  GEO_LNG,
} from '@/lib/site';
import './globals.css';

/* ------------------------------------------------------------
   Fonts — self-hosted by next/font (no external requests, no CLS).
   The CSS variables are consumed by app/globals.css.
   ------------------------------------------------------------ */
const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-caveat',
  display: 'swap',
});

/* ------------------------------------------------------------
   SEO — title, description, Open Graph / Twitter, canonical
   ------------------------------------------------------------ */
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE} — Shillong`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    `${SITE_NAME} in Shillong, Meghalaya — steaming momos, soulful thukpa, wood-fired pizzas, barbeque nights and warm Northeast hospitality. Open daily until 9 PM.`,
  keywords: [
    'restaurant Shillong',
    'momos Shillong',
    'thukpa',
    'Northeast food',
    'barbeque',
    'pizza Shillong',
    'Meghalaya restaurant',
    SITE_NAME,
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      `Steaming momos, soulful thukpa, barbeque nights and warm Northeast hospitality in the heart of Shillong. Open daily until 9 PM.`,
    images: [
      {
        url: '/images/hero.jpg',
        width: 1536,
        height: 1024,
        alt: `Steaming momos at ${SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      `Momos, thukpa, barbeque nights and warm hospitality — Shillong, Meghalaya.`,
    images: ['/images/hero.jpg'],
  },
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230F2A1D'/%3E%3Cpath d='M20 34c0-10 10-12 14-5 3 5-3 7-6 9l14 16c8 4 6-13-12-17-10-2-11-7-1-10z' fill='%23F28C28'/%3E%3Ccircle cx='36' cy='29' r='3' fill='%23F6EEDC'/%3E%3Cpath d='M20 34c0 8-8 9-9 0-1-4 2-6 4-8z' fill='%23D7332B'/%3E%3C/svg%3E",
        type: 'image/svg+xml',
      },
    ],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F2A1D',
  colorScheme: 'dark',
};

/* ------------------------------------------------------------
   Restaurant structured data (schema.org)
   ------------------------------------------------------------ */
const restaurantSchema = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: SITE_NAME,
  description:
    'Homestyle Northeast Indian kitchen in Shillong — momos, thukpa, wood-fired pizza, barbeque and filter coffee. Warm hospitality, everyday moments, served like home.',
  servesCuisine: ['Northeast Indian', 'Indian', 'Indo-Chinese', 'Pizza', 'Fast Food'],
  priceRange: '₹200–₹1,200',
  telephone: PHONE_TEL,
  image: `${SITE_URL}/images/hero.jpg`,
  url: SITE_URL,
  address: {
    '@type': 'PostalAddress',
    streetAddress: ADDRESS_STREET,
    addressLocality: ADDRESS_LOCALITY,
    addressRegion: ADDRESS_REGION,
    postalCode: ADDRESS_POSTAL,
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: GEO_LAT, longitude: GEO_LNG },
  hasMap: MAP_LINK,
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.1',
    reviewCount: '139',
    bestRating: '5',
    worstRating: '1',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '10:00',
      closes: '21:00',
    },
  ],
  acceptsReservations: 'True',
  menu: `${SITE_URL}/#menu`,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`js ${anton.variable} ${inter.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
      </body>
    </html>
  );
}
