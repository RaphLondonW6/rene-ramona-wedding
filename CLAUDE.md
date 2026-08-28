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
- **n8n** as RSVP backend (self-hosted at `n8n.ramonapicksrene.com`)

---

## Deployment

The site is deployed to **Cloudflare Workers** (not Vercel). CI/CD is automatic from GitHub — every push to `main` triggers a Cloudflare build.

**How the build works:**
The Cloudflare dashboard is configured with two separate commands:

- **Build command:** `npm run cf-build`
- **Deploy command:** `npx wrangler deploy`

`cf-build` in `package.json` is:
```
npx @cloudflare/next-on-pages@1 && (cp -r public/. .vercel/output/static/ 2>/dev/null || true) && echo _worker.js > .vercel/output/static/.assetsignore
```

The `.assetsignore` contains `_worker.js` so the worker's source code is not served as public static files.

`@cloudflare/next-on-pages` internally runs `vercel build` → `npm run build` (= `next build`), then packages the output as a Cloudflare Worker at `.vercel/output/static/_worker.js`. `wrangler deploy` then uploads that worker.

The `package.json` scripts are:
```json
"build": "next build",
"cf-build": "npx @cloudflare/next-on-pages@1 && (cp -r public/. .vercel/output/static/ 2>/dev/null || true) && touch .vercel/output/static/.assetsignore"
```

The `|| true` on the `cp` step is intentional — `@cloudflare/next-on-pages` already copies `public/` during the Vercel build, so re-copying produces "same file" errors. The `|| true` makes those non-fatal while still ensuring static files are present.

**wrangler.toml:**
```toml
name = "rene-ramona-wedding"
main = ".vercel/output/static/_worker.js/index.js"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

# Required for next-on-pages dynamic route modules (__next-on-pages-dist__/...)
# Without this, server-rendered routes fail with "No such module" at runtime.
find_additional_modules = true
rules = [
  { type = "ESModule", globs = ["**/*.js"], fallthrough = true }
]

[assets]
directory = ".vercel/output/static"
binding = "ASSETS"

[[r2_buckets]]
binding = "MEDIA"
bucket_name = "wedding-media"

[[d1_databases]]
binding = "DB"
database_name = "wedding-posts"
database_id = "46503719-d1fd-448b-9a7d-28f9f28e5a11"
```

**To deploy:**
```powershell
cd "C:\Users\RSCHAEFFER\OneDrive - ACCOR\Accor\CLAUDE\rene-ramona-wedding"
git add -A
git commit -m "your message"
git push
```

Deployment is handled by a **GitHub Action** (`.github/workflows/deploy.yml`) — every push to `main` automatically runs `npm run cf-build && npx wrangler deploy`. Build logs are visible under the **Actions** tab in the GitHub repo.

The action uses two GitHub repository secrets:
- `CF_ACCOUNT_ID` — Cloudflare account ID (`2e99169e657be427103ebb71111c22c6`)
- `CF_API_TOKEN` — Cloudflare API token with Edit Workers permissions (named `github-actions-deploy` in Cloudflare)

