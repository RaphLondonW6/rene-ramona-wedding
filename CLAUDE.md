# CLAUDE.md — René & Ramona Wedding Website

Project context for AI assistants. Read this before making any changes.

---

## Project Overview

Wedding website for René & Ramona. Wedding date: **12 June 2027**, venue: **Phoenix Cernica – By The Pool, Pantelimon, Romania**. Ceremony at **17:30**, evening party from **22:00**. Live at **https://www.ramonapicksrene.com**.

Three languages: English (default), Romanian, Slovak.

---

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** for the main site
- **Cloudflare Workers** for deployment (via `@cloudflare/next-on-pages`)
- **Google Apps Script** as RSVP backend (no database)

---

## Deployment

The site is deployed to **Cloudflare Workers** (not Vercel). CI/CD is automatic from GitHub — every push to `main` triggers a Cloudflare build.

**How the build works:**
Cloudflare runs `npm run build` (from `package.json`). The build script is set to:
```
npx @cloudflare/next-on-pages@1 && (cp -r public/. .vercel/output/static/ 2>/dev/null || true) && touch .vercel/output/static/.assetsignore
```

The `|| true` on the `cp` step is intentional — `@cloudflare/next-on-pages` already copies `public/` during the Vercel build, so re-copying produces "same file" errors. The `|| true` makes those non-fatal while still ensuring static files are present.

**Cloudflare dashboard deploy command:** `npx wrangler deploy`

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

**To deploy:**
```bash
git add -A
git commit -m "your message"
git push
```

**Videos are in `.gitignore` — force-add them:**
```bash
git add -f public/videos/main.mp4
git add -f public/videos/parking.mp4
```

**To trigger a build without code changes:**
```bash
git commit --allow-empty -m "Trigger rebuild" && git push
```

**If Cloudflare shows "error fetching repository":**
Go to Settings → Builds & Deployments → Git repository → Disconnect → reconnect the GitHub repo, then retry.

---

## Color Palette

| Purpose | Color |
|---|---|
| Primary background | `#E1BF92` |
| Secondary background | `#DFE0E1` |
| Accent / light text | `#A8A6A1` |
| Primary text | `#38383B` |
| Dark elements / buttons | `#000000` |

All section component backgrounds use `linear-gradient(180deg, #E1BF92 0%, #DFE0E1 50%, #E1BF92 100%)` so they blend seamlessly with the wave-shaped section image/video dividers.

---

## Project Structure

