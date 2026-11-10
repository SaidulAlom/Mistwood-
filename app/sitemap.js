import { SITE_URL } from '@/lib/site';

/* /sitemap.xml — one page, one entry (it's a single-page site) */
export default function sitemap() {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
