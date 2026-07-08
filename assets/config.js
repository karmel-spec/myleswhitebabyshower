// The Story Garden — site configuration.
// Fill in the two Supabase values to turn on the live backend (RSVPs, guest
// book, photo album, quiz tallies, guest-list CRM). Until then every page
// still works as a local demo. Full setup steps: backend/SETUP.md
window.STORY_GARDEN_CONFIG = {
  // From your Supabase project: Settings → API
  supabaseUrl: '',      // e.g. 'https://abcd1234.supabase.co'
  supabaseAnonKey: '',  // the "anon public" key

  // The host account you create in Supabase: Authentication → Users.
  // Karmel & Abby share this one login on the guest-list page.
  hostEmail: 'hosts@storygarden.family',

  // Once the site is live (GitHub Pages), put its address here — it's added
  // to the invite texts sent from the guest list.
  siteUrl: '',

  // Before Supabase is connected, the guest-list page is gated by this
  // password instead (stored as a SHA-256 hash, so the password itself
  // isn't readable in the source). Current password: "storygarden".
  // To change it: python3 -c "import hashlib;print(hashlib.sha256(b'new-password').hexdigest())"
  hostPasswordHash: 'cda8e40c88fb52a822830bc409aeb9530af1522937923f04fc35e813389852d4'
};
