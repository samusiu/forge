import express from 'express';
import ejs from 'ejs';
import kss from 'kss';
import pkg from '../package.json';
import highlight from 'highlight.js';
import path from 'path';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';

// Express App
var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname);

app.use(express.static(__dirname + '/../'));

const config = {
  entry: {
    forge: [
      'webpack-dev-server/client?http://0.0.0.0:3001', // WebpackDevServer host and port
      'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
      path.resolve(__dirname, '..', 'src', 'index.js'),
    ],
  },
  output: {
    name: 'bundle.js',
    path: path.resolve('./dist/'),
    publicPath: 'http://0.0.0.0:3001/dist/',
  },
  devtool: '#eval-cheap-module-source-map',
  module: {
    loaders: [
      {
        test: /\.(png|jpg|gif|eot|woff|svg|ttf)$/,
        loader: 'url?limit=4096',
      },
      {
        test: /\.scss$/,
        include: path.join(__dirname, '..', 'src'),
        loaders: ['style', 'css', 'postcss', 'sass'],
      },
      {
        test: /\.js$/,
        include: path.join(__dirname, '..', 'src'),
        loaders: ['react-hot', 'babel'],
      },
    ],
  },
  postcss: function() {
    return [
      require('autoprefixer')({
        browsers: ['last 4 versions', 'Firefox ESR', 'Opera 12.1']
      }),
      require('css-mqpacker')()
    ];
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      DEBUG: true,
      PRODUCTION: false,
    }),
  ],
};

const compiler = webpack(config);

import WebpackDevServer from 'webpack-dev-server';
const HOT_HOST = '0.0.0.0';
const HOT_PORT = 3001;

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
}).listen(HOT_PORT, HOT_HOST, function(err) {
  if (err) {
    console.log(err);
  }

  console.log('Hot server listening at ' + HOT_HOST + ':' + HOT_PORT);
});

app.locals.highlight = function(markup) {
  return highlight.highlightAuto(markup).value;
};

app.get('/', function(req, res) {
  let version = app.get('env') === 'production' ? pkg.version : pkg.version + '-dev';

  // Read KSS on each render. Since this is only used for local development, I'm
  // not too worried about performance. (It takes approx. 40ms to parse KSS.)
  kss.traverse(__dirname + '/../src', {}, function(err, styleguide) {
    if(err) console.error(err);

    res.render('index', {
      version: version,
      styleguide: styleguide,
      year: new Date().getFullYear()
    });
  });

});

// Start 'er up!
const PORT = 3000;
app.listen(PORT, function() {
  console.log(`Pattern Library running on 'http://localhost:${PORT}'.`);
});
