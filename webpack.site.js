import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createTransformer } from 'typescript-plugin-styled-components';

const styledComponentTransformer = {
  production: createTransformer({ minify: true }),
  development: createTransformer({ minify: false }),
};

const currentDirectoryPath = dirname(fileURLToPath(import.meta.url));

/*
 * Switch the server path during development
 */
const devServer = '192.168.3.76:8000';

export default (env, argv) => ({
  mode: argv.mode || 'production',
  entry: './src/site/main.tsx',
  devtool: 'source-map',

  output: {
    path: join(currentDirectoryPath, 'build', 'public'),
    publicPath: '/',
    filename: `site.js`,
  },

  experiments: {
    outputModule: true,
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: [/node_modules/],
        options: {
          transpileOnly: argv.mode === 'development',
          onlyCompileBundledFiles: true,
          getCustomTransformers: () => ({
            before: [
              argv.mode === 'development'
                ? styledComponentTransformer.development
                : styledComponentTransformer.production,
            ],
          }),
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/site/public/index.html',
      favicon: './src/site/public/favicon.ico',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: join(currentDirectoryPath, 'broadway', 'Decoder.cjs') },
        { from: join(currentDirectoryPath, 'broadway', 'avc.wasm') },
      ],
    }),
  ],

  devServer: {
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: `http://${devServer}`,
        changeOrigin: true,
        secure: false,
      },
      '/photos': {
        target: `http://${devServer}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },

  performance: {
    maxAssetSize: 500000,
    maxEntrypointSize: 500000,
  },

  resolve: {
    extensions: ['.tsx', '.ts', '...'],
    extensionAlias: {
      '.js': ['.ts', '.tsx', '.js'],
      '.mjs': ['.mts', '.mjs'],
    },
    alias: {
      buffer: 'buffer',
      stream: 'stream-browserify',
    },
  },
});