**If auto-deploy stops working:** check the Actions tab in GitHub for error logs. As a manual fallback, use the deploy hook:
```bash
curl -X POST "https://api.cloudflare.com/client/v4/workers/builds/deploy_hooks/fd8bb0fe-ae1c-478a-b519-5f8760fa319f"
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
Go to Settings → Builds & Deployments → Git repository → Disconnect → reconnect the GitHub repo, then retry. If the retry button is greyed out, push an empty commit instead:
```bash
git commit --allow-empty -m "Trigger rebuild" && git push
```

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
│   │   ├── hotels/         # Real hotel photos (local, not Unsplash)
│   │   │   ├── Mercure_Conacul_Cozieni.png
│   │   │   ├── ibis-styles-bucharest.jpg
│   │   │   ├── Mercure_Bucharest_Unirii.png
│   │   │   ├── NovotelBucharestCityCentre.png
│   │   │   ├── Corinthia_bucharest.png
│   │   │   ├── HotelEpoque.png
│   │   │   ├── InterContinental_Bucharest.png
│   │   │   └── GrandHotelBucharest.png
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
RSVP (subtitle: white; success message: dark, includes confirmation email note; auto-scrolls to #rsvp on submit)
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

## Accommodation

Hotel data lives in `lib/accommodations.ts`. All 8 hotels use real photos stored locally in `public/images/hotels/`. All booking links go to the hotel's direct website or Accor booking page, with dates pre-filled where supported (check-in 2027-06-12, check-out 2027-06-13).

| # | Hotel | Distance | Photo file | Booking |
|---|---|---|---|---|
| 1 | ibis Styles Bucharest City Center | 13 km | `ibis-styles-bucharest.jpg` | Accor direct + dates |
| 2 | Novotel Bucharest City Centre | 13 km | `NovotelBucharestCityCentre.png` | Direct website |
| 3 | Mercure Bucharest Unirii | 14 km | `Mercure_Bucharest_Unirii.png` | Accor direct + dates |
| 4 | Corinthia Bucharest | 14 km | `Corinthia_bucharest.png` | Direct website |
| 5 | Hotel Epoque Bucharest | 14 km | `HotelEpoque.png` | Booking.com + dates |
| 6 | InterContinental Athenee Palace | 14 km | `InterContinental_Bucharest.png` | Direct booking site |
| 7 | Grand Hotel Bucharest | 14 km | `GrandHotelBucharest.png` | Direct website |
| 8 | Mercure Conacul Cozieni | 35 km | `Mercure_Conacul_Cozieni.png` | Accor direct |

**Note:** Hotel images are in `public/images/hotels/` — add new files there and reference them as `/images/hotels/filename.ext` in `accommodations.ts`.

---

## RSVP Form Fields

Internal form field names (React Hook Form): `firstName`, `lastName`, `email`, `phone`, `attendance`, `nationality`, `dietary`, `dietaryOther`, `message`, `gdpr`. A honeypot field (`_hp`) silently blocks bots.

JSON payload sent to n8n uses these **exact** keys (note the mapping from internal names):

| JSON key (sent to n8n) | Internal form field |
|---|---|
| `firstName` | `firstName` |
| `lastName` | `lastName` |
| `email` | `email` |
| `phone` | `phone` |
| `nationality` | `nationality` |
| `attendance` | `attendance` |
| `dietary` | `dietary` |
| `otherDietary` | `dietaryOther` |
| `message` | `message` |

**Home address field removed (Aug 2026)** — flagged as a critical privacy concern in a site audit (guest postal addresses being collected/stored unnecessarily). The `homeAddress` field, its `address` JSON key, and its locale strings (`homeAddressLabel`, `homeAddressPlaceholder`) were fully removed from `RSVP.tsx` and all three locale files. The n8n workflow's Google Sheets node still has an `address` column mapping (`{{ $json.body.address }}`) — it will just receive empty values going forward; remove that column mapping in n8n if desired.

`nationality` is a **dropdown** (not a free-text input) with Romanian, Slovak, French, British pinned at the top, followed by an alphabetical list of European and other nationalities.

Phone is **optional** — labelled with an italic "(Optional)" next to the field label (locale key `rsvp.form.optionalLabel`) and has no `required` validation. Placeholder reads `RO +40, UK +44, SK +421` as a hint for the three main guest nationalities.

Dietary options: `none`, `gluten`, `vegetarian`, `vegan`, `other` — "Allergies" was removed; "Other" is labelled "Tell us more about it" (RO: "Spuneți-ne mai multe", SK: "Povedzte nám viac").

The Meal Selection has been moved to the standalone **Menu** section (`components/Menu.tsx`). RSVP only contains attendance, personal details, dietary requirements, optional message, and GDPR consent.

On successful submission, the form is replaced in-place by a success banner (no layout shift — the outer wrapper stays in the DOM). A `useEffect` watching `status === 'success'` smoothly scrolls the page to `#rsvp` so the banner is always visible.

---

## RSVP → n8n Webhook

Submissions are POSTed as JSON to the n8n webhook endpoint hardcoded in `components/RSVP.tsx`:

```
const RSVP_ENDPOINT = 'https://n8n.ramonapicksrene.com/webhook/rsvp-wedding'
```

