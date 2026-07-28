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

## Version 6
- Removed the 400+ branches and 24/7 statistics.
- Removed OSPF from the networking description.
- Added 24 technical programs and utilities.
- Added a dedicated cybersecurity-resources section with 18 websites.
- Updated cache version to v6.

## Version 7
- Replaced the old favicon with `favicon-olive.svg`.
- Changed the browser-tab icon to the olive visual identity.
- Bumped all cache versions to v7.

## Version 8
- Added the uploaded CV as `Khalid-Al-Amri-CV.pdf`.
- Added CV links to navigation, home hero, and contact sections.
- Consolidated all 51 AI tools under one main AI section.
- Grouped AI tools into assistants, search, coding, research, productivity, images, video, music, audio, and automation.
- Kept 24 technical programs in a separate programs section.
- Updated JavaScript filtering and cache version to v8.

## Version 9
- Changed the home hero to “Hi, I'm Khalid” / “أهلًا، أنا خالد”.
- Removed the About / نبذة section from both home pages.
- Rebuilt the software directory into seven professional categories.
- Added networking tools, browsers including Tor Browser, virtualization and sandbox tools.
- Added a Windows setup and optimization category featuring Chris Titus Tech WinUtil.
- Added diagnostics, development, security, and monitoring utilities.
- Added program-category filters and updated the JavaScript cache to v9.

## Version 10
- Added a live Riyadh clock to both home pages.
- Displays hours, minutes, seconds, weekday, full date, month, and year.
- Uses the browser's Intl API with the Asia/Riyadh timezone.
- Updated cache version to v10.

## Version 11
- Removed the portfolio hero description from the Arabic and English home pages.
- Added a daily-toolkit section for information security analysts.
- Added a daily-toolkit section for network security engineers.
- Added 12 tools to each role-focused section.
- Updated metadata, styling, and cache version to v11.

## Version 12
- Added a bilingual Training Courses section.
- Added Abad Net, Coursera, Al Khaleej Training, Tuwaiq Academy, Udemy, Cyber Master, and Netriders Academy.
- Added an in-page Training link to the Tech Hub navigation.
- Updated metadata, styles, and cache version to v12.

## Version 13
- Removed Training from the top Tech Hub navigation.
- Added Training, Security Analyst Tools, Network Security Engineer Tools, and Cybersecurity Websites to the Main Sections sidebar.
- Added direct smooth-scroll navigation to those sections.
- Added Scroll Down controls to the portfolio and Tech Hub hero sections.
- Added a saturated animated glow style to the Open Tech Hub button.
- Updated cache version to v13.

## Version 14
- Changed the root page title from `Choose a language — Khalid` to `Khalid | Network & Security Engineer`.
- Added complete Open Graph and X/Twitter card metadata.
- Added a 1200x630 social preview image: `social-preview.png`.
- Updated cache version to v14.

## Version 15
- Added bilingual Command Center pages.
- Added 100 original command-reference entries across 7 platforms.
- Added search, platform filters, A-Z filtering, favorites, copy buttons, examples, and risk labels.
- Platforms: Windows CMD, PowerShell, Linux/Bash, Cisco IOS, FortiGate CLI, Docker CLI, and Git.
- Added links from the site navigation and Tech Hub.
- Added `commands.js` and updated cache version to v15.

## Version 16
- Expanded the Command Center from 100 to 200 commands.
- Added 100 new commands across Windows CMD, PowerShell, Linux/Bash, Cisco IOS, FortiGate CLI, Docker CLI, and Git.
- Updated platform totals, hero statistics, search counts, A-Z index, and Tech Hub sidebar count.
- Updated cache version to v16.

## Version 17
- Expanded the Command Center from 200 to 300 commands.
- Added bilingual Windows Cleanup pages with 10 guided cleanup actions, commands, copy buttons, execution instructions, and risk labels.
- Added bilingual Operating Systems Directory pages with 30 systems and platforms.
- Added a locally generated SVG illustration and official website link for every system.
- Added Windows Cleanup and Operating Systems to the main navigation.
- Updated sitemap, service worker, security headers, and cache version to v17.

## Version 18
- Replaced the generated abbreviation illustrations in the Operating Systems directory with recognizable system and platform logos.
- Added 30 high-resolution SVG logo URLs through the Iconify API.
- Kept the original local SVG illustrations as automatic fallbacks.
- Restricted the CSP image allowlist to `https://api.iconify.design`.
- Updated styles, scripts, and cache version to v18.

## Version 19
- Removed Windows Cleanup and Operating Systems from the top navigation across all pages.
- Added both resources inside the Tech Hub as prominent cards, hero shortcuts, and Main Sections sidebar links.
- Added an animated saturated glow to the Tech Hub link in the top navigation.
- Updated metadata, styles, scripts, and cache version to v19.

## Version 20
- Completed a full security, spelling, accessibility, responsive-layout, and performance audit.
- Fixed conflicting CSP policies that blocked external system logos.
- Rebuilt the Service Worker with safe navigation and static-asset strategies.
- Reduced the initial Command Center DOM from 300 cards to paginated rendering.
- Added shared `commands-data.js`, offline support, stronger caching, and PWA icons.
- Corrected Arabic wording and aligned the homepage experience timeline with the included CV.
- Added `AUDIT-REPORT.md`.
- Updated cache version to v20.

## Version 21
- Rebuilt the Tech Hub layout so the Main Sections menu stays sticky across all sections.
- Added a desktop sticky sidebar and a mobile sticky horizontal navigation bar.
- Added automatic active-section highlighting with IntersectionObserver.
- Completed another security, spelling, internal-link, JavaScript, and accessibility audit.
- Updated cache version to v21.
