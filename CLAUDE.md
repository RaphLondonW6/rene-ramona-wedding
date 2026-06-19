# CLAUDE.md — René & Ramona Wedding Website

Project context for AI assistants. Read this before making any changes.

---

## Project Overview

Wedding website for René & Ramona. Wedding date: **12 June 2027**, venue: **Phoenix Cernica, Pantelimon, Romania**. Live at **https://www.ramonapicksrene.com**.

Three languages: English (default), Romanian, Slovak.

---

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** for the main site
- **Cloudflare Workers** for deployment (via `@cloudflare/next-on-pages`)
- **Google Apps Script** as RSVP backend (no database)

---

## Deployment

The site is deployed to **Cloudflare Workers** (not Vercel). CI/CD is automatic from GitHub — every push to `main` triggers a Cloudflare Pages build.

**Build command (set in Cloudflare Pages dashboard):**
```
npx @cloudflare/next-on-pages@1 && cp -r public/. .vercel/output/static/ && touch .vercel/output/static/.assetsignore
```

The `cp -r public/. .vercel/output/static/` step is critical — it explicitly copies static files (including `Wedding_Invitations/` and `Wedding_Menus/`) into the Cloudflare assets directory. Without it, standalone HTML pages in `public/` subdirectories return 404.

**wrangler.toml:**
```toml
name = "rene-ramona-wedding"
main = ".vercel/output/static/_worker.js/index.js"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = ".vercel/output/static"
binding = "ASSETS"
```

**To deploy manually:**
```bash
git add -A
git commit -m "your message"
git push
```

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
│   ├── Accommodation.tsx   # Hotel cards
│   ├── HoneymoonFund.tsx   # Donation + wish generator
│   ├── Contact.tsx         # Contact info
│   └── Footer.tsx
├── context/
│   └── LanguageContext.tsx # EN / RO / SK switcher
├── locales/
│   ├── en.json             # All UI strings in English
│   ├── ro.json             # Romanian
│   └── sk.json             # Slovak
├── lib/
│   └── accommodations.ts   # Hotel data
├── public/
│   ├── images/             # hero.jpg + gallery photos
│   ├── videos/             # drone.mp4 (not in git — add manually)
│   ├── Wedding_Invitations/
│   │   ├── Invite.html     # Standalone digital invitation (EN/RO/SK, QR code, PDF export)
│   │   └── Gemini_Generated_Image_u6ogjtu6ogjtu6og.png  # Gold floral background (NOT in git)
│   └── Wedding_Menus/
│       └── Menu.html       # Standalone wedding menu (EN/RO/SK, PDF export)
├── types/
│   └── gsap.d.ts
├── wrangler.toml           # Cloudflare Workers config
└── next.config.js          # images.unoptimized: true (required for Cloudflare)
```

---

## Static Standalone Pages

`public/Wedding_Invitations/Invite.html` and `public/Wedding_Menus/Menu.html` are **self-contained HTML pages** — not Next.js routes. They are served directly as static files.

Key design details:
- Background: `Gemini_Generated_Image_u6ogjtu6ogjtu6og.png` (gold toile floral, ~2.4MB). **This file is not in git** — it must be manually placed in `public/Wedding_Invitations/`. Menu.html references it via `../Wedding_Invitations/Gemini_Generated_Image_u6ogjtu6ogjtu6og.png`.
- Fonts: Great Vibes, Cormorant Garamond, Cinzel (Google Fonts)
- Language toggle: EN / RO / SK via `setLang()` JS function swapping `data-key` elements
- PDF export: uses `window.print()`. Requires `print-color-adjust: exact` to preserve background images.
- QR code: rendered via `<img src="https://api.qrserver.com/v1/create-qr-code/...">` (not canvas)

CSS z-index stacking on `.card-outer`:
- `::after` cream wash overlay → z-index 1
- `.card-inner` content → z-index 2
- `::before` gold border inset → z-index 4

To add a new standalone page, place it in `public/` — it will be served at the matching URL path after the next Cloudflare build.

---

## Multi-language

All UI strings live in `locales/{en,ro,sk}.json`. The `LanguageContext` provides a `t` object throughout the Next.js app.

For standalone HTML pages (`Invite.html`, `Menu.html`), translations are handled inline via a JS `i18n` object and a `setLang(lang)` function that swaps `data-key` attributes.

---

## RSVP → Google Sheets

Submissions are POSTed (no-cors) to a Google Apps Script endpoint hardcoded in `components/RSVP.tsx`:

```
https://script.google.com/macros/s/AKfycbyF7hfTXoQHWHwwq13syhCktAicjsTlokS1i7dJU7Kxhfc3nAZGm0Ab3YUYnKKUztREQw/exec
```

Fields sent: `firstName`, `lastName`, `email`, `phone`, `attendance`, `dietary`, `dietaryOther`, `message`, `gdpr`, `submittedAt`. A honeypot field (`_hp`) silently blocks bots.

---

## Known Gotchas

- **Static files must be in `public/`** — Next.js only serves static assets from this directory, not from the project root.
- **`cp -r public/` in the build command is required** — `@cloudflare/next-on-pages` does not reliably copy all `public/` subdirectories to the assets output. The explicit `cp` in the build command is the fix.
- **Background image not in git** — `Gemini_Generated_Image_u6ogjtu6ogjtu6og.png` is too large and was never committed. It must be present on disk for the floral background to render.
- **`next.config.js` requires `images.unoptimized: true`** — Cloudflare Workers does not support Next.js image optimisation.
- **Git lock conflicts** — OneDrive sync can create `.git/index.lock`. If `git` commands fail with a lock error, run `del .git\index.lock` (Windows) before retrying.
- **`git add -A` preferred over `git add <path>`** — handles both deletions and additions in one command, avoiding partial commits when moving files.
