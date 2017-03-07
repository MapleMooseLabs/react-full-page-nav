'use strict';

const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const OUT_PATH = path.resolve('./build');

// Used with webpack-dev-server
const PUBLIC_PATH = '/assets/';
const IS_DEV = process.env.RFPN_ENV === 'development';
const IS_PROD = process.env.RFPN_ENV === 'production';

const banner = [
  '/*!',
  ' React Full Page Navigation',
  ` Copyright (c) ${new Date().getFullYear()} Opentrace`,
  ' License: MIT',
  '*/',
].join('\n');

const createBannerPlugin = () => new webpack.BannerPlugin({
  banner: banner,
  raw: true,
  entryOnly: true,
});

const LIFECYCLE_EVENT = process.env.npm_lifecycle_event;
if (LIFECYCLE_EVENT == 'test' || LIFECYCLE_EVENT == 'test:watch') {
  process.env.BABEL_ENV = 'test';
}

const CSS_LOADER_CONFIG = [
  {
    loader: 'css-loader',
    options: {
      sourceMap: true,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: () =>[require('autoprefixer')({grid: false})],
    },
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
      // includePaths: glob.sync('src/*/node_modules').map((d) => path.join(__dirname, d)),
    },
  },
];

module.exports = [{
  name: 'demo',
  entry: path.resolve('./src/demo/index.jsx'),
  output: {
    path: OUT_PATH,
    publicPath: PUBLIC_PATH,
    filename: 'rfpn.demo.' + (IS_PROD ? 'min.' : '') + 'js',
    libraryTarget: 'umd',
    library: ['rfpn', '[name]'],
  },
  devtool: IS_DEV ? 'source-map' : false,
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
      },
    }],
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    createBannerPlugin(),
  ],
}, {
  name: 'js-all',
  entry: path.resolve('./src/components/index.js'),
  output: {
    path: OUT_PATH,
    publicPath: PUBLIC_PATH,
    filename: 'react-full-page-nav.' + (IS_PROD ? 'min.' : '') + 'js',
    libraryTarget: 'umd',
    library: 'rfpn',
  },
  devtool: IS_DEV ? 'source-map' : false,
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
      },
    }],
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    createBannerPlugin(),
  ],
}, {
  name: 'css',
  entry: {
    'react-full-page-nav': path.resolve('./src/scss/react-full-page-nav.scss'),
  },
  output: {
    path: OUT_PATH,
    publicPath: PUBLIC_PATH,
    // In development, these are emitted as js files to facilitate hot module replacement. In
    // all other cases, ExtractTextPlugin is used to generate the final css, so this is given a
    // dummy ".css-entry" extension.
    filename: '[name].' + (IS_PROD ? 'min.' : '') + 'css' + (IS_DEV ? '.js' : '-entry'),
  },
  devtool: IS_DEV ? 'source-map' : false,
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'file-loader'
      },
      {
        test: /\.scss$/,
        use: IS_DEV ? [{loader: 'style-loader'}].concat(CSS_LOADER_CONFIG) : ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: CSS_LOADER_CONFIG,
          }
        ),
      }
    ],
  },
  plugins: [
    new ExtractTextPlugin('[name].' + (IS_PROD ? 'min.' : '') + 'css'),
    createBannerPlugin(),
  ],
}];
