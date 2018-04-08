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
        test: /\.scss$/,
        include: path.join(__dirname, 'app'),
        exclude: /node_modules/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader']
        }))
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin('public/css/styles.css'), //Extract css
    new CopyWebpackPlugin([{from: 'app/views', to:'views'}]), //Copy EJS over
    new CopyWebpackPlugin([{from: 'app/public/imgs', to: 'public/imgs'}]) //Copy images
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin(), 
    new OptimizeCSSAssets()
  );
}
