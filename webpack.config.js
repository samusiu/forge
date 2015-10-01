/* eslint-disable */
"use strict";

require('babel/register');

// Requiring styles should be a no-op on the server.
var hook = require('node-hook');
hook.hook('.scss', function(source, filename) {
  return '';
});

var React = require('react');
var Index = require('./docs/index');
var getConfig = require('hjs-webpack');

var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = getConfig({
  in: 'docs/styleguide.js',
  out: 'build',
  clearBeforeBuild: true,
  html: function(context) {
    var indexStaticRenderedHTML = React.renderToString(React.createElement(Index));

    return {
      'index.html': context.defaultTemplate({
        title: 'Pattern Library | DoSomething.org',
        html: indexStaticRenderedHTML
      }),
    }
  }
});

console.dir(config, { colors: true })

//config.devServer.plugins.push(new webpack.IgnorePlugin(/\.(css|scss)$/));

module.exports = config;
