# 💍 Rene & Ramona Wedding Website

Production-ready Next.js wedding website for Rene & Ramona — 12 June 2027 · Phoenix Cernica, Romania.

---

## Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| GSAP + ScrollTrigger | Animations |
| Framer Motion | Micro-interactions |
| react-hook-form | RSVP form |
| Google Apps Script | RSVP data storage |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local

# 3. Run locally
npm run dev
# → http://localhost:3000
```

---

## Adding Drone Videos

The two drone videos are too large to sync automatically. Copy them manually:

```
Pictures at Cernica Strada/20260614_135206000_iOS.MP4  →  public/videos/drone.mp4
Pictures at Cernica Strada/20260614_135828000_iOS.MP4  →  public/videos/drone2.mp4
```

The hero section will automatically display the video once `public/videos/drone.mp4` exists.

---

## Project Structure

```
rene-ramona-wedding/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # All sections assembled
│   └── globals.css         # Global styles & Tailwind
├── components/
│   ├── Navigation.tsx      # Sticky nav + language switcher
│   ├── Hero.tsx            # Parallax hero + countdown timer
│   ├── Welcome.tsx         # Venue details + Google Maps
│   ├── Program.tsx         # Animated timeline
│   ├── RSVP.tsx            # Full form → Google Sheets
│   ├── Accommodation.tsx   # 10 hotel cards
│   ├── HoneymoonFund.tsx   # Donation + wish generator
│   ├── Contact.tsx         # Contact info
│   └── Footer.tsx
├── context/
│   └── LanguageContext.tsx # EN / RO / SK switcher
├── lib/
│   └── accommodations.ts   # Hotel JSON data
├── locales/
│   ├── en.json
│   ├── ro.json
│   └── sk.json
├── public/
│   ├── images/             # hero.jpg + gallery photos
│   └── videos/             # drone.mp4 (add manually)
└── types/
    └── gsap.d.ts
```

---

## Multi-language

Three languages are supported: English (default), Romanian, Slovak.  
The language switcher is always visible in the navigation bar.  
All strings live in `locales/{en,ro,sk}.json` — easy to update.

---

## RSVP → Google Sheets

RSVP submissions are sent via `fetch` (no-cors) to the Google Apps Script endpoint:

```
https://script.google.com/macros/s/AKfycbw6_3RvsV9S772KSp4IYsI0tlRpeRJvaqzUevo2AyxWdBR7_kgjqAjdqrys506-MDh3xQ/exec
```

Each submission sends: firstName, lastName, email, phone, attendance, dietary, message, GDPR consent, timestamp.  
A honeypot field silently rejects bot submissions.

---

## Deploy to Vercel

### One-click deploy

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo
3. Vercel detects Next.js automatically — click **Deploy**

### Environment variables (optional)

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_RSVP_ENDPOINT` | Your Google Apps Script URL |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel URL e.g. `https://rene-ramona-wedding.vercel.app` |

### Custom domain

In Vercel → Project → Settings → Domains, add your custom domain (e.g. `reneandramona.com`).

---

## SEO & Accessibility

- Semantic HTML5 (`<nav>`, `<main>`, `<section>`, `<article>`, `<address>`, `<footer>`)
- ARIA labels on all interactive elements
- Keyboard-navigable (focus-visible rings)
- `prefers-reduced-motion` respected in CSS
- WCAG AA colour contrast throughout
- `robots: noindex` set (private wedding site — remove in `app/layout.tsx` if you want public indexing)

---

## Customisation Checklist

- [ ] Add drone videos to `public/videos/drone.mp4`
- [ ] Replace accommodation images/links with preferred options in `lib/accommodations.ts`
- [ ] Add a `public/favicon.ico`
- [ ] Update `NEXT_PUBLIC_SITE_URL` in `.env.local` after Vercel deploy
- [ ] Test RSVP form end-to-end before sending invitations
