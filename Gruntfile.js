/* eslint-disable */
"use strict";

var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function(grunt) {
  // Load tasks & measure timing
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  // Configure Grunt tasks
  grunt.initConfig({
    /**
     * Clean the `dist/` folder between builds.
     */
    clean: {
      'dist': ['dist/']
    },

    /**
     * Bump version numbers in `package.json` and `bower.json`,
     * and make a version commit marker. Used by CI script.
     */
    bump: {
      options: {
        files: ["package.json"],
        commitFiles: ["package.json"],
        push: false,
        createTag: false
      }
    },

    /**
     * Copy assets into `dist/` directory.
     */
    copy: {
      assets: {
        files: [
          {expand: true, src: ["assets/**"], dest: "dist/"}
        ]
      }
    },

    /**
     * Run Express pattern library server in background while
     * Grunt task is active.
     */
    express: {
      dev: {
        options: {
          script: 'styleguide/bin/start.js'
        }
      }
    },


    /**
     * Build assets with Webpack.
     */
    webpack: {
      options: {
        entry: './src/index.js',
        output: {
          path: 'dist',
          filename: '[name].js'
        },
        module: {
          loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.(png|jpg|gif|eot|woff|svg|ttf)$/, loader: 'url-loader?limit=4096' },
            {
              test: /\.scss$/,
              loader: ExtractTextPlugin.extract('css-loader?sourceMap!postcss-loader!sass-loader?sourceMap')
            }
          ]
        },
        postcss: function() {
          return [
            require('autoprefixer')({
              browsers: ['last 4 versions', 'Firefox ESR', 'Opera 12.1']
            }),
            require('css-mqpacker')()
          ];
        },
      },

      prod: {
        plugins: [
          new webpack.DefinePlugin({
            DEBUG: false,
            PRODUCTION: true
          }),
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false,
              drop_console: true,
              drop_debugger: true,
              dead_code: true
            }
          }),
          new ExtractTextPlugin('forge.css')
        ]
      },

      debug: {
        devtool: 'eval-cheap-module-source-map',
        plugins: [
          new webpack.DefinePlugin({
            DEBUG: true,
            PRODUCTION: false,
          }),
          new ExtractTextPlugin('forge.css')
        ],

        // Keep Webpack task running & watch for changes.
        keepalive: true,
        watch: true,
        cache: true,
      }
    },

    /**
     * Create custom Modernizr build based on referenced CSS
     * classes and JavaScript Modernizr checks.
     */
    modernizr: {
      all: {
        "devFile": "remote",
        "outputFile": "dist/modernizr.js",
        "files" : {
          "src": [
            "js/**/*.js",
            "!js/modernizr/**/*.js",
            "src/**/*.src"
          ]
        },
        extensibility : {
          // We prefix all Modernizr classes with `modernizr-` to avoid class conflicts.
          "cssclassprefix": "modernizr-"
        },
        "extra" : {
          "shiv" : false,
          "teststyles": true,
          "printshiv" : false,
          "load" : true,
          "mq" : false,
          "video": false
        },
        "customTests": [
          "js/modernizr/checked.js",
          "js/modernizr/label-click.js"
        ]
      }
    },

    /**
     * Lint JavaScript using ESLint.
     */
    eslint: {
      all: ["src/**/*.js", "!src/modernizr/**/*.js"]
    },

    /**
     * Lint SCSS using Sasslint.
     */
    sasslint: {
      all: ['src/**/*.src'],
    },

  });

  /**
   * Register Grunt aliases.
   */

  // > grunt
  // Build for development & watch for changes.
  grunt.registerTask('default', ['express:dev', 'test']);

  // > grunt build
  // Build for production.
  grunt.registerTask('build', ['clean:dist', 'modernizr:all', 'webpack:prod']);

  // > grunt test
  // Run included unit tests and linters.
  grunt.registerTask('test', ['eslint', 'sasslint']);

};

