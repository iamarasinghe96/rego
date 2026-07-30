# Documents

Drop PDFs (or photos) here using these exact filenames and the app links them
automatically — no code changes needed:

| Filename           | Shows up as                     |
| ------------------ | ------------------------------- |
| `registration.pdf` | Registration Papers             |
| `insurance.pdf`    | Certificate of Currency         |
| `ctp.pdf`          | CTP / Green Slip                |
| `roadworthy.pdf`   | Safety / Roadworthy Certificate |

Images work too — rename a photo to e.g. `registration.pdf`'s slot by editing
`src/config/documents.js` if you'd rather use `.jpg`.

## ⚠️ These files are public

Everything in `public/` is deployed with the site and is readable by anyone
with the URL. This repo is also public, so committed files are visible on
GitHub and remain in git history even after deletion.

Registration and insurance documents contain your full name, address, licence
number and VIN. If you'd rather not publish that, use the **Upload** button in
the app instead — those files are stored in your browser on that device only
and never leave it.

To add a file:

```bash
cp ~/Downloads/my-rego.pdf public/documents/registration.pdf
git add public/documents/registration.pdf
git commit -m "Add registration document"
git push
```
