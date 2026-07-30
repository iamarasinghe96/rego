# VehicleVault

Vehicle registration, insurance, service history and medical details in one
place — with a **Police Check** screen designed to be handed to an officer at a
roadside stop.

Live at: `https://iamarasinghe96.github.io/rego/`

## Screens

| Tab              | Contents                                                                        |
| ---------------- | ------------------------------------------------------------------------------- |
| **Police Check** | Read-only summary with VALID/EXPIRED badges, documents, and medical information |
| **Owner**        | Name, DOB, licence number and expiry, address, photo                            |
| **Vehicle**      | Rego number, state, expiry, make/model/year/colour, VIN, engine number          |
| **Insurance**    | Provider, policy number, coverage, dates, claims line                           |
| **Service**      | Service history with odometer, workshop, cost, and next-service tracking        |
| **Medical**      | Blood type, allergies, conditions, medications, and medical certificates        |

Expiring or expired documents raise an amber dot on the relevant tab.

## Adding registration & insurance PDFs

Drop files into `public/documents/` using these names and they appear
automatically — in the relevant tab and on the Police Check screen:

| Filename           | Appears as                      |
| ------------------ | ------------------------------- |
| `registration.pdf` | Registration Papers             |
| `insurance.pdf`    | Certificate of Currency         |
| `ctp.pdf`          | CTP / Green Slip                |
| `roadworthy.pdf`   | Safety / Roadworthy Certificate |

```bash
cp ~/Downloads/my-rego.pdf public/documents/registration.pdf
git add public/documents/registration.pdf
git commit -m "Add registration document"
git push
```

> ⚠️ **These files become public.** Anything in `public/` is deployed with the
> site and readable by anyone with the URL, and this repo is public so the file
> is also visible on GitHub — permanently, since git keeps history even after a
> delete. Registration and insurance documents contain your full name, address,
> licence number and VIN.
>
> The alternative is the **Upload** button inside the app. Those files are
> stored in your browser's IndexedDB on that one device and never leave it —
> nothing is uploaded anywhere. The tradeoff is they don't sync between devices
> and are lost if you clear site data.

## Opening it with Siri

Siri can't open a website by name the way it opens the Service NSW app, but a
Shortcut gives you the same result — including the same "Hey Siri, show my
rego" phrasing.

**1. Add it to your home screen** (do this first so it opens full-screen
without Safari's toolbars):

- Open the site in **Safari** on iPhone
- Tap **Share** → **Add to Home Screen** → **Add**

**2. Create the Shortcut:**

- Open the **Shortcuts** app → **+**
- Add the action **Open URL** (search "URL")
- Paste: `https://iamarasinghe96.github.io/rego/#police`
- Tap the shortcut name at the top → **Rename** → call it **Show my rego**
- Optionally **Add to Home Screen** from the same menu

**3. Use it:** say *"Hey Siri, show my rego"*.

The shortcut name **is** the Siri phrase, so pick whatever you'll actually say
— "show my rego", "show my registration", "show my licence details".

### Deep links

Any tab can be opened directly, so you can make several shortcuts:

| URL                 | Opens           |
| ------------------- | --------------- |
| `.../rego/#police`  | Police Check    |
| `.../rego/#owner`   | Owner details   |
| `.../rego/#service` | Service history |
| `.../rego/#medical` | Medical details |

## Offline

A service worker caches the app and any documents you've opened, so the Police
Check screen still works with no signal. Open each document once while online to
have it cached.

## Where your data lives

Starting details are hardcoded in [`src/config/profile.js`](src/config/profile.js)
and ship with the site. Any edits you make in the app are saved to
`localStorage`, and documents uploaded via the app's **Upload** button go to
IndexedDB — those two stay on your device. There is no server and no account.

### Removing the hardcoded details

Blanking the values in `src/config/profile.js` clears them from the live site,
but **not** from git history — every past commit still contains them. To remove
them properly:

```bash
# rewrite history, then force-push
git filter-repo --path src/config/profile.js --invert-paths
```

Anyone who cloned or viewed the repo before that still has the data, and GitHub
caches views for a while. If the details are sensitive, changing the licence is
the only true remedy — treat publication as permanent.

### Keeping the site private

GitHub Pages is public even for private repos. To put the app behind a login,
deploy to Cloudflare Pages with Cloudflare Access, or Netlify with password
protection, instead of GitHub Pages.

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # serve the built site
```

Pushing to the deploy branch triggers `.github/workflows/deploy.yml`, which
builds and publishes to GitHub Pages.
