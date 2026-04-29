# PATRIOT Classified Game

A lightweight static microsite/game for the Malayalam film **PATRIOT** US release.

Includes:
- PATRIOT Psychological Assessment
- Operative profile result cards
- Escape the Surveillance Grid mini-game
- Mobile controls
- GitHub Pages-ready static files

## Files

```text
index.html
styles.css
script.js
README.md
```

## Run Locally

Open `index.html` directly in your browser, or run a simple local server:

```bash
python3 -m http.server 8080
```

Then visit:

```text
http://localhost:8080
```

## Deploy to GitHub Pages

1. Create a new GitHub repo, for example: `patriot-game`.
2. Upload these files to the repo root.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Save.
6. GitHub will publish the site at your Pages URL.

## Customize

### Ticket Link
In `index.html`, replace this placeholder:

```html
<a class="ticket-link" href="#" onclick="alert('Replace this link with your ticketing URL.'); return false;">BOOK TICKETS NOW</a>
```

with your actual ticketing link.

### Movie Branding
Add a poster or logo by editing the `hero-content` section in `index.html`.

### Questions / Results
Edit the `quiz` and `profiles` objects in `script.js`.

## Notes

This version uses no external backend and no build tools. It is intentionally simple so it can be deployed quickly via GitHub Pages, Netlify, Vercel, or Cloudflare Pages.
