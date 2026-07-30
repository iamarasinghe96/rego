# VehicleVault

Vehicle registration, insurance, service history and medical details in one
place — with a **Police Check** screen designed to be handed to an officer at a
roadside stop.

Live at: `https://iamarasinghe96.github.io/rego/`

## Screens

| Tab              | Contents                                                                        |
| ---------------- | ------------------------------------------------------------------------------- |
| **Police Check** | Everything an officer needs on one screen — driver, vehicle, CTP, documents |
| **Owner**        | Name, DOB, licence number, class, conditions, expiry, address, photo         |
| **Vehicle**      | Rego, state, expiry, registered operator, make/model/year, VIN, engine        |
| **Insurance**    | CTP green slip and comprehensive policy details                               |
| **Service**      | Service history with odometer, workshop, cost, and next-service tracking      |
| **Medical**      | Blood type, allergies, conditions, medications, and medical certificates      |

Every tab is read-only except **Service**. Expiring or expired documents raise
an amber dot on the relevant tab.

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

Committed documents are linked from the Police Check screen. The section stays
hidden until at least one file exists.

> ⚠️ **These files become public.** Anything in `public/` is deployed with the
> site and readable by anyone with the URL, and this repo is public so the file
> is also visible on GitHub — permanently, since git keeps history even after a
> delete. Registration and insurance documents contain your full name, address,
> licence number and VIN.

## The "Show my licence" button

The Police Check and Owner screens have a button that opens your real NSW
Driver Licence in the Service NSW app. Service NSW publishes no URL scheme, so
the button runs an iOS Shortcut instead:

```
shortcuts://run-shortcut?name=Show%20driver%20licence
```

The name in that URL must match the Shortcut on your device **exactly**. It's
set in [`src/config/shortcuts.js`](src/config/shortcuts.js):

```js
export const LICENCE_SHORTCUT = {
  name: 'Show driver licence',   // ← rename here if yours differs
  ...
};
```

The Shortcut itself is a single **Open App → Service NSW** action. Tapping
"Button not working?" under the button links to the shared copy at
`icloud.com/shortcuts/88d6c6a293314a8aade3546627173d95`.

Being a Shortcut, it only works on iPhone/iPad — on desktop the button explains
that instead.

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

## Editing your details

Everything except the service log is hardcoded in
[`src/config/profile.js`](src/config/profile.js) — driver, vehicle, CTP,
insurance and medical. The app displays it read-only; to change a detail, edit
that file and push. The deploy workflow rebuilds the site automatically.

The **Service** tab is the one exception: records are added in the app and
saved to `localStorage` on that device, so logging a service doesn't require a
commit. They don't sync between devices and are cleared with site data.

## Where your data lives

The hardcoded profile ships inside the site's JavaScript bundle. Service
records live in `localStorage` on your device. There is no server and no
account.

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

## Locking the site down

GitHub Pages has no access control — it is public even when the repo is
private. To gate the app, move it to Vercel and let edge middleware
authenticate every request.

**Order matters.** Gating Vercel achieves nothing while the public copies are
still up, so do these in sequence:

### 1. Take down the public copies first

- **Settings → Pages → Source → None.** This unpublishes
  `iamarasinghe96.github.io/rego/`.
- **Settings → General → Danger Zone → Change visibility → Private.**
- Delete `.github/workflows/deploy.yml` so Pages isn't republished.

### 2. Purge the details from git history

Making the repo private hides history from the public, but every past commit
still contains the profile and the PDFs. If you want them gone outright:

```bash
pip install git-filter-repo
git filter-repo --path src/config/profile.js --path public/documents --invert-paths --force
git push --force
```

### 3. Deploy to Vercel behind a password

1. [vercel.com/new](https://vercel.com/new) → import the repo. The Vite preset
   and `vercel.json` are picked up automatically.
2. **Settings → Environment Variables**, for Production *and* Preview:

   | Name            | Value                       |
   | --------------- | --------------------------- |
   | `SITE_USER`     | any username                |
   | `SITE_PASSWORD` | a long random passphrase    |

3. Redeploy. `middleware.js` now challenges every request.

### 4. Verify the gate actually holds

The test that matters is the PDF, not the homepage — a gate that misses static
files leaks the documents directly:

```bash
curl -o /dev/null -w '%{http_code}\n' https://<your-app>.vercel.app/                      # 401
curl -o /dev/null -w '%{http_code}\n' https://<your-app>.vercel.app/documents/ctp.pdf     # 401
curl -o /dev/null -w '%{http_code}\n' -u user:pass https://<your-app>.vercel.app/         # 200
```

Three 401s before credentials and a 200 after means the gate covers the whole
site. Anything returning 200 unauthenticated is a leak.

### What this does and doesn't do

The middleware runs before any file is served, so the JS bundle holding your
details is never sent to an unauthenticated visitor. It does **not** retroactively
protect anything already published — treat data that was public as compromised.

Alternatives, both stronger on identity:

- **Vercel Password Protection** (Pro, $20/mo) — same thing without the
  middleware, configured in the dashboard.
- **Cloudflare Access** (free up to 50 users) — real per-person login by email
  code or Google, revocable, with an audit log. Better if more than one person
  needs access.

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # serve the built site
```

Pushing to the deploy branch triggers `.github/workflows/deploy.yml`, which
builds and publishes to GitHub Pages.
