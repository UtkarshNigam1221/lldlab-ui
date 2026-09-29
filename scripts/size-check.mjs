/* global URL, console, process -- Node script */
// Fails if the library bundle (without peer or runtime deps, which are external) grows past its gzip budget.
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const LIMIT_KB = 150;
const buf = readFileSync(new URL('../dist/index.js', import.meta.url));
const gz = gzipSync(buf).length / 1024;
console.log(`size-check: dist/index.js ${(buf.length / 1024).toFixed(1)} KB raw, ${gz.toFixed(1)} KB gzip (limit ${LIMIT_KB} KB)`);
if (gz > LIMIT_KB) {
  console.error('size-check: over budget');
  process.exit(1);
}
