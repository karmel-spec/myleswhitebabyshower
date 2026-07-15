# The Story Garden 🎈📖

A baby shower webapp for **Baby Boy White** (his name stays a secret until he arrives), son of Beau & Abby White — arriving **October 14th, 2026**.

Shower: **Saturday, August 15th, 2026, at dusk** · Grandma's garden, Orem, Utah.

Theme: **Story Garden** — a boyish garden meets children's books. Blue gingham, terracotta pots, greenhouse plants, string lights at dusk, and a library that grows one gift at a time.

## What's here

A multi-page storybook: **`index.html`** is the cover — bunting, balloon cluster, moon and stars, the live countdown to October 14th, and a table of contents styled like a real book's (dotted leaders, page numbers, a teddy reading over the heading). The book is deliberately short for guests — five chapters straight to the RSVP — with three **party pages** that stay locked until August 15th (guests scan a QR card at their table; hosts preview anytime with `?preview` on the URL, and print the cards from `table-cards.html`). Each chapter is its own page, linked prev/next like turning pages:
  1. `the-particulars.html` — A new chapter begins (when, where, what to bring; links to the book chapter and registries)
  2. `what-we-know.html` — Every story begins with love: what's written + guest predictions (sealed until he arrives)
  3. `growing.html` — He grows by the week: auto-computing growth tracker (size, length, weight, what's new)
  4. `books-for-baby.html` — claim-a-book library shelf (a book instead of a card; all books welcome — new, well worn, and in between; note inside the cover)
  5. `gift-table.html` — Amazon + Target registries, Venmo, and the nursery color palette
  6. `portraits.html` — Before he was famous: his real ultrasounds (14 weeks, anatomy scan, 4D)
  7. `rsvp.html` — Help us write the first pages (name + food notes + two photos for the baby-face game; one guest per RSVP)
  8. `the-evening.html` — night-of party mode: selfie guest book, advice wall, group album, and all four games (Beau or Abby?, Baby Care Quiz, Whose baby face?, Dressing Derby). Games are date-locked until August 15th; hosts can preview with `?preview` on the URL
  9. `guest-list.html` — hosts-only CRM (statuses, filters, books claimed, thank-you tracking, one-tap text invites)
- **`slideshow.html`** — the big screen: open on the TV/projector by the dessert table; it loops the group album (photos + storybook quote cards) all evening. Guests add photos from `the-evening.html` and they join the loop (live sync needs the backend, below).
- **`assets/`** — shared `styles.css` + `site.js` (countdown, growth tracker, quiz, CRM, album — all feature-guarded so any page can load them). `assets/photos/` holds baby Abby & baby Beau.
- **`design-studies/`** — the three earlier design-direction studies plus the previous single-page version (`story-garden-onepage.html`), kept for reference.

## Status

Everything runs as an in-page demo out of the box; connect a free Supabase project (see `backend/SETUP.md`) and RSVPs, book claims, guest book, photos, quiz tallies, game leaderboards, and the CRM all persist and sync live. Passwords: guest list "storygarden" (until Supabase login takes over), "Beau or Abby?" quiz "fireflies", baby-face game "ladybugs". Real content now in: ultrasounds, Amazon + Target registry links, Venmo (@abby_white), and the venue address (128 Westview Circle, Orem). Still pending: real quiz answers.

## Viewing

Open `index.html` in any browser — no build step. (Or enable GitHub Pages on this repo to give guests a URL.)

---
Made with love for Karmel & Abby. 🌼
