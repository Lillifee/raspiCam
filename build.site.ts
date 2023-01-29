import * as esbuild from 'esbuild';
import * as fs from 'fs/promises';
import { join } from 'path';

const outPath = './build/public';

console.info('- esbuild site...');

export const esbuildSiteConfig: esbuild.BuildOptions = {
  entryPoints: ['./src/site/main.tsx'],
  outfile: join(outPath, 'site.js'),
  platform: 'browser',
  sourcemap: 'external',
  bundle: true,
  minify: true,
};

await esbuild.build(esbuildSiteConfig);

const copyToBuild = (folder: string, file: string) =>
  fs.copyFile(join(folder, file), join(outPath, file));

console.info('- copy dependencies...');

await Promise.all([
  copyToBuild('./broadway', 'Decoder.cjs'),
  copyToBuild('./broadway', 'avc.wasm'),
  copyToBuild('./src/site/public', 'index.html'),
  copyToBuild('./src/site/public', 'favicon.ico'),
]);

console.info('- build site complete');