Request: `POST`, `Content-Type: application/json`. The 10-field JSON body maps internal form names to the n8n-expected keys (see field table above). Errors are caught and set `status('error')` — unlike the old Google Apps Script integration which used `no-cors` and silently ignored failures.

**n8n is self-hosted at `n8n.ramonapicksrene.com`.** If submissions stop working, check that the n8n instance is running and the `rsvp-wedding` webhook workflow is active.

---

## Wedding Invitation (Invite.html)

Text updated to:
> Together with their families / Ramona & René / invite you to celebrate their marriage / Saturday 12 June 2027 / At half past five in the afternoon / Phoenix Cernica – By The Pool / Pantelimon, Romania

All three language versions (EN/RO/SK) updated in the inline `i18n` JS object.

---

## Static Standalone Pages

`public/Wedding_Invitations/Invite.html`, `public/Wedding_Menus/Menu.html`, `public/email-confirmation.html`, and `public/stag/registration/registration/index.html` are **self-contained HTML pages** — not Next.js routes. They are served directly as static files by Cloudflare's ASSETS binding.

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

Locale files contain: `nav`, `hero`, `welcome`, `program`, `rsvp`, `accommodation`, `honeymoon`, `parking`, `contact`, `footer`. The `nav` object includes a `menu` key (EN: "Menu", RO: "Meniu", SK: "Menu").

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

## Guest Photo Wall — "The Evidence" (/evidence)

An Instagram-style guest photo/video wall. Guests upload photos & videos which publish **immediately** (no moderation). Live at `https://www.ramonapicksrene.com/evidence`, linked in nav as "📸 The Evidence" (RO: Dovezile, SK: Dôkazy).

**Architecture:**
- **R2 bucket `wedding-media`** (binding `MEDIA`) — stores original media, keys are `<uuid>.<ext>`
- **D1 database `wedding-posts`** (binding `DB`) — `posts` table (metadata incl. email, never exposed publicly, and optional `caption` capped at 250 chars) + `upload_log` (per-IP rate limiting). Schema: `schema.sql`. Migrations live in `migrations/` — run new ones with `npx wrangler d1 execute wedding-posts --remote --file=migrations/00X_name.sql`.
- **API routes** (all edge runtime, in `app/api/`):
  - `GET /api/posts?cursor=<ts>_<id>` — cursor-paginated feed (12/page), never returns emails
  - `POST /api/posts` — multipart upload: validates MIME + size (images ≤20MB, videos ≤50MB — chosen to keep clips short & the feed fast; Workers hard request cap is 100MB), honeypot field `website`, rate limit 10 uploads/10min/IP, stores R2 + D1, fires n8n webhook via `waitUntil` (5s timeout, never blocks upload)
  - `GET /api/media/[key]` — streams from R2 with Range support (required for iOS video), immutable cache headers
  - `DELETE /api/posts/[id]` — admin-only delete, requires `x-admin-token` header matching `ADMIN_TOKEN` secret:
    ```bash
    curl -X DELETE https://www.ramonapicksrene.com/api/posts/<id> -H "x-admin-token: <token>"
    ```
