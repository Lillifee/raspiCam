import * as esbuild from 'esbuild';
import { esbuildSiteConfig } from './build.site.js';
// import { createServer, request } from 'node:http';

const context = await esbuild.context(esbuildSiteConfig);
const serve = await context.serve({
  servedir: './build/public',
  onRequest: (args) => {
    console.log(
      'onRequest',
      args.path,
      args.method,
      args.remoteAddress,
      args.status,
      args.timeInMS,
    );
  },
});

console.info('- serve site on', `${serve.host}:${serve.port}`);

// createServer((req, res) => {
//   const { url, method, headers } = req;

//   // if (url === '/esbuild') {
//   //   return clients.push(
//   //     res.writeHead(200, {
//   //       'Content-Type': 'text/event-stream',
//   //       'Cache-Control': 'no-cache',
//   //       'Access-Control-Allow-Origin': '*',
//   //       Connection: 'keep-alive',
//   //     }),
//   //   );
//   // }

//   const path = url?.split('/')?.pop()?.indexOf('.') ? url : `/index.html`;
//   const proxyReq = request(
//     { hostname: '0.0.0.0', port: 8000, path, method, headers },
//     (proxyRes) => {
//       res.writeHead(proxyRes.statusCode || 404, proxyRes.headers);
//       proxyRes.pipe(res, { end: true });
//     },
//   );
//   req.pipe(proxyReq, { end: true });
//   return null;
// }).listen(5010);

// createServer((req, res) => handler(req, res, { public: 'dist' })).listen(3000);

// openBrowser();

//-------------------------------------------------------------------------------

// // Create a second (proxy) server that will forward requests to esbuild.
// const proxy = createServer((req, res) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://192.168.3.73:8000');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
//   // res.setHeader('Access-Control-Allow-Credentials', 'true');
//   // res.setHeader('Access-Control-Max-Age', '2592000');

//   // forwardRequest forwards an http request through to esbuid.
//   const forwardRequest = (path?: string) => {
//     const options = {
//       hostname: serve.host,
//       port: serve.port,
//       path,
//       method: req.method,
//       headers: req.headers,
//     };

//     const proxyReq = request(options, (proxyRes) => {
//       console.log('request path', path);
//       if (path && path.startsWith('/api')) {
//         console.log('request path', path);

//         res.setHeader('Access-Control-Allow-Origin', 'http://192.168.3.73:8000');
//         res.setHeader('Location', `http://192.168.3.73:8000${path}`);
//         // res.writeHead(301, {
//         //   Location: `http://192.168.3.73:8000${path}`,
//         // });
//         res.end();
//         return;
//         // return forwardRequest('/');
//       }

//       if (!proxyRes.statusCode || proxyRes.statusCode === 404) {
//         // If esbuild 404s the request, assume it's a route needing to
//         // be handled by the JS bundle, so forward a second attempt to `/`.
//         return forwardRequest('/');
//       }

//       // Otherwise esbuild handled it like a champ, so proxy the response back.
//       res.writeHead(proxyRes.statusCode, proxyRes.headers);
//       proxyRes.pipe(res, { end: true });
//     });

//     req.pipe(proxyReq, { end: true });
//   };

//   // When we're called pass the request right through to esbuild.
//   forwardRequest(req.url);
// });

// // Start our proxy server at the specified `listen` port.
// proxy.listen(8000);

//-------------------------------------------------------------------------------

// createServer((req, res) => {
//   const options = {
//     hostname: serve.host,
//     port: serve.port,
//     path: req.url,
//     method: req.method,
//     headers: req.headers,
//   };
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   const headers = {
//     'Access-Control-Allow-Origin': '*' /* @dev First, read about security */,
//     'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
//     'Access-Control-Max-Age': 2592000, // 30 days
//     /** add other headers as per requirement */
//   };

//   // Forward each incoming request to esbuild
//   const proxyReq = request(options, (proxyRes) => {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//     if (proxyRes.req.path.startsWith('/api/')) {
//       console.log(' redirect to ', `http://192.168.3.73:8000${proxyRes.req.path}`);
//       // You can also set using the following method

//       res.writeHead(301, {
//         ...headers,
//         Location: `http://192.168.3.73:8000${proxyRes.req.path}`,
//       });
//       res.end();

//       return;
//     }

//     // If esbuild returns "not found", send a custom 404 page
//     if (proxyRes.statusCode === 404) {
//       res.writeHead(404, { ...headers, 'Content-Type': 'text/html' });
//       res.end('<h1>404 Page Not Found</h1>');
//       return;
//     }

//     // Otherwise, forward the response from esbuild to the client
//     res.writeHead(proxyRes.statusCode || 404, { ...headers, ...proxyRes.headers });
//     proxyRes.pipe(res, { end: true });
//   });

//   // Forward the body of the request to esbuild
//   req.pipe(proxyReq, { end: true });
// }).listen(8000);

console.info('- create proxy on', `${serve.host}:3000`);
