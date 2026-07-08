# The Story Garden 🎈📖

A baby shower webapp for **Baby Boy White** (his name stays a secret until he arrives), son of Beau & Abby White — arriving **October 14th, 2026**.

Shower: **Saturday, August 15th, 2026, at dusk** · Grandma's garden, Orem, Utah.

Theme: **Story Garden** — a boyish garden meets children's books. Blue gingham, terracotta pots, greenhouse plants, string lights at dusk, and a library that grows one gift at a time.

## What's here

A multi-page storybook: **`index.html`** is the cover — bunting, balloon cluster, moon and stars, the live countdown to October 14th, and a table of contents styled like a real book's (dotted leaders, page numbers, a teddy reading over the heading). Each chapter is its own page, linked prev/next like turning pages:
  1. `the-particulars.html` — A new chapter begins (with the long gingham-table scene)
  2. `our-story.html` — The story so far: dating → honeymoon → ultrasound & gender reveal → countdown
  3. `what-we-know.html` — Every story begins with love: what's written + guest predictions (sealed until he arrives)
  4. `growing.html` — He grows by the week: auto-computing growth tracker (size, length, weight, what's new)
  5. `books-for-baby.html` — claim-a-book library shelf (bring a well-loved used book instead of a card, note inside the cover)
  6. `gift-table.html` — illustrated garden gift table: Amazon registry + Venmo group gift (the stroller jar)
  7. `portraits.html` — Before he was famous: ultrasound gallery
  8. `two-babies.html` — Abby & Beau baby photos + the blended "as imagined" portrait
  9. `rsvp.html` — Help us write the first pages (addresses for thank-yous + two photos for the baby-face game)
  10. `the-evening.html` — night-of party mode: selfie guest book, advice wall with comments, password-gated "Beau or Abby?" live quiz
  11. `games.html` — the games: Baby Care Quiz with reveal-by-reveal leaderboard, password-gated "Whose baby face?" matching game, and the Dressing Derby stopwatch leaderboard
  12. `guest-list.html` — hosts-only CRM (statuses, filters, books claimed, thank-you tracking, one-tap text invites)
  13. `epilogue.html` — The story is just beginning… (after October 14th this becomes the family site)
- **`slideshow.html`** — the big screen: open on the TV/projector by the dessert table; it loops the group album (photos + storybook quote cards) all evening. Guests add photos from `the-evening.html` and they join the loop (live sync needs the backend, below).
- **`assets/`** — shared `styles.css` + `site.js` (countdown, growth tracker, quiz, CRM, album — all feature-guarded so any page can load them). `assets/photos/` holds baby Abby & baby Beau.
- **`design-studies/`** — the three earlier design-direction studies plus the previous single-page version (`story-garden-onepage.html`), kept for reference.

## Status

Everything runs as an in-page demo out of the box; connect a free Supabase project (see `backend/SETUP.md`) and RSVPs, book claims, guest book, photos, quiz tallies, game leaderboards, and the CRM all persist and sync live. Passwords: guest list "storygarden" (until Supabase login takes over), "Beau or Abby?" quiz "fireflies", baby-face game "ladybugs". Placeholders pending: real photos, ultrasound scans, the Amazon registry URL, Venmo handle, and the live site URL in `assets/config.js`.

## Viewing

Open `index.html` in any browser — no build step. (Or enable GitHub Pages on this repo to give guests a URL.)

---
Made with love for Karmel & Abby. 🌼
