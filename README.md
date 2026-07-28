# alaaamri.com

Upload the contents of this folder to Cloudflare Pages.

Recommended Cloudflare Pages settings:
- Framework preset: None
- Build command: leave empty
- Build output directory: /
- Always Use HTTPS: On
- Minimum TLS Version: TLS 1.2 or newer

Files:
- index.html: Portfolio home
- projects.html: Projects
- tech-hub.html: Curated technical resources
- _headers: Security headers for Cloudflare Pages
- manifest.webmanifest + sw.js: Installable PWA support

Before publishing:
1. Review the experience numbers and wording.
2. Add your real LinkedIn/GitHub URLs when available.
3. Add a CV file only after removing sensitive personal information.

## Version 2 fix
- Improved Tech Hub category filtering.
- Added explicit button state handling.
- Changed the service worker to network-first for HTML, CSS, and JavaScript.
- Added cache-busting query parameters to avoid stale Cloudflare/browser assets.

## Flat v3
All CSS, JS, and SVG files are stored in the repository root for GitHub web upload compatibility.