```
rene-ramona-wedding/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # All sections + SectionImage/SectionVideo dividers assembled
│   └── globals.css         # Global styles, CSS variables & Tailwind
├── components/
│   ├── Navigation.tsx      # Sticky nav + language switcher (8 sections)
│   ├── Hero.tsx            # Video hero + parallax + countdown + bottom wave (no tagline)
│   ├── Welcome.tsx         # Intro text + venue details + Google Maps
│   ├── Program.tsx         # Animated timeline
│   ├── RSVP.tsx            # Attendance form only → Google Sheets (meal selection removed)
│   ├── Menu.tsx            # Standalone menu section (Starters, Mains, Dessert, Drinks, Kids)
│   ├── Accommodation.tsx   # Hotel cards
│   ├── HoneymoonFund.tsx   # Donation + wish generator
│   ├── Parking.tsx         # Parking guide with 3 step images (stacked)
│   ├── Contact.tsx         # Contact info
│   ├── Footer.tsx
│   ├── SectionImage.tsx    # Full-width image with wave edges + scroll fade-in
│   └── SectionVideo.tsx    # Full-width video with wave edges + scroll fade-in
├── context/
│   └── LanguageContext.tsx # EN / RO / SK switcher
├── locales/
│   ├── en.json             # All UI strings in English
│   ├── ro.json             # Romanian
│   └── sk.json             # Slovak
├── lib/
│   └── accommodations.ts   # Hotel data
├── public/
│   ├── images/
│   │   ├── sections/       # 6 full-width section divider images
│   │   │   ├── ceremony-program.jpg
│   │   │   ├── confirm-presence.jpg
│   │   │   ├── contact.jpg
│   │   │   ├── honeymoon-fund.jpg
│   │   │   ├── hotels-accommodation.jpg
│   │   │   └── menu.jpg                # Section break before Menu (from 20260614_134454000_iOS.jpg)
│   │   ├── food/           # Meal selection photos (shown in Menu section)
│   │   │   ├── canapes.jpg
│   │   │   ├── fish-course.jpg
│   │   │   ├── main-course.jpg
│   │   │   └── traditional-course.jpg
│   │   └── parking/        # Step-by-step parking direction photos
│   │       ├── step1.jpg
│   │       ├── step2.jpg
│   │       └── step3.jpg
│   ├── videos/
│   │   ├── main.mp4        # Hero background video (8.6MB compressed, in git via -f)
│   │   └── parking.mp4     # Parking section breaker video (1.2MB compressed, in git via -f)
│   ├── Wedding_Invitations/
│   │   ├── Invite.html     # Standalone digital invitation (EN/RO/SK, QR code, PDF export)
│   │   └── Gemini_Generated_Image_u6ogjtu6ogjtu6og.png  # Gold floral background (NOT in git — copy manually)
│   └── Wedding_Menus/
│       └── Menu.html       # Standalone wedding menu (EN/RO/SK, PDF export)
├── types/
│   └── gsap.d.ts
├── package.json            # build script runs @cloudflare/next-on-pages
├── wrangler.toml           # Cloudflare Workers config
└── next.config.js          # images.unoptimized: true (required for Cloudflare)
```

---

## Section Layout (page.tsx)

```
Hero (video, no tagline)
↓ wave
Welcome (intro italic + body)
↓ SectionImage: ceremony-program.jpg
Program (subtitle: white)
↓ SectionImage: confirm-presence.jpg
RSVP (subtitle: white; success message: white, includes confirmation email note)
↓ SectionImage: menu.jpg
Menu (Starters, Mains, Dessert, Drinks, Kids)
↓ SectionImage: hotels-accommodation.jpg
Accommodation (subtitle: white)
↓ SectionImage: honeymoon-fund.jpg
HoneymoonFund
↓ SectionVideo: parking.mp4
Parking
↓ SectionImage: contact.jpg
Contact
Footer
```

`SectionImage` and `SectionVideo` are client components with:
- SVG wave top and bottom (filled `#E1BF92`)
- IntersectionObserver scroll fade-in (opacity 0→1, translateY 40px→0)

The hero also has a bottom wave SVG built directly into `Hero.tsx`.

---

## RSVP Form Fields

Fields submitted to Google Sheets: `firstName`, `lastName`, `email`, `phone`, `attendance`, `homeAddress`, `nationality`, `dietary`, `dietaryOther`, `message`, `gdpr`, `submittedAt`. A honeypot field (`_hp`) silently blocks bots.

`homeAddress` and `nationality` are optional fields added to capture postal address (for sending a physical invite) and nationality.

The Meal Selection has been moved to the standalone **Menu** section (`components/Menu.tsx`). RSVP only contains attendance, personal details, dietary requirements, optional message, and GDPR consent.

---

## RSVP → Google Sheets

Submissions are POSTed (no-cors) to a Google Apps Script endpoint hardcoded in `components/RSVP.tsx`:

```
https://script.google.com/macros/s/AKfycbzdSVxdUYVb0rrlSIQhARb_PnyqcqVGn1xn5zQgl5VF7pP4wmW82WOJbzc24MVSwR1Lpw/exec
```

**Important:** When redeploying the Apps Script, use **Manage deployments → update existing deployment** to keep the URL stable. Creating a new deployment generates a new URL which requires updating `RSVP_ENDPOINT` in `RSVP.tsx`.

---

## Wedding Invitation (Invite.html)