- **Frontend:** `app/evidence/page.tsx` + `components/EvidenceWall.tsx` — infinite scroll, floating upload button (custom "photos" icon at `public/images/evidence-fab.png`, replaced the original "+" glyph), bottom-sheet upload modal, client-side image compression (canvas → 1920px JPEG 85% before upload), rotating funny loading messages, CSS confetti on successful upload. All microcopy trilingual in `locales/*.json` under `evidence` key. Each post card shows its `id` (small muted text with tap-to-copy) so posts can be identified for admin deletion.
- **Optional caption:** guests can add up to a 250-character caption when uploading (textarea, live character counter, "(optional)" hint next to the label). Shown in italics below the name/timestamp on each post card when present. Locale keys: `evidence.captionLabel`, `evidence.optionalHint`, `evidence.captionPlaceholder`.
- **Live auto-refresh:** the feed polls `GET /api/posts` every 5s in the background (paused when the browser tab is hidden). Rather than a hard page reload — which would reset scroll position and interrupt video playback — new posts are held back and surfaced via a tap-to-reveal pill at the top of the feed ("✨ New evidence just landed…", locale key `evidence.newArrivals`). Tapping it merges the new posts in and scrolls to top.
- **Ambient confetti:** a two-sided confetti burst (`SideConfetti` component in `EvidenceWall.tsx`) fires from both bottom corners of the screen on page load, on every reveal of new evidence, and then loops automatically every 3.5s for as long as the page is open. Skipped for `prefers-reduced-motion` and paused when the tab is hidden.
- **Overlay:** the "💍 Ramona & René · 12·06·2027" ribbon is a CSS overlay on the feed — originals in R2 stay untouched.
- **n8n webhook** (confirmation email): `https://n8n.ramonapicksrene.com/webhook/6bdd98e4-4e3c-4b98-b00a-8ea3444cb59a` — payload: `{event, postId, guestName, guestEmail, mediaType, contentType, sizeBytes, mediaUrl, feedUrl, caption, timestamp}`. n8n workflow: Webhook (POST, Respond: Immediately) → IF (`{{ $json.body.mediaType }}` is equal to `image`) → separate Gmail nodes per branch. HTML templates: `public/evidence-confirmation.html` (source, with `IMAGE_BLOCK`/`VIDEO_BLOCK` markers) — image/video-specific versions with n8n expressions already substituted were generated once for pasting into the two Gmail nodes.
- **`lib/cloudflare.ts`** — `env()` / `waitUntil()` helpers wrapping `getRequestContext()` from `@cloudflare/next-on-pages` (added to devDependencies)

**Setup status: DONE (Aug 2026).** R2 bucket `wedding-media` created (R2 had to be enabled account-wide in the dashboard first — error 10042 otherwise), D1 `wedding-posts` created (id `46503719-d1fd-448b-9a7d-28f9f28e5a11`), schema applied via `npx wrangler d1 execute wedding-posts --remote --file=schema.sql`, `ADMIN_TOKEN` secret set on the Worker. Migration `migrations/001_add_caption.sql` (adds the `caption` column) applied on top afterward.

**Gotchas learned during deployment:**
- **R2 must be enabled account-wide** before bucket creation/deploy works (dashboard → R2 → activate, requires a payment card even for free tier). Error: `code: 10042`.
- **`find_additional_modules = true` + ESModule rules in wrangler.toml are mandatory** — without them, server-rendered routes fail at runtime with `No such module "__next-on-pages-dist__/functions/<route>.func.js"` while static pages keep working. First surfaced when `/evidence` (first non-static route) was added.
- The D1 binding must stay named `DB` and R2 binding `MEDIA` (that's what `lib/cloudflare.ts` expects), regardless of what wrangler's suggested config snippet shows.

---

## Wedding Invitation Card

A standalone invitation card image is hosted at:
```
https://www.ramonapicksrene.com/images/invitation-card.png
```

**Source file:** `C:\Users\RSCHAEFFER\OneDrive - ACCOR\Accor\CLAUDE\wedding-invitation-card.html`

The card features the couple's beach photo (`couple.png`, same folder), gold border frame, Great Vibes / Cormorant Garamond / Cinzel fonts, and a CSS gradient fade from photo into cream card background.

**To regenerate the image** (e.g. after content changes):
1. Open `wedding-invitation-card.html` in a browser to preview
2. Run Chrome headless to export:
```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless --screenshot="C:\Users\RSCHAEFFER\OneDrive - ACCOR\Accor\CLAUDE\invitation-card.png" --window-size=680,1200 --enable-local-file-access "file:///C:/Users/RSCHAEFFER/OneDrive%20-%20ACCOR/Accor/CLAUDE/wedding-invitation-card.html"
```
3. Crop any black banner at the bottom if present
4. Copy to `public/images/invitation-card.png` and push to repo

**Used in n8n email** — added below the sign-off as:
```html
<div style="text-align:center;margin:1.5rem 0;">
  <img src="https://www.ramonapicksrene.com/images/invitation-card.png"
       alt="Ramona & René — Wedding Invitation"
       style="max-width:100%;border:1px solid #e8e0d0;" />
</div>
```

---

## RSVP Email Confirmation (N8N + SMTP)

**Redesigned Aug 2026** after a brutal-honesty review of the live email turned up real issues (see "Gotchas" below). Source templates, one per language:
- `public/email-confirmation.html` (EN)
- `public/email-confirmation-ro.html` (RO)
- `public/email-confirmation-sk.html` (SK)

All three share the same dark-header/gold-accent design (`#1a1a18` header/footer, `#c9a96e` gold, `#f9f6f0` cream background) — matching the style already used in `public/evidence-confirmation.html`, not the older champagne/gold table layout this section used to describe.

**Template variable:** `{{firstName}}` — replace with `{{ $json.body.firstName }}` (or the equivalent n8n expression for wherever the RSVP payload lands) via node expression.

**Structure, in order:** dark header (names + date/venue) → hero ("Thank you, {{firstName}}") → warm body copy → invitation card image (moved up from the old design so the sign-off can be last) → "what happens next" info box (schedule, venue, parking, accommodation, tips) → **single CTA** "📸 Leave Us a Memory" linking to `/evidence` (inviting guests to post an early photo + message before the wedding) → sign-off ("With so much love, Ramona & René ❤️") → P.S. with a plain-text website link → footer → GDPR note.

**N8N workflow setup:**
1. **Trigger** — Webhook node at path `rsvp-wedding` (receives the RSVP form POST directly)
2. **Email node** (SMTP, not Gmail, in the live workflow) — paste the matching-language HTML as the body (HTML format)
3. **From Email** — must include a display name, not just the bare address, or the guest's inbox shows the raw email instead of a name: `René & Ramona <hello@ramonapicksrene.com>` (standard `"Name" <email>` RFC format — safe, doesn't change the sending address)
4. **To Email** — map to the guest's email from the trigger payload
5. **Subject** — `We're looking forward to seeing you 🎉` (note: "seeing", not "see" — grammar fix from the original)
6. **First name** — replace `{{firstName}}` with the correct expression pointing at the RSVP payload

