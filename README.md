# Aziz Holdings website

Static site (HTML, CSS, JS) plus one Cloudflare Pages Function for the contact form. No build step.

Pages: `index.html`, `pacs.html`, `gradeboost-pro.html`, `aask.html`, `aawf.html`, `404.html`.

## Add to your repo
Copy everything in this folder (including `functions/`) to the **repo root**, next to the existing `Assets/` folder. Asset filenames are case-sensitive on Cloudflare.

## Deploy on Cloudflare Pages
1. Workers & Pages > Create > Pages > Connect to Git, choose the repo.
2. Framework preset: None. Build command: empty. Output directory: `/`.
3. Deploy. You get a `*.pages.dev` address straight away.

## Make the contact form send email (real-time inbox)
The form posts to `/api/contact` (`functions/api/contact.js`), which emails the right division address through Resend.
1. Create a free Resend account and verify `azizholdings.pk`.
2. Pages project > Settings > Variables and Secrets, add `RESEND_API_KEY` (secret) and `MAIL_FROM` (e.g. `Aziz Holdings <no-reply@azizholdings.pk>`).
3. Redeploy.
Until this is set up, the form falls back to opening the visitor's email app, so no enquiry is lost.

## Connect a permanent domain
Pages project > Custom domains > Set up a domain. The canonical URLs, `sitemap.xml` and `robots.txt` assume `https://azizholdings.pk/`; change it if your domain differs (it is set once as `DOM` in the pages' head and in those two files).

## Things to review
- Office hours for the live open/closed badge: top of `main.js` (`days`, `open`, `close`). Currently Mon to Sat, 9 am to 6 pm Lahore time.
- Social media links are not included yet. Add them in the footer (`<footer>` in each page) once the accounts exist.
- Impact figures on the home page come from the AASK reference site. Edit `data-count` values to update.
