/*
This webpack configuration helps you to configure your project output.
Read more about webpack and do your own modifications from here https://webpack.js.org/
*/
const merge = require('webpack-merge')
const common = require('./webpack.common')

const dev = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    open: true,
    noInfo: true
  }
}

module.exports = merge(common, dev)