**Known issue caught in review:** an earlier live send greeted a guest as "Hi Rafafafa," — almost certainly a broken or test personalization value. Always send a real test RSVP and check the actual name renders correctly before trusting a template change.

**Language routing:** not yet automated — the RSVP form doesn't currently pass a language preference to n8n, so today only one template gets sent regardless of the guest's site language. Wiring up per-language branching (e.g. on the `nationality` field or an explicit language selector) is a natural next step if needed.

**"Cannot attend" branch** — separate templates for guests who decline, sent from the false branch of the `attendance` IF node in the same n8n workflow:
- `public/email-cannot-attend.html` (EN)
- `public/email-cannot-attend-ro.html` (RO)
- `public/email-cannot-attend-sk.html` (SK)

Same visual design and `{{firstName}}` convention as the attending templates. Redesigned alongside the attending email (Aug 2026) to add: a warm paragraph inviting the guest to still leave a photo/message on `/evidence` despite not attending in person, a "📸 Leave Us a Message" CTA (was previously just "Visit our wedding website"), and the GDPR footer note (previously missing). Subject used: `Thank you for letting us know ❤️`.

---

## Stag Party Registration Page

A hidden, standalone page for René's stag party (Ibiza, 14–16 May 2027). It is **not linked from the wedding site navigation** — accessible only via direct URL:

**URL:** `https://ramonapicksrene.com/stag/registration/registration`

**File:** `public/stag/registration/registration/index.html`

Cloudflare's ASSETS binding serves `index.html` automatically for directory-style paths, so the `.html` extension is not needed in the URL.

