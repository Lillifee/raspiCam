import * as esbuild from 'esbuild';

console.info('- esbuild server...');

await esbuild.build({
  entryPoints: ['./src/server/main.ts'],
  outfile: './build/server.js',
  platform: 'node',
  sourcemap: 'external',
  external: ['onoff'],
  bundle: true,
  minify: true,
  // format: 'esm'
});

console.info('- build server complete');
