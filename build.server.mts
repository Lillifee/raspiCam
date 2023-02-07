import * as esbuild from 'esbuild';
import { join } from 'path';

console.info('- esbuild server...');

const outPath = './build';

export const esbuildSeverConfig: esbuild.BuildOptions = {
  entryPoints: ['./src/server/main.ts'],
  outfile: join(outPath, 'server.js'),
  platform: 'node',
  sourcemap: 'external',
  external: ['onoff'],
  target: ['node10'],
  bundle: true,
  minify: true,
};

await esbuild.build(esbuildSeverConfig);

console.info('- build server complete');
