# Kathmandu Chilling — React Site

A React + Vite rebuild of `manish7.html`, same dark "cold-chain" visual identity
(the gauge widget, tilt product cards, frost particles, bilingual EN/नेपाली toggle),
now data-driven and with real WhatsApp integration wired in throughout.

## Run it

```bash
npm install
npm run dev       # local dev server, usually http://localhost:5173
npm run build     # production build -> dist/
npm run preview   # preview the production build locally
```

No other setup needed — there's no backend.

## What changed vs. the static HTML

- **Componentized**: header, hero, product cards, sectors, why-us, clients,
  contact form, footer are now separate React components in `src/components/`.
- **Data-driven products**: adding/editing/removing a product is a matter of
  editing the array in `src/data/content.js` — no need to hand-copy a whole
  card's markup anymore. Same for sectors, "why us" points, and clients.
- **WhatsApp integration** (see below) — replaces the old form that just did
  `alert(...)` and went nowhere.
- **Language toggle, scroll-reveal, draggable gauge, 3D tilt cards, frost
  canvas, marquee, sticky side-gauge, back-to-top** — all ported to React
  hooks, same behavior as before.

## WhatsApp integration

Set once in `src/data/content.js`:

```js
export const WHATSAPP_COUNTRY_CODE = '977';       // Nepal (+977)
export const WHATSAPP_LOCAL_NUMBER = '9844366008';
```

Everywhere someone can reach out, there's now a working WhatsApp path:

- A persistent green floating button, bottom-left, on every page.
- "Chat on WhatsApp" button in the hero.
- "WhatsApp Us" button in the CTA band.
- A small WhatsApp icon on every product card that pre-fills a message
  naming that specific product.
- The phone number in the Contact section is a tappable WhatsApp link.
- **The quote form itself**: submitting it no longer just shows an alert —
  it builds a message from the name/phone/email/product/details fields and
  opens WhatsApp (web or app) with that message pre-filled, ready to send.
  This means quote requests actually reach you with zero backend needed.

If you'd rather the form send an email instead of (or in addition to)
WhatsApp, that's a small change in `src/components/Contact.jsx` — happy to
wire up Formspree/EmailJS there too.

## Blog & SEO

- **Routes** (`react-router-dom` v6): `/` home, `/blog` article list, `/blog/:slug`
  individual posts. A `ScrollManager` restores scroll position on navigation
  (including hash-scrolls like `/#products`).
- **Content** lives in `src/data/blog.js` — each post is a plain object
  (`slug`, `title`, `date`, `image`, `excerpt`, `sections` with `paragraphs`
  and `list` blocks, plus `metaTitle`/`metaDescription` for SEO). The file
  auto-computes a reading-time estimate and exports helpers:
  `BLOG_POSTS`, `getPostBySlug`, `getLatestPosts`, `getRelatedPosts`,
  `formatDate`.
- **Per-page SEO** via `src/hooks/useSeo.js` — sets `<title>`, meta description,
  canonical URL, and injects JSON-LD (including `BlogPosting` schema on posts).
- **Social/SEO files** — Open Graph + Twitter cards in `index.html`;
  `public/robots.txt`, `public/sitemap.xml` and `public/_redirects`
  (Netlify SPA fallback) are also included. Add new articles to
  `sitemap.xml` by hand as you publish.
- Add a post by copying any object in `src/data/blog.js`'s `rawPosts` array —
  it appears on the list/preview pages automatically.

## Folder structure

```
src/
  data/content.js       ← all copy, product data, translations, WhatsApp config
  data/blog.js          ← blog posts + helpers
  hooks/useLang.jsx      ← EN/NE language context
  hooks/useReveal.js     ← scroll-reveal-on-view hook
  hooks/useSeo.js        ← per-page title/description/canonical + JSON-LD
  components/            ← one file per section
  components/blog/       ← BlogPreview, BlogList (index), BlogPost, NotFound
  App.jsx
  main.jsx
  index.css              ← the original dark "cold-chain" theme, ported as-is
```

## Before going live

- Swap in real analytics if you want traffic tracking.
- The product "View product" links point to `/product-detail?product=...`
  and category pages to `/refrigeration-equipment` etc. — those routes are
  still placeholders; only `/`, `/blog` and `/blog/:slug` are wired up.
- Confirm the WhatsApp country code above.