**Page features:**
- Dark neon theme (`--bg:#09090f`, neon pink `#ff2020` / cyan `#00f0ff`)
- Bebas Neue + Inter fonts (Google Fonts)
- EN/SK language switcher (toggle button, top-right)
- Hero section with Ibiza beach background (Unsplash)
- Event details grid (location, dates, cost, vibe) — Cost card shows "From €1,000 / person" with no sub-text
- Cost note block (`.details__note`) below the grid — explains flights are booked individually, encourages booking early, translated EN/SK inline via `data-en`/`data-sk` attributes
- Live countdown to 14 May 2027
- RSVP form: first name, last name, email, phone, attending toggle, free-text comments field
- Payload fields sent to Google Sheets: `firstName`, `lastName`, `email`, `phone`, `attending`, `comments`, `timestamp`
- Comments field label/placeholder are translated via `data-en`/`data-sk` and `data-en-placeholder`/`data-sk-placeholder` attributes; placeholder swap is handled in `toggleLang()`
- Submissions go to a **separate** Google Apps Script endpoint (different from the wedding RSVP):
  ```
  https://script.google.com/macros/s/AKfycbx-j5358T5pYsoumhYdeoa-shYgrb0Q1KFryjH4E_9WN5WbgB7TWy1b3ib95njlxWTebg/exec
  ```

**Translation approach:** All translations are inline `data-en` / `data-sk` attributes on HTML elements — there are no separate JSON locale files for this page. The `toggleLang()` JS function swaps element content by reading the active language's `data-*` attribute.

The source file is also at `C:\Users\RSCHAEFFER\OneDrive - ACCOR\Accor\CLAUDE\RENE_Ramona_Wedding\Stag\registration.html` — edit there and copy to `public/stag/registration/registration/index.html` to update.

---

## Known Gotchas

- **Cloudflare dashboard build command must be `npm run cf-build`** — the dashboard build command field is the source of truth for Cloudflare Workers deployments. If it gets reset to `npm run build`, the `_worker.js` file won't be generated and `wrangler deploy` will fail with "entry-point file not found". Always verify: Build command = `npm run cf-build`, Deploy command = `npx wrangler deploy`.
- **Static files must be in `public/`** — Next.js only serves static assets from this directory, not from the project root.
- **`cp -r public/` in the build script needs `|| true`** — `@cloudflare/next-on-pages` already copies public files during the Vercel build step; re-copying produces "same file" errors that would fail the build without `|| true`.
- **Videos are gitignored** — `public/videos/*.mp4` is in `.gitignore`. Always use `git add -f` to force-add video files.
- **Background image not in git** — `Gemini_Generated_Image_u6ogjtu6ogjtu6og.png` is too large and was never committed. It must be present on disk for the floral background to render.
- **`next.config.js` requires `images.unoptimized: true`** — Cloudflare Workers does not support Next.js image optimisation.
- **Git index corruption** — OneDrive sync can corrupt `.git/index`. If git commands fail with "bad signature" or "index file corrupt", run `del .git\index` then `git reset` (Windows) to rebuild.
- **Git lock conflicts** — OneDrive can also create `.git/index.lock`. Remove with `del .git\index.lock` (Windows).
- **`.npmrc` sets `legacy-peer-deps=true`** — required because `wrangler@4.x` and `@cloudflare/next-on-pages@1.x` have conflicting optional peer deps on `@cloudflare/workers-types` (v4 vs v5). Without this, `npx @cloudflare/next-on-pages@1` fails with `ERESOLVE` during Cloudflare builds.
- **`git add -A` preferred over `git add <path>`** — handles both deletions and additions in one command.
- **New locale keys accessed with `(t as any).keyName`** — the TypeScript type for `t` is inferred from `en.json`. New keys added without updating the type definition require casting to avoid build errors.
- **`section-subtitle` CSS class overrides Tailwind color** — the class sets `color: var(--color-light-text)` which wins over plain Tailwind utilities. Use `!text-white` (with `!important`) to override it.
- **Parking section uses a PDF button, not images** — the 3 step images were removed. A single "Parking Instructions" button links to `/ParkingInstructions.pdf` (opens in new tab). The PDF is at `public/ParkingInstructions.pdf` (1.7MB). Button label is translated: EN "Parking Instructions", RO "Instrucțiuni de parcare", SK "Pokyny k parkovaniu".

---

## Cloudflare Routes

The Worker is bound to the domain via routes in the Cloudflare dashboard (Workers & Pages → your Worker → Settings → Triggers):

- `www.ramonapicksrene.com/*` — main site
- `ramonapicksrene.com/*` — apex domain

Avoid `*.ramonapicksrene.com/*` (wildcard subdomain) — it's broader than needed for a single site and doesn't cover the apex domain anyway.
