import { createWriteStream, createReadStream, mkdirSync, existsSync } from 'fs';
import { createGunzip } from 'zlib';
import { pipeline } from 'stream/promises';
import { resolve, dirname, join } from 'path';
import { extract } from 'tar-stream';
import { Readable } from 'stream';

const tarball = '/tmp/sitemap.tgz';
const dest = '/home/hermes/developer/portfolio/node_modules/@astrojs/sitemap';

mkdirSync(dest, { recursive: true });

const extractor = extract();
extractor.on('entry', (header, stream, next) => {
  const target = join(dest, header.name.replace(/^package\//, ''));
  if (header.type === 'directory') {
    mkdirSync(target, { recursive: true });
  } else {
    mkdirSync(dirname(target), { recursive: true });
    const out = createWriteStream(target);
    stream.pipe(out);
    out.on('finish', next);
  }
});

const gunzip = createGunzip();
const src = createReadStream(tarball);
await pipeline(src, gunzip, extractor);
console.log('Extracted @astrojs/sitemap');