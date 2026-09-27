# psyphin.co.za

Personal landing page for Psyphin, hosted on GitHub Pages from the `psyphin234/psyphin234.github.io` repo (branch `main`, root folder) at the custom domain **psyphin.co.za**.

Plain static HTML/CSS/JS. **No build step, no framework, no bundler.** Whatever is committed is what's served.

## Structure

```
index.html              Page markup: hero logo, Projects, footer
projects.js             THE project list (window.PROJECTS). Edit this to add/change projects.
js/main.js              Renders project cards from window.PROJECTS; sets footer year
css/style.css           All styles. Colours are CSS variables at the top of the file.
assets/img/             Web-optimised logo (logo-{480,800,1200}.{webp,jpg}) + og-image.jpg
favicon.ico             16/32/48px favicon, cropped from the "P" in the logo
favicon-32.png          PNG favicon
apple-touch-icon.png    180px iOS home-screen icon (full shield)
psyphin-logo-black.jpg  Source logo used to generate everything in assets/img and the favicons
psyphin-logo.jpg        Alternative white-background logo (not used on the site)
tools/optimize-images.py  Regenerates images/favicons from the source logo (needs Pillow)
CNAME                   Custom domain for GitHub Pages - must contain only: psyphin.co.za
.nojekyll               Tells GitHub Pages to serve files as-is (skip Jekyll)
```

## Adding a project

Add **one line** to the array in `projects.js`:

```js
{ title: "My New Thing", description: "What it does in a sentence.", url: "https://example.com", cta: "Open", tags: ["Tag"] },
```

- `title`, `description`, `url` are required; `cta` (button text, default "Open") and `tags` are optional.
- Order in the array = order on the page.
- A project's URL lives **only** in `projects.js`. To move a project (e.g. SA Fuel Price Preview moving to `https://fuel.psyphin.co.za`), change its `url` there. Nothing else to update.

Cards are built by `js/main.js` with `textContent`, so project text is never interpreted as HTML.

## Editing content

- The page is intentionally just the logo + Projects. To add a new section (e.g. About/Skills), copy the `<section class="section">` pattern in `index.html` - the `.section` styles and `h2` treatment apply automatically - and add a matching link in the header `<nav>`.
- **Colours/fonts:** CSS variables in `:root` at the top of `css/style.css`. `--accent` is the circuit blue from the logo. `--bg` is deliberately almost pure black to match the logo image's background so the logo blends in. If you change `--bg`, the hero logo's edges will show.

## Conventions

- Keep paths **relative** (`css/style.css`, not `/css/style.css`) so the page also works when opened directly from disk.
- The only absolute URLs are the Open Graph tags in `<head>` (these need the full `https://psyphin.co.za/...`).
- Mobile-first check: layout must fit at 390px wide with no horizontal scroll.
- Fonts come from Google Fonts (Rajdhani for headings, Inter for body) with system-font fallbacks.

## Changing the logo

Replace `psyphin-logo-black.jpg`, then run `python tools/optimize-images.py`. If the new logo's composition differs, adjust `SHIELD_BOX` / `P_BOX` (crop areas for the icons) in that script, and the `width`/`height` attributes on the hero `<img>` in `index.html` to match the new aspect ratio.

## Preview locally

Open `index.html` in a browser, or run `python -m http.server` and visit http://localhost:8000.

## Deploying

Push to `main`. GitHub Pages redeploys automatically (usually within a minute or two).
