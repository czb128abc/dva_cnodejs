const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { baseConfig } = require('./webpack.config.base');

const config = {
    ...baseConfig,
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        hot: true,
    }
}

module.exports = config;