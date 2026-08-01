# VehicleVault

Vehicle registration, insurance, service history and medical details in one
place — with a **Police Check** screen designed to be handed to an officer at a
roadside stop.

Builds to **one self-contained HTML file with no JavaScript** that runs
straight off your phone. No server, no hosting, no URL, no network access of
any kind. Your details never leave the device.

iOS previews local HTML with scripting disabled, so the page is rendered to
static markup at build time and the tabs are driven by CSS. The build refuses
to emit a file containing a `<script>` tag or any external reference.

## Building it

```bash
npm install
npm run build     # → dist/VehicleVault.html  (~2.2 MB)
```

Everything is inlined into that one file: the markup, the stylesheet, your
photo, and every page of both certificates. A successful build is proof the
file needs neither a network nor a script engine.

```bash
npm run dev       # local dev server while editing
```

## Getting it onto your iPhone

**AirDrop** `dist/VehicleVault.html` to your phone and save it to Files —
iCloud Drive if you want it on your iPad too. Tapping the file opens the app.

For a home-screen icon and Siri, wrap it in a Shortcut:

1. **Shortcuts** app → **+**
2. Add **Get File** — set the path to where you saved `VehicleVault.html`, and
   turn **Show Document Picker** off
3. Add **Quick Look**
4. Rename it **“Show my rego”**, then **Add to Home Screen** from the same menu

Now the icon opens it, and *“Hey Siri, show my rego”* works.

### What the Files preview can't do

Scripting is off there, which costs two things:

- **Service records can't be added in the app.** They're part of the profile
  now — add them to `service` in `src/config/profile.js` and rebuild.
- **The "Show my licence" button** may not launch Service NSW, since the
  preview can block app-launching links. Everything else works.

Both are consequences of opening a file rather than a web page. Hosting the app
privately restores them — see *Going back to hosting*.

## Screens

| Tab              | Contents                                                                    |
| ---------------- | --------------------------------------------------------------------------- |
| **Police Check** | Everything an officer needs on one screen — driver, vehicle, CTP, documents |
| **Owner**        | Name, DOB, licence number, class, conditions, expiry, address, photo        |
| **Vehicle**      | Rego, state, expiry, registered operator, make/model/year, VIN, engine       |
| **Insurance**    | CTP green slip details                                                      |
| **Service**      | Service history with odometer, workshop, cost, next-service tracking        |
| **Medical**      | Blood type, allergies, conditions, medications, medical certificates        |

Every tab is read-only. Expiring or expired documents raise an amber dot on
the relevant tab.

## Changing your details

Everything lives in [`src/config/profile.js`](src/config/profile.js) — driver,
vehicle, CTP and medical. Edit it, run `npm run build`, and copy the new file
to your phone.

Documents live in `src/documents/`. Because the file runs without scripting,
PDFs are rasterised to page images that display inline — the officer sees the
certificate itself, and pinch-to-zoom reads the fine print.

| PDF                | Appears as                  |
| ------------------ | --------------------------- |
| `registration.pdf` | Certificate of Registration |
| `ctp.pdf`          | CTP Green Slip Certificate  |

After replacing a PDF, regenerate its images and list them in
[`src/config/documents.js`](src/config/documents.js):

```bash
npm i --no-save playwright-core pdfjs-dist@4.10.38
node scripts/rasterize.mjs
```

Your photo is `src/assets/owner.jpg`.

## ⚠️ This repo still holds your personal details

The built file is private, but the **source** contains your licence number,
address, VIN and both PDFs — and this repo is public, including its history.
Going local doesn't undo that. To close it off:

1. **Settings → General → Danger Zone → Change visibility → Private**
2. Purge the details from history:

   ```bash
   pip install git-filter-repo
   git filter-repo --path src/config/profile.js --path src/documents --invert-paths --force
   git push --force
   ```

Anything already scraped while the repo and site were public is beyond recall —
treat it as exposed regardless.

## Going back to hosting

Removed in this version but recoverable from git history
(`git log -- vercel.json middleware.js`): a GitHub Pages workflow, and a Vercel
deployment gated behind edge-middleware basic auth. Hosting restores
persistent service records, the licence button, and installing as a proper
home-screen web app — at the cost of your details sitting on someone else's
server behind a password.
