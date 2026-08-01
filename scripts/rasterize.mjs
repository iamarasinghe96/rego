/**
 * Converts the PDFs in src/documents/ into page images in
 * src/documents/pages/, which the build embeds inline.
 *
 * The shipped file runs without JavaScript, so a PDF can't be opened from a
 * blob URL — page images are the only form that displays reliably in the iOS
 * Files preview.
 *
 * Run after replacing a PDF. Needs two packages that aren't project
 * dependencies, plus a Chromium binary:
 *
 *   npm i --no-save playwright-core pdfjs-dist@4.10.38
 *   CHROMIUM=/path/to/chrome node scripts/rasterize.mjs
 */
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const SRC = 'src/documents';
const OUT = join(SRC, 'pages');
const WIDTH = 1240;
const QUALITY = 0.72;

// Which PDFs to rasterize, and the basename of their page images.
const SOURCES = [
  ['registration', 'registration.pdf'],
  ['ctp', 'ctp.pdf'],
];

mkdirSync(OUT, { recursive: true });

const pdfjsDir = join(require.resolve('pdfjs-dist/package.json'), '..', 'build');
const libSrc = readFileSync(join(pdfjsDir, 'pdf.min.mjs'), 'utf8');
const workerSrc = readFileSync(join(pdfjsDir, 'pdf.worker.min.mjs'), 'utf8');

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM || undefined,
  args: ['--no-sandbox'],
});
const page = await browser.newPage();
await page.goto('about:blank');

for (const [name, file] of SOURCES) {
  const bytes = readFileSync(join(SRC, file));
  const images = await page.evaluate(
    async ([data, targetWidth, quality, lib, worker]) => {
      const libUrl = URL.createObjectURL(new Blob([lib], { type: 'text/javascript' }));
      const workerUrl = URL.createObjectURL(new Blob([worker], { type: 'text/javascript' }));
      const pdfjs = await import(libUrl);
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

      const doc = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
      const out = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const p = await doc.getPage(i);
        const base = p.getViewport({ scale: 1 });
        const viewport = p.getViewport({ scale: targetWidth / base.width });
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await p.render({ canvasContext: ctx, viewport }).promise;
        out.push(canvas.toDataURL('image/jpeg', quality));
      }
      return out;
    },
    [Array.from(bytes), WIDTH, QUALITY, libSrc, workerSrc]
  );

  images.forEach((dataUrl, i) => {
    const buf = Buffer.from(dataUrl.split(',')[1], 'base64');
    const target = join(OUT, `${name}-${i + 1}.jpg`);
    writeFileSync(target, buf);
    console.log(`${target}  ${(buf.length / 1024).toFixed(0)} KB`);
  });

  console.log(`  -> list these under "${name}" in src/config/documents.js`);
}

await browser.close();
