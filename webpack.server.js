import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const currentDirectoryPath = dirname(fileURLToPath(import.meta.url));

export default {
  mode: 'production',
  entry: './src/server/main.ts',
  target: 'node',
  devtool: 'source-map',

  output: {
    path: join(currentDirectoryPath, '/build'),
    filename: 'server.js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: [/node_modules/],
      },

      // Used for onoff/epoll node binding
      {
        test: /\.js$/,
        loader: 'node-bindings-loader',
      },
      {
        test: /\.node$/,
        loader: 'node-loader',
        options: {
          name: '[name].[ext]',
        },
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '...'],
    extensionAlias: {
      '.js': ['.ts', '.js'],
      '.mjs': ['.mts', '.mjs'],
    },
  },

  // Fix the output warnings of yargs
  // TODO Check for alternative and if yargs necessary.
  ignoreWarnings: [/warning/, { module: /yargs/ }],
};
