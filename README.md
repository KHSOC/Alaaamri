# alaaamri.com — Version 5

Bilingual static portfolio and technical directory.

## Main pages
- index.html: language selection gateway
- en.html / ar.html: English and Arabic portfolio
- projects-en.html / projects-ar.html
- tech-hub-en.html / tech-hub-ar.html

## Security hardening
- Strict Content Security Policy with no inline scripts or styles
- No forms, database, authentication, cookies, or server-side code
- External links use noopener + noreferrer
- Security headers in _headers
- Service worker is network-first for HTML, CSS, and JavaScript
- Language preference is stored only in localStorage

## Deployment
Upload every file to the repository root. Cloudflare deploys automatically from GitHub.
After deployment, use Ctrl+Shift+R once to clear older cached assets.
