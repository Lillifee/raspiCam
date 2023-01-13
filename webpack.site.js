const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;

const styledComponentTransformer = {
  production: createStyledComponentsTransformer({ minify: true }),
  development: createStyledComponentsTransformer({ minify: false }),
};

/*
 * Switch the server path during development
 */
const devServer = '192.168.3.76:8000';

module.exports = (env, argv) => ({
  mode: argv.mode || 'production',
  entry: './src/site/index.tsx',
  devtool: 'source-map',

  output: {
    path: path.join(__dirname, 'build', 'public'),
    publicPath: '/',
    filename: `site.js`,
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
        { from: path.join(__dirname, 'broadway', 'Decoder.js') },
        { from: path.join(__dirname, 'broadway', 'avc.wasm') },
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
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      buffer: 'buffer',
      stream: 'stream-browserify',
    },
  },
});
