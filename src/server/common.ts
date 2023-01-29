// import { dirname } from 'path';
// import { fileURLToPath } from 'url';

// // TODO To start the server with ts-node (ts-node-esm, we have to use the import.meta.url)
// // For webpack we have to use __dirname, else the path is bundled into the server.js file.
// // For esbuild we have to define the format to esm with other problems.
// export const curDirName = dirname(fileURLToPath(import.meta.url));

export const curDirName = __dirname;
