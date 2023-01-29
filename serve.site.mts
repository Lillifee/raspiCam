import * as esbuild from 'esbuild';
import { esbuildSiteConfig } from './build.site.mjs';

await esbuild.context(esbuildSiteConfig).then((x) => x.watch());

console.info('- watch site');
