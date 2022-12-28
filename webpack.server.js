const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/server/index.ts',
  target: 'node',
  devtool: 'source-map',

  output: {
    path: path.join(__dirname, '/build'),
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
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  plugins: [new webpack.ExternalsPlugin('commonjs', ['onoff'])],

  // Fix the output warnings of yargs
  // TODO Check for alternative and if yargs necessary.
  ignoreWarnings: [/warning/, { module: /yargs/ }],
};
