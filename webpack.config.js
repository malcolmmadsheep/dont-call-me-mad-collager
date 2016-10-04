'use strict';

const path = require('path');
const webpack = require('webpack');
const LiveReloadPlugin = require('webpack-livereload-plugin');

const config = {
  entry: './sources/scripts/main.js',
  output: {
    path: './build/',
    filename: 'bundle.js',
    publicPath: '/collager/'
  },
  resolve: {
    root: [path.join(__dirname, 'sources')],
    extentions: ['', '.webpack.js', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'sources/scripts')
      }, {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass'],
        include: path.join(__dirname, 'sources/styles')
      }
    ]
  },
  plugins: [
    new LiveReloadPlugin()
  ]
};

module.exports = config;