# psyphin.co.za

Personal landing page for PsyPhin, hosted on GitHub Pages from the `psyphin234/psyphin234.github.io` repo (branch `main`, root folder) at the custom domain **psyphin.co.za**.

Plain static HTML/CSS/JS. **No build step, no framework, no bundler.** Whatever is committed is what's served.

**Runbook:** this site is the proof of concept for a repeatable small-business website + domain + email setup, documented in the living doc [Runbook: Small-Business Website, Domain & Email](https://claude.ai/code/artifact/c6599b33-9301-4e65-8b4d-bd8c06bd1c0c). When the process changes (a new DNS quirk, a finished step, a lesson learned), update that runbook as well as this file.

## Structure

```
index.html              Home page: hero logo, Tools, Projects, footer
contact.html            Contact page: compact logo + info@psyphin.co.za (mailto link + copy button)
dmr-hotspot/index.html  Project page for Digital Radio Hotspot  -> psyphin.co.za/dmr-hotspot/
dmr-hotspot/img/        Its photos (<name>-800.jpg + <name>-1600.jpg) and the two SVG diagrams
sherp-crawler/index.html  Project page for RC SHERP Crawler -> psyphin.co.za/sherp-crawler/ (images in sherp-crawler/img/, -800.jpg only)
battery-monitor/index.html  Project page for Caravan Battery Monitor -> psyphin.co.za/battery-monitor/ (images in battery-monitor/img/, -800.jpg only)
rc-remote/index.html    Project page for ESP32 RC Remote -> psyphin.co.za/rc-remote/ (images in rc-remote/img/, -800.jpg only)
which-radio/index.html  Redirect to https://radio.psyphin.co.za/ (since 2026-10-23; it was an unlisted preview from 2026-10-21). Keeps the old link working.
projects.js             THE project list (window.PROJECTS). Edit this to add/change projects.
js/main.js              Shared script for all pages: project cards (#project-grid), project-page headings ([data-project]), email + copy buttons, footer year
js/circuit.js           The animated glowing circuit board behind every page. IDENTICAL to fuel.psyphin.co.za's circuit.js (BFP_Website docs/ and frontend/): change one, copy it to all
css/style.css           All styles. Colours are CSS variables at the top of the file.
assets/img/             Web-optimised logo (logo-{480,800,1200}.{webp,jpg}) + og-image.jpg + brand-64.png (pinned-header icon)
assets/img/projects/    Card photos, 800x450 (16:9): fuel-chart.jpg, sa-towing-check.jpg, sa-tyre-pressures.jpg, winch-recovery-sizing.jpg, ropes-recovery-gear.jpg, which-radio.jpg (the radio page's gain diagram, Mountains case, headless Chrome at 900x400 2x, cropped to 16:9), ev-cost.jpg (a crop of the EV page's "Cost per 100 km" card at its default figures, 900 px window, 2x; recaptured in the navy look 2026-10-19: a 16:9 area from the card's top, with its 100 km race finished), dmr-gem.jpg, sherp-wire.jpg, battery-monitor.jpg, rc-remote.jpg
favicon.ico             48/32/16px favicon, cropped around the "P" shield in psyphin-logo.jpg
favicon-{48,96,192}x{48,96,192}.png  PNG favicons (Google wants multiples of 48px)
apple-touch-icon.png    180px iOS home-screen icon (same crop)
                        The favicon set is identical to fuel.psyphin.co.za's (BFP_Website/docs); change both together.
psyphin-logo-black.jpg  Source logo used to generate everything in assets/img (keep - reference original)
psyphin-logo.jpg        White-background logo, the source of the favicons (keep - reference original)
tools/optimize-images.py  Regenerates images/favicons from the source logos (needs Pillow)
tools/optimize-photos.py  Shrinks project photos to 800/1600 px JPGs and strips EXIF (GPS, camera): python tools/optimize-photos.py <src folder> <project>/img
CNAME                   Custom domain for GitHub Pages - must contain only: psyphin.co.za
.nojekyll               Tells GitHub Pages to serve files as-is (skip Jekyll)
```

## Adding a project

Add **one line** to the array in `projects.js`:

```js
{ title: "My New Thing", description: "What it does in a sentence.", url: "https://example.com", cta: "Open", tags: ["Tag", { label: "Actively maintained", color: "green" }] },
```

- `title` and `description` are required; `kind`, `url`, `cta` (button text, default "Open"), `tags`, `image` + `imageAlt` (a 16:9 photo across the top of the card, kept in `assets/img/projects/`) and `updated` (a short grey line above the button, e.g. "Updated 25 Sep 2026") are optional. **Update the `updated` date when a project moves on.** The fuel card's image is a crop of the live site's first chart (since 2026-10-18 in the fuel site's navy "deep space" look: captured with headless Chrome at a 900 px-wide window, 2x scale, the panel's heading text hidden, a 16:9 area of the chart panel ending just above its bottom edge, scaled to 800x450), so refresh it now and then. A project with no `url` gets a card with no button (used for projects with no public page, such as a private repo).
- A tag is a plain string (blue pill), or `{ label, color }` for a coloured pill. Status tags: green for live, finished work that is still kept up to date ("Actively maintained") or built work in its final long-run test ("Endurance testing"); amber for anything still under way ("In progress", "Prototyping", "In testing", "Re-designing", "Under construction", "Scenario testing"); grey for finished work that needs no changes ("Complete"). Current (2026-10-08, the owner's calls): fuel and towing "Actively maintained", DMR hotspot "Endurance testing", SHERP crawler and battery monitor "Prototyping", RC remote "Re-designing", winch sizing and ropes "Under construction", tyre pressures "Scenario testing" (since 2026-10-12), EV vs Fuel Cost "In testing" (since 2026-10-13). To add another colour, add a `.tags li.tag--<color>` rule in `css/style.css`.
- Order in the array = order on the page.
- **Tools vs projects:** `kind: "tool"` puts a card in the **Tools** section (`#tool-grid`, above Projects): online tools people use, currently the fuel site, the towing checker, the 4x4 tyre pressure calculator, the winch & recovery sizing calculator, Ropes and Shackles, EV vs Fuel Cost (evcost.psyphin.co.za, since 2026-10-13) and Which Two-Way Radio? (radio.psyphin.co.za, since 2026-10-23, amber "Under construction"). Everything else is a build project in **Projects** (`#project-grid`). Both tools' header pills read "← More PsyPhin tools" and link to `https://psyphin.co.za/#tools`; a new tool should do the same.
- A project's URL lives **only** in `projects.js`. To move a project to a new address, change its `url` there. Nothing else on this site needs updating.

Cards are built by `js/main.js` with `textContent`, so project text is never interpreted as HTML.

## Editing content

- The home page is intentionally just the logo + Tools + Projects. To add a new section (e.g. About/Skills), copy the `<section class="section">` pattern in `index.html` - the `.section` styles and `h2` treatment apply automatically - and add a matching link in the header `<nav>`.
- **Project source material** (raw photos, notes, build logs, screenshots) lives **outside this repo** in `E:\Claude_projects\<Project>` (e.g. `DMR`, `Sherp_Build`). Only web-ready output (optimised photos, the page) comes into the repo. This repo is public, so anything committed here is published and stays in the history.
- **Project pages** live in their own folder (`dmr-hotspot/index.html`), served at `psyphin.co.za/<folder>/`. To add one:
  1. Copy an existing project folder and rename it: lowercase with hyphens, because URLs are case-sensitive. The name must not match another psyphin234 Pages repo.
  2. In `projects.js`, set that project's `url` to `"<folder>/"` and `cta: "View project"`.
  3. In the page, set `data-project="<folder>/"` on the `.project-head`. Its title and tags then come from `projects.js`, so a status change updates the card and the page together.
  4. Update the page's `<title>`, description and `og:url`.
  - Every path in a project page starts with `../`: styles, scripts, logo, favicons and nav links.
  - **Photos:** never commit camera originals. Run `tools/optimize-photos.py` into `<folder>/img/`; it strips EXIF, which can hold GPS location. The gallery shows `-800.jpg` and links each to `-1600.jpg`, using `<figure>` + `<figcaption>`. Diagrams use `<img class="diagram">`. Tables go inside `<div class="table-wrap">` so they scroll on phones instead of widening the page. The `.placeholder` box is for pages with no photos yet.
  - **DMR hotspot source:** the write-up comes from `E:\Claude_projects\DMR\README.md` (plus its `Photos/`, `diagrams/` and `config/`), which is outside this repo. When that README changes, update the page to match. Keep credentials out: the config excerpt omits passwords, and the "rotate BrandMeister password" to-do is deliberately not published.
    - Page order: plain-language intro and status for non-technical readers, then photos, then "Build your own: step by step", then **Technical details** at the bottom.
    - Owner's rules: **no talkgroup configuration** (the README and diagram's TG details are left out, and the diagram copy here has "TG655" removed), **no location** (the town was removed), frequencies only **433.300 MHz (hotspot RX) / 438.300 MHz (hotspot TX)** (anything else in old notes is outdated), callsign ZR6KW is fine.
    - Dashboard screenshots can show other operators' callsigns, names and towns: cover them before publishing (`dashboard-live-call` has the caller's name and town covered). `Dashboard1.png` in the DMR folder has not been reviewed, so it isn't published.
    - Current state (2026-09-27): a 3 A-rated Micro-USB cable appears to have fixed the under-voltage; GPIO power injection was tried and removed (it bypasses the Pi's input protection); intermittent modem lock-ups remain; the WPSD Services Watchdog still needs fixing; TX calibration needs an RTL-SDR. Status tag: amber "In testing".
  - **Inline image groups:** `<figure class="figs">` holds one or more `<img>` (no cropping; two per row on wide screens, one on phones) plus an optional `<figcaption>`; add `class="wide"` to an image to span the full width. Use this for build-log style pages. `.gallery` (cropped 4:3 thumbnails that link to large versions) suits photo sets.
  - **RC SHERP Crawler source:** `E:\Claude_projects\Sherp_Build` (`sherp-crawler-build-log.md` + `photo-map.md` + forum image downloads). Sources are small forum copies, so only `-800.jpg` versions are kept. Videos (owner's YouTube) show as thumbnail links (`<a class="video">`, thumbnails saved as `img/video-<id>.jpg`), never embedded players, to keep the site free of third-party cookies. Not published: the "inside the body" photo and drivetrain/weight-planning images (not in the folder), vendor spec/shop screenshots, and two Land Cruiser RC photos that aren't part of this build (one shows a number plate). Shop names were dropped from prices.
  - **Caravan Battery Monitor source:** `E:\Claude_projects\Battery monitor` (a draft `index.html`, `battery-monitor.yaml`, `crank_tester.ino`, photos). The page was ported from that draft into the site's style. The draft's footer (the owner's full name and city) is deliberately left out. The page includes an interactive recreation of the device's OLED screen (`.oled-module` + inline SVG, with Roboto and VT323 loaded on that page only), an inline SVG chart (`figure.chart`), OK/Weak/Bad labels (`.result--ok/weak/bad`) and collapsible code listings (`details.code` with `data-copy-from` copy buttons).
    - **Owner's framing:** it's a *monitor* only, not a charger. Its percentage is for LiFePO4, not other lithium-ion types, and it needs a current shunt (planned) to work fully. A notice near the top of the page says this; keep it. Status: amber "In progress" until the shunt is fitted.
    - **Secrets rule:** the ESPHome config shown on the page must keep every Wi-Fi password as a `!secret` reference (the source YAML does, since 2026-09-28). The secrets.yaml template on the page has placeholder values only. The fallback hotspot name `Caravan-Battery-Fallback` is public by design. Check the code listings for real SSIDs and passwords before every publish.
  - **ESP32 RC Remote source:** `E:\Claude_projects\Remote control` (`New Text Document.md` + five WhatsApp photos). The notes were rewritten in the site's plain voice (their LaTeX-style units turned into plain text). They stop after the data-packet struct, so the full firmware isn't published; add it if the owner supplies it. Status amber "In progress" is a placeholder until the owner confirms.
  - Links on psyphin.co.za or any of its subdomains (relative, `https://psyphin.co.za/...`, `https://fuel.psyphin.co.za/` or `https://towing.psyphin.co.za/`) open in the same tab without the ↗ arrow; the tools have their own "← More PsyPhin tools" button back. Only other sites' `https://` urls open a new tab with the arrow.
  - Preview project folders with `python -m http.server`. Opening from disk shows a folder listing, because `dmr-hotspot/` doesn't resolve to `index.html` there.
  - The Patient Monitor Smartwatch card and page (`patient-monitor/`) were removed on 2026-09-27; restore them from git history if needed. If it comes back, keep its "Hobby project, not a medical device" notice (`.notice`) and never describe it as clinically useful. Its code repo (`psyphin234/patient_Monitor`) is private.
- **New pages:** copy `contact.html` as the template (head, header, compact logo, footer, scripts). Every page's header `<nav>` must list the same links, with `aria-current="page"` on the current one, and every page loads `js/main.js` and the GoatCounter tag.
- **Contact email:** to hide it from spam bots, `contact.html` never contains a plain `info@psyphin.co.za`. Elements carry `data-user="info" data-domain="psyphin.co.za"` (three places), and `js/main.js` builds the address at runtime: `mailto:` on links, the visible text where `data-email="text"`, and `data-copy` on the button. To change the address, edit `data-user` in all three. Don't write a plain address anywhere in the HTML.
- **Look and motion** ("deep space", since 2026-10-18, owner's request, the same as fuel.psyphin.co.za, towing.psyphin.co.za (2026-10-18), evcost.psyphin.co.za, winching.psyphin.co.za, ropes.psyphin.co.za and tyres.psyphin.co.za (2026-10-19): every tool now): navy page, slow-drifting blue/violet light (`body::after`), and a glowing circuit board drawn by `js/circuit.js` on two fixed `canvas.circuit-fx` (traces routed to fit the screen, light pulses running along them, a glow around the mouse; ~30 fps, paused in a background tab). circuit.js adds `.fx-circuit` to `<html>`, which hides the static glowing circuit tile in `body::before` (the fallback without JavaScript). Cards and the contact card are translucent glass (`--glass` + backdrop blur) with a glowing top edge; buttons are cyan gradient pills with a sheen on hover; section headings are Sora capitals with a white-to-cyan gradient. Project pages put a dark band behind their text (`.section:has(.prose)`) so the circuit doesn't run through it. `.hero::before` is a soft blue/violet glow that fades in and slowly breathes behind the logo (clipped sideways so it can't widen a phone screen), which uses `mix-blend-mode: screen` so its black background disappears. The hero logo is kept small so the Tools cards show without scrolling (since 2026-10-18, owner's request: at most 420 px wide, 70% on phones; 320 px on the contact page's compact hero), with the first section pulled up close under it (`.hero + .section`); keep the `<img>` `sizes` attributes in step if these change. The header is sticky: `js/main.js` adds `body.scrolled` after 40 px, which darkens it and shows the `.brand` mark (shield + PsyPhin). Every page's header has the `.site-header-inner` > `.brand` + `.nav` structure. Cards fade up as they come into view (`.reveal` / `.is-visible`), with a fail-safe that shows them after 2 s. All motion is off for visitors who prefer reduced motion (the circuit is drawn once and stays still).
- **Colours/fonts:** CSS variables in `:root` at the top of `css/style.css`, the same values as the fuel site: `--bg` navy `#040817`, `--accent` cyan `#4cc9ff`, `--violet` `#7c5cff`. The hero logo and the header's brand icon blend into any background (`screen` / `lighten`), so `--bg` no longer has to match the logo's black.

## Conventions

- The brand name is written **PsyPhin** (capital P, lowercase sy, capital P, lowercase hin) in all visible text: titles, meta tags, alt text and footers. Domains and URLs stay lowercase (`psyphin.co.za`).
- **Commit identity:** commits use the GitHub private address `74655215+psyphin234@users.noreply.github.com` (set globally in git on this PC, 2026-09-27). Never commit with a personal email: in 2026-09 the history of this repo was rewritten to remove it. Old-history backups are in `E:\Claude_projects\_git-backups-2026-09-27\` (local only; never push them).
- **Backups:** the Windows Scheduled Task **"Project Backup"** runs `E:\Backup\Project_Backups\backup-projects.ps1` nightly at 02:00. It copies all of `E:\Claude_projects` (including local-only data such as the fuel site's `data\bfp.db` and the project source folders) to `E:\Backup\Project_Backups\latest\` (adds and updates, never deletes) plus a dated zip in `daily\` (newest 14 kept); log in `backup.log`. `E:\Backup` is in turn backed up to the owner's NAS, so a disk failure is covered too (and the code is also on GitHub).
- Keep paths **relative** (`css/style.css`, not `/css/style.css`) so the page also works when opened directly from disk.
- The only absolute URLs are the Open Graph tags in `<head>` (these need the full `https://psyphin.co.za/...`).
- Mobile-first check: layout must fit at 390px wide with no horizontal scroll.
- Fonts come from Google Fonts (Sora for headings, nav and buttons since 2026-10-18, Rajdhani before; Inter for body) with system-font fallbacks.
- Visitor stats: GoatCounter (cookie-free, no consent banner needed), with the script tag just before `</body>` on every page. The dashboard is https://psyphin.goatcounter.com/ and is shared with the fuel site; pages are told apart by path. `/` is the landing page, `/contact.html` the contact page, `/dmr-hotspot/`, `/sherp-crawler/`, `/battery-monitor/` and `/rc-remote/` the project pages, the towing checker, the tyre calculator (their own repos) and the fuel site prefix their paths with their host (`towing.psyphin.co.za/`, `tyres.psyphin.co.za/`, `fuel.psyphin.co.za/`); the tyre calculator was added 2026-10-08. The winch calculator (2026-10-11) has the same host prefix: its visits show as `winching.psyphin.co.za/` (since 2026-10-12; earlier ones under `psyphin.co.za/winch-recovery-sizing/`). Older visits are under `/sa-towing-check/` (towing, before 2026-10-05) and `/sa-fuel-price-preview/` (fuel, before 2026-09-27). Don't add it to the PCB site.

## Changing the logo

Replace `psyphin-logo-black.jpg`, then run `python tools/optimize-images.py`. If the new logo's composition differs, adjust `SHIELD_BOX` (crop for the pinned-header icon) and `FAVICON_BOX` (crop of `psyphin-logo.jpg` for the favicons) in that script, and the `width`/`height` attributes on the hero `<img>` in `index.html` to match the new aspect ratio.

## Preview locally

Open `index.html` in a browser, or run `python -m http.server` and visit http://localhost:8000.

## Deploying

Push to `main`. GitHub Pages redeploys automatically (usually within a minute or two).

## Domain, DNS and HTTPS (set up 2026-09-27)

- DNS is at **Afrihost** (ClientZone). Nameservers: `ns.dns1.co.za`, `ns.dns2.co.za`, `ns.otherdns.com`, `ns.otherdns.net`.
- Records for the site:
  - `@` A → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - `www` CNAME → `psyphin234.github.io.`
  - `fuel` CNAME → `psyphin234.github.io` (the SA Fuel Price Preview site; see below)
  - `towing` CNAME → `psyphin234.github.io` (SA Towing Check; added 2026-10-05)
  - `tyres` CNAME → `psyphin234.github.io` (4x4 Tyre Pressures, repo `psyphin234/sa-tyre-pressures`; added 2026-10-08)
  - `winching` CNAME → `psyphin234.github.io` (Winch & Recovery Sizing, repo `psyphin234/winch-recovery-sizing`; added 2026-10-12)
  - `ropes` CNAME → `psyphin234.github.io` (Ropes and Shackles, repo `psyphin234/ropes-recovery-gear`; in place by 2026-10-12)
  - `radio` CNAME → `psyphin234.github.io` (Which Two-Way Radio?, repo `psyphin234/which-two-way-radio`; in place by 2026-10-23)
  - `_github-pages-challenge-psyphin234` TXT → the verification code shown at https://github.com/settings/pages. Removing and re-adding the domain there generates a **new** code, and the TXT value must then be updated.
  - `psyphin.co.za` TXT → `google-site-verification=…` (added 2026-10-14): proves ownership of the Google Search Console **Domain** property, which covers every subdomain. Keep it; removing it un-verifies the property. It's a separate TXT record, not part of SPF.
- Mail records (MX, `mail`, `webmail`, `cpanel`, SPF, DMARC, autodiscover) still point at Afrihost. Don't touch them when editing web records. There is **no `*` wildcard record**: it was deleted on 2026-09-27, so a subdomain without its own record simply doesn't resolve. Before that, it sent unknown subdomains to Afrihost's parking page, which has a certificate for someone else's domain and so triggered "not secure" warnings. A catch-all redirect to the landing page isn't possible with GitHub Pages plus Afrihost DNS (it would need a proxy such as Cloudflare), and it was judged not worth a DNS migration. Every new subdomain needs its own record.
- Afrihost's DNS form wants the **full** hostname, for example `fuel.psyphin.co.za` rather than just `fuel`; it rejects names shorter than 5 characters.
- Enforce HTTPS is on. GitHub issues and renews the Let's Encrypt certificate for `psyphin.co.za` and `www.psyphin.co.za` automatically. If a certificate is ever stuck, go to repo Settings → Pages, clear the Custom domain, save, re-enter `psyphin.co.za` and save again.
- Check status: `gh api repos/psyphin234/psyphin234.github.io/pages` and `.../pages/health`.

## Other GitHub Pages repos live under this domain

Because this is the `psyphin234.github.io` **user site** with a custom domain, **every other psyphin234 repo with Pages enabled (and no CNAME of its own) is automatically served at `https://psyphin.co.za/<repo-name>/`**. The old `psyphin234.github.io/<repo-name>/` address 301-redirects there.

- Don't create files or folders here whose names match another Pages repo (for example `sa-fuel-price-preview/`), or the paths will clash.
- Removing the custom domain or `CNAME` from this repo moves every project site back to `psyphin234.github.io/...`.
- A new project hosted on Pages gets its URL for free. Add its card to `projects.js` using `https://psyphin.co.za/<repo-name>/`.

### PCB Consulting (not part of this site)

`psyphin234/pcb-consulting-website` (local clone `E:\Claude_projects\Pieter_Website`) is a **separate client site**. It's only stored in this account until its own domain becomes available (waiting for it to expire from the previous web developer). Because of the inheritance above, it's currently reachable at `psyphin.co.za/pcb-consulting-website/`. That's a side effect, not intended.

- Don't link to it, add it to `projects.js`, or add PsyPhin tracking or branding to it.
- When its domain arrives, set that domain as the custom domain in *its* repo's Settings → Pages (plus DNS at its registrar), and it stops using psyphin.co.za. If it's needed off psyphin.co.za sooner, move the repo to a free GitHub organisation.

### Winch & Recovery Sizing

- Repo `psyphin234/winch-recovery-sizing` (public, since 2026-10-11), local folder `E:\Claude_projects\Winch_Calc`, which has its own CLAUDE.md. **Do winch-calculator work from that folder.**
- Lives at **https://winching.psyphin.co.za/** since 2026-10-12 (its own `CNAME` plus the Afrihost `winching` CNAME; HTTPS enforced). The first address, `psyphin.co.za/winch-recovery-sizing/`, redirects there. Don't create a `winch-recovery-sizing/` folder here.
- Card title **Winch Planning and Sizing** since 2026-10-12 (owner's call; it was "Winch & Recovery Sizing"). The tool's own pages use the same name.
- Finished (owner, 2026-10-14): banner and noindex removed from its pages, card tag green "Actively maintained" (amber "Under construction" before). Card image `assets/img/projects/winch-recovery-sizing.jpg` is the owner's own photo of a winch (black, synthetic rope with red flecks, aluminium hawse fairlead) since 2026-10-26, owner's request: `E:\Claude_projects\Winch_Calc\img\winch.jpeg` (1024x768, no EXIF) cropped to 1024x576 from y=30 and scaled to 800x450. Before that it was the calculator's own side-view picture (a 4x4 bogged in mud on a slope, double line to a tree), and before 2026-10-12 the rope diagram.

### Ropes and Shackles

- Repo `psyphin234/ropes-recovery-gear` (public), local folder `E:\Claude_projects\Ropes_Recovery`, which has its own CLAUDE.md. **Do ropes-page work from that folder.** Lives at **https://ropes.psyphin.co.za/** (its own `CNAME` plus the Afrihost `ropes` CNAME).
- Card added 2026-10-12 at the owner's request, titled **Ropes and Shackles**; the page uses the same name (it was "Ropes & Recovery Gear" until 2026-10-12). Finished (owner, 2026-10-14): banner and noindex removed from its pages, card tag green "Actively maintained" (amber "Under construction" before). Card image `assets/img/projects/ropes-recovery-gear.jpg` is the page's own side-view scene (stuck 4x4 sunk in sand, kinetic rope tight, a safety lanyard at each end), rendered at 800x450 with extra sky for the 16:9 crop. On 2026-10-26 it was briefly replaced by a drawn flat lay of shackles and a tow strap; the owner didn't like it and had the scene put back the same day, so don't swap in a made-up drawing again without showing it first.
- Its visits show in GoatCounter as `ropes.psyphin.co.za/` (host-prefix snippet).

### 4x4 Tyre Pressures

- Lives at **https://tyres.psyphin.co.za/** since 2026-10-08 (its own `CNAME` plus the Afrihost `tyres` CNAME). Repo `psyphin234/sa-tyre-pressures`, local folder `E:\Claude_projects\Tyre_Pressures`, which has its own CLAUDE.md. **Do tyre-calculator work from that folder.**
- Finished (owner, 2026-10-14): banner and noindex removed, card tag green "Actively maintained" (amber "Scenario testing" from 2026-10-12, "Under construction" before). Card image `assets/img/projects/sa-tyre-pressures.jpg` is an 800x450 crop of the owner's own red-dune photo (Amam Dunes, Northern Cape; original `Pics/DeepSand.jpg` in the tyre project, saved without EXIF because the original has GPS).

### SA Towing Check

- Lives at **https://towing.psyphin.co.za/** since 2026-10-05. It has its own custom domain (a `CNAME` file in its repo, plus the Afrihost `towing` CNAME), so it no longer inherits psyphin.co.za; the older `psyphin.co.za/sa-towing-check/` address 301-redirects to it. Repo `psyphin234/sa-towing-check`, local clone `E:\Claude_projects\tow_gvm_calc\sa-towing-check`, which has its own CLAUDE.md; the build brief is `E:\Claude_projects\tow_gvm_calc\SPEC.md`, kept out of the repo. **Do towing-checker work from that folder.**
- Its header has a "← More PsyPhin tools" pill (same design as the fuel site's) linking to `https://psyphin.co.za/#tools`. Its favicon set is a copy of this site's; change both together.
- Card image `assets/img/projects/sa-towing-check.jpg` is a crop of the checker's rig diagram (worked example plus illustrative weighbridge readings), recaptured in the navy look on 2026-10-18 (headless Chrome at 2x, the panel's heading and table hidden). Status: green "Actively maintained" (since 2026-10-08, the owner's call).

### SA Fuel Price Preview

- Lives at **https://fuel.psyphin.co.za/**. It has its own custom domain (a `docs/CNAME` file in its repo, plus the Afrihost `fuel` CNAME), so it no longer inherits psyphin.co.za. The older `psyphin.co.za/sa-fuel-price-preview/` and `psyphin234.github.io/sa-fuel-price-preview/` addresses 301-redirect to it.
- Repo `psyphin234/sa-fuel-price-preview`, local clone `E:\Claude_projects\BFP_Website`, which has its own CLAUDE.md. **Do fuel-project work from that folder, not this one.**
- Its header has a "← More PsyPhin tools" pill linking to https://psyphin.co.za/#tools.
- That repo is auto-committed and pushed hourly at about :18 by a scheduled Python task. Read its CLAUDE.md before touching it, and never kill `python.exe` processes by image name.
- The same pattern works for any future project subdomain: add an Afrihost CNAME `<name>.psyphin.co.za` → `psyphin234.github.io`, set the custom domain in that repo's Settings → Pages (then `git pull` the `CNAME` file GitHub commits), turn on Enforce HTTPS once the certificate is issued, and update `projects.js` here.

## Email (set up 2026-09-27)

- **Receiving:** ImprovMX (free) forwards mail for `*@psyphin.co.za` (catch-all) to the owner's Gmail. MX records: `mx1.improvmx.com` (10), `mx2.improvmx.com` (20).
- **Sending:** Brevo (free, about 300 emails a day) as Gmail's "Send mail as" SMTP. DNS: `brevo-code` TXT and DKIM CNAMEs `brevo1._domainkey` and `brevo2._domainkey`.
- **SPF:** `v=spf1 include:spf.improvmx.com include:spf.brevo.com ~all`. A domain may have only **one** SPF record; merge new senders into it.
- **DMARC:** `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com; fo=0; adkim=s; aspf=s`. Reports show in Brevo's dashboard. Never add a second `_dmarc` record.
- Afrihost's Domain Parking package includes **no** mailboxes. The old Afrihost mail records (`mail`, `webmail`, `autoconfig`, `autodiscover`, SRV, `mailconf`) and `cpanel`/`ftp` were deleted as dead.

## Security reminders (to do)

- [ ] **From about 2026-10-18 (3 weeks after setup): tighten DMARC.** Check Brevo's DMARC reports first. Only step up if all legitimate mail (sent via Brevo) passes DKIM.
  1. Change `_dmarc` to `p=quarantine` (keep the other tags). Watch for about 2 weeks.
  2. Then change it to `p=reject`.
  3. At the same time, change SPF's `~all` to `-all`.
  - If you ever add another sending service (for example a newsletter tool), add it to SPF and set up its DKIM **before** tightening, or its mail will be rejected.
- [ ] **Turn off catch-all once the addresses in use are known.** In ImprovMX, replace the `*` alias with specific aliases (for example `info@` plus the owner's personal address). Anything else will then bounce instead of reaching Gmail as spam. Keep the contact page's address in the alias list.
- [ ] **Account security (owner's side):**
  - GitHub 2FA is on (2026-09-27).
  - Still to confirm: 2FA and unique passwords on Afrihost ClientZone, Gmail, ImprovMX and Brevo.
  - Turn on domain **auto-renew** at Afrihost (expires 26 Sep 2027).
- [ ] Optional: add a CAA record `psyphin.co.za CAA 0 issue "letsencrypt.org"`, so only Let's Encrypt (which GitHub Pages uses) can issue certificates.
- [ ] Optional: replace this PC's `gh` login (full `repo` scope, used by the hourly fuel publish job) with a fine-grained token limited to `psyphin234/sa-fuel-price-preview`.

## Search (SEO)

Set up 2026-10-13, following the [Runbook: SEO for Small Sites & Tools](https://claude.ai/code/artifact/0e4d5503-7f20-4cb5-a25b-840f4caa3545). The `<title>` leads with the tool's name and adds the words people search for; the meta description is at most 155 characters (Google cuts the rest). Every page has a canonical link; `index.html` has `Organization` + `WebSite` JSON-LD and a visually hidden `<h1>` (the logo is the visible heading). Add a new page to `sitemap.xml` and give it a canonical link. Since 2026-10-14 every other page has one visible `<h1>` (its title; `js/main.js` builds project titles as `<h1>`, and `.section h1` is styled like `.section h2`), project pages have `TechArticle` JSON-LD and `contact.html` has `ContactPage` JSON-LD; keep the JSON-LD description the same as the meta description. `robots.txt` and `sitemap.xml` are at the site root: **update the sitemap's `lastmod` when a page's content changes.** Indexable.
