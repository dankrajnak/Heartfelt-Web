const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  devtool: 'inline-source-map',
  entry: ['./app/index.js'],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'app'),
        exclude: /node_modules/,
        query: {
          presets: ['env']
        }
      },
      {
        test: /\.css$/,
        include: path.join(__dirname, 'app'),
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader']
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('public/css/styles.css'), //Extract css
    new CopyWebpackPlugin([{from: 'app/views', to:'views'}]) //Copy EJS over
  ]
}
