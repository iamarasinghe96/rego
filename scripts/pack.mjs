import { readFileSync, writeFileSync, rmSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const OUT = join(DIST, 'VehicleVault.html');

const html = readFileSync(join(DIST, 'index.html'), 'utf8');

// The whole point is a single file — anything else left in dist means an
// asset escaped inlining and the app would break when opened offline.
const stray = readdirSync(DIST).filter((f) => f !== 'index.html' && f !== 'VehicleVault.html');
if (stray.length) {
  console.error(`\n✗ These assets were not inlined: ${stray.join(', ')}`);
  console.error('  Raise build.assetsInlineLimit in vite.config.js.\n');
  process.exit(1);
}

// Scan only the HTML shell — the inlined bundle is full of strings that look
// like attributes but aren't.
const shell = html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');

const external = [...shell.matchAll(/(?:src|href)="(?!data:|#|blob:)([^"]+)"/g)].map((m) => m[1]);
if (external.length) {
  console.error(`\n✗ File still references external resources: ${external.join(', ')}\n`);
  process.exit(1);
}

writeFileSync(OUT, html);
rmSync(join(DIST, 'index.html'));

const mb = (Buffer.byteLength(html) / (1024 * 1024)).toFixed(2);
console.log(`\n✓ ${OUT} — ${mb} MB, fully self-contained\n`);
