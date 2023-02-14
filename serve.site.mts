import * as esbuild from 'esbuild';
import { esbuildSiteConfig } from './build.site.mjs';
import http from 'node:http';

console.info('- watch site');

const raspi = { hostname: '192.168.3.139', port: '8000' };

// Start esbuild's server on a random local port
const ctx = await esbuild.context({ ...esbuildSiteConfig, minify: false });

// The return value tells us where esbuild's local server is
const { host, port } = await ctx.serve({ servedir: './build/public/', port: 8001 });

// Then start a proxy server on port 3000
http
  .createServer((req, res) => {
    // Forward requests to Raspberry PI
    const apiReq = http.request(
      {
        hostname: raspi.hostname,
        port: raspi.port,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (resp) => {
        resp.pipe(res, { end: true });
      },
    );

    if (req.url?.startsWith('/api')) {
      req.pipe(apiReq, { end: true });
      return;
    }

    // Forward to esbuild serve
    const proxyReq = http.request(
      {
        hostname: host,
        port: port,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (proxyRes) => {
        // If esbuild returns "not found", send a custom 404 page
        if (proxyRes.statusCode === 404) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>A custom 404 page</h1>');
          return;
        }

        // Otherwise, forward the response from esbuild to the client
        res.writeHead(proxyRes?.statusCode || 0, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      },
    );

    // Forward the body of the request to esbuild
    req.pipe(proxyReq, { end: true });
  })
  .listen(8000);
