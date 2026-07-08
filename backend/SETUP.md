# Turning on the live backend

The site works as a demo with no setup at all. To make RSVPs, book claims,
the guest book, photos, quiz tallies, and the guest list actually save —
and sync live to every phone and the big screen — connect it to a free
[Supabase](https://supabase.com) project. About ten minutes, one time.

## 1. Create the project

1. Go to [supabase.com](https://supabase.com) → **Start your project** → sign up (the free plan is plenty).
2. **New project** — name it `story-garden`, pick any database password (you won't need it again), choose a US region.

## 2. Create the tables

1. In the left sidebar open **SQL Editor**.
2. Copy everything in [`schema.sql`](schema.sql), paste it in, press **Run**.

## 3. Create the host login (Karmel & Abby's shared key to the guest list)

1. Sidebar → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Email: `hosts@storygarden.family` (or any email — just make it match
   `hostEmail` in `assets/config.js`).
3. Password: the guest-list password you two want to share. Check
   **Auto confirm user**.

## 4. Connect the site

1. Sidebar → **Project Settings** → **API**.
2. Copy the **Project URL** and the **anon public** key into
   [`assets/config.js`](../assets/config.js):

```js
supabaseUrl: 'https://YOURPROJECT.supabase.co',
supabaseAnonKey: 'eyJ...the long anon key...',
```

3. Commit and push (or just reload if testing locally). Done — every page
   picks it up automatically.

## What guests can and can't do

The anon key in the page is safe to publish: row-level security means
visitors can only *drop things in the mailbox* (send an RSVP, claim a book,
add a photo…) and see the shared walls (guest book, advice, album, quiz
tallies). RSVPs, mailing addresses, predictions, and the guest-list CRM are
readable only after signing in as the host on the guest-list page.
