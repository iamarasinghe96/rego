/**
 * Builds VehicleVault.html — one file, no JavaScript.
 *
 * iOS previews local HTML with scripting disabled, so the page is rendered to
 * static markup at build time and navigation is handled by CSS. Images and
 * styles are inlined so the file makes no network requests at all.
 */
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { DOC_META } from '../src/config/documents.js';

const ROOT = process.cwd();
const SSR_DIR = join(ROOT, '.ssr-build');
const DIST = join(ROOT, 'dist');
const OUT = join(DIST, 'VehicleVault.html');

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };

function dataUri(path) {
  if (!existsSync(path)) throw new Error(`Missing asset: ${path}`);
  const mime = MIME[extname(path).toLowerCase()];
  if (!mime) throw new Error(`Unsupported asset type: ${path}`);
  return `data:${mime};base64,${readFileSync(path).toString('base64')}`;
}

// 1. Bundle the renderer for Node.
await build({
  configFile: false,
  root: ROOT,
  plugins: [react()],
  logLevel: 'warn',
  build: {
    ssr: 'src/static/entry.jsx',
    outDir: SSR_DIR,
    emptyOutDir: true,
    minify: false,
    rollupOptions: { output: { entryFileNames: 'entry.mjs' } },
  },
});

// 2. Collect the assets that get inlined.
const ownerPhoto = dataUri(join(ROOT, 'src/assets/owner.jpg'));
const documents = DOC_META.map((doc) => ({
  ...doc,
  pages: doc.files.map((f) => dataUri(join(ROOT, 'src/documents/pages', f))),
}));
const builtAt = new Date().toLocaleDateString('en-AU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

// 3. Render.
const { render } = await import(pathToFileURL(join(SSR_DIR, 'entry.mjs')).href);
const body = render({ ownerPhoto, documents, builtAt });

// 4. Compile the stylesheet.
const { css } = await postcss([tailwindcss(), autoprefixer()]).process(
  readFileSync(join(ROOT, 'src/index.css'), 'utf8'),
  { from: join(ROOT, 'src/index.css'), to: undefined }
);

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>VehicleVault</title>
<meta name="theme-color" content="#1e3a8a">
<meta name="robots" content="noindex, nofollow">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="VehicleVault">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231e3a8a'%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/%3E%3C/svg%3E">
<style>${css}</style>
</head>
<body>${body}</body>
</html>
`;

mkdirSync(DIST, { recursive: true });
writeFileSync(OUT, html);
rmSync(SSR_DIR, { recursive: true, force: true });

// 5. Refuse to ship anything that would break offline or need scripting.
const shell = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
const external = [...shell.matchAll(/(?:src|href)="(?!data:|#|shortcuts:)([^"]+)"/g)].map((m) => m[1]);
const scripts = [...html.matchAll(/<script\b/gi)];

if (external.length) {
  console.error(`\n✗ References external resources: ${external.join(', ')}\n`);
  process.exit(1);
}
if (scripts.length) {
  console.error(`\n✗ Contains ${scripts.length} <script> tag(s); the file must run without JS.\n`);
  process.exit(1);
}

const mb = (Buffer.byteLength(html) / (1024 * 1024)).toFixed(2);
console.log(`\n✓ ${OUT}`);
console.log(`  ${mb} MB · no JavaScript · no external requests\n`);
