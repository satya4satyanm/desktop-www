/*
This webpack configuration helps you to configure your project output.
I am using webpack to bundle the front end game part.
This helps in minimifying the javascript files, bundling them.
Read more about webpack and do your own modifications from here https://webpack.js.org/
*/
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: ['./js/index.js', './webpack/credits.js'],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    // chunkFilename: '[name].chunk.js'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          filename: '[name].js'
        }
      }
    }
  },
  devServer: {
    hot: true,
    port: 3000
  },
  plugins: [
    new HtmlWebpackPlugin({ gameName: 'Phaser 3 Tough Chess', template: './index.html' }),
    new CopyWebpackPlugin([
      { from: './assets', to: 'assets' },
      { from: './js/worker.js', to: 'worker.js' },
    ])
  ]
}
