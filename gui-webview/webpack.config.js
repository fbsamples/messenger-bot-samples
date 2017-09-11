/* eslint-disable */
var path = require('path');
const webpack = require('webpack');

module.exports = [{
  context: path.join(__dirname),
  entry: 'index',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader?-svgo' },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.join(__dirname, 'client'),
      'node_modules'
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        APP_ID: JSON.stringify(process.env.APP_ID),
        PAGE_ID: JSON.stringify(process.env.PAGE_ID),
      },
    })
  ]
}];
