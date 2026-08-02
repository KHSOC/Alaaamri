"use strict";

/*
  Public browser configuration only.
  Never place a Supabase service-role key or any private secret in this file.
  The anon key is intended for browser use when Row Level Security is enabled.
*/
window.KHALID_SITE_CONFIG = Object.freeze({
  supabaseUrl: "",
  supabaseAnonKey: "",
  communityEnabled: false,
  chatRoom: "tech-lounge",
  pollIntervalMs: 5000
});
