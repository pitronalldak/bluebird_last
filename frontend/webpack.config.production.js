const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  devtool: false,
  entry: './src/index',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: false,
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.BROWSER': true
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: './index_prod.html'
    }),
    new ExtractTextPlugin('bundle.css'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new CopyWebpackPlugin([
    { from: './src/assets/images/', to: './src/assets/images/' },
    { from: './src/assets/fonts/', to: './src/assets/fonts/' }
    ])
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: path.join(__dirname, 'src'),
      query: {
        presets: ['es2015', 'react', 'stage-0']
      }
    },
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style', 'css')
    },
    {
      test: /\.jpe?g$|\.gif$|\.png$|\.ico|\.svg(\?v\=.*)?$|\.woff(\?v\=.*)?$|\.ttf(\?v\=.*)?$|\.eot(\?v\=.*)?$|\.woff?2(\?v\=.*)?/, // eslint-disable-line max-len
      loader: 'file-loader?name=[path][name].[ext]'
    }]
  },
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  }
};