Text updated to:
> Together with their families / Ramona & René / invite you to celebrate their marriage / Saturday 12 June 2027 / At half past five in the afternoon / Phoenix Cernica – By The Pool / Pantelimon, Romania

All three language versions (EN/RO/SK) updated in the inline `i18n` JS object.

---

## Static Standalone Pages

`public/Wedding_Invitations/Invite.html` and `public/Wedding_Menus/Menu.html` are **self-contained HTML pages** — not Next.js routes. They are served directly as static files.

Key design details:
- Background: `Gemini_Generated_Image_u6ogjtu6ogjtu6og.png` (gold toile floral, ~2.4MB). **This file is not in git** — copy manually to `public/Wedding_Invitations/`. Menu.html references it via `../Wedding_Invitations/Gemini_Generated_Image_u6ogjtu6ogjtu6og.png`.
- Fonts: Great Vibes, Cormorant Garamond, Cinzel (Google Fonts)
- Language toggle: EN / RO / SK via `setLang()` JS function swapping `data-key` elements
- PDF export: uses `window.print()`. Requires `print-color-adjust: exact` to preserve background images.
- QR code: rendered via `<img src="https://api.qrserver.com/v1/create-qr-code/...">` (not canvas)

CSS z-index stacking on `.card-outer`:
- `::after` cream wash overlay → z-index 1
- `.card-inner` content → z-index 2
- `::before` gold border inset → z-index 4

---

## Multi-language

All UI strings live in `locales/{en,ro,sk}.json`. The `LanguageContext` provides a `t` object throughout the Next.js app.

Locale files contain: `nav`, `hero`, `welcome`, `program`, `rsvp`, `accommodation`, `honeymoon`, `parking`, `contact`, `footer`.

The `parking` key holds: `title`, `subtitle`, `body`, `step1`, `step2`, `step3`.

For standalone HTML pages (`Invite.html`, `Menu.html`), translations are handled inline via a JS `i18n` object and a `setLang(lang)` function that swaps `data-key` attributes.

---

## Video Compression

Both videos were compressed with FFmpeg before committing (Cloudflare has a 25MB per-asset limit):

```bash
# Hero video: 30MB → 8.6MB
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -crf 28 -preset slow -an -movflags +faststart main.mp4

# Parking video: 45MB → 1.2MB
ffmpeg -i input.MP4 -vf scale=1280:720 -c:v libx264 -crf 26 -preset slow -an -movflags +faststart parking.mp4
```

`-an` strips audio (all videos are muted on the site). Adjust `-crf` (18–32) to trade quality vs file size.

---

## Known Gotchas

- **Build script in `package.json` must run `@cloudflare/next-on-pages`** — Cloudflare always runs `npm run build`, ignoring the dashboard build command field. The package.json build script is the source of truth.
- **Static files must be in `public/`** — Next.js only serves static assets from this directory, not from the project root.
- **`cp -r public/` in the build script needs `|| true`** — `@cloudflare/next-on-pages` already copies public files during the Vercel build step; re-copying produces "same file" errors that would fail the build without `|| true`.
- **Videos are gitignored** — `public/videos/*.mp4` is in `.gitignore`. Always use `git add -f` to force-add video files.
- **Background image not in git** — `Gemini_Generated_Image_u6ogjtu6ogjtu6og.png` is too large and was never committed. It must be present on disk for the floral background to render.
- **`next.config.js` requires `images.unoptimized: true`** — Cloudflare Workers does not support Next.js image optimisation.
- **Git index corruption** — OneDrive sync can corrupt `.git/index`. If git commands fail with "bad signature" or "index file corrupt", run `del .git\index` then `git reset` (Windows) to rebuild.
- **Git lock conflicts** — OneDrive can also create `.git/index.lock`. Remove with `del .git\index.lock` (Windows).
- **`git add -A` preferred over `git add <path>`** — handles both deletions and additions in one command.
- **New locale keys accessed with `(t as any).keyName`** — the TypeScript type for `t` is inferred from `en.json`. New keys added without updating the type definition require casting to avoid build errors.
