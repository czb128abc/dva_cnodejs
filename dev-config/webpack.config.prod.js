const { baseConfig, moduleCSSLoader } = require('./webpack.config.base');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
    ...baseConfig,
    mode: 'production',
    module: {
        rules: [
            ...baseConfig.module.rules.filter(
                rule => !['/\\.css$/', '/\\.less$/', '/\\.(scss|sass)$/'].includes(rule.test.toString())
            ),
            ...baseConfig.module.rules.filter(
                rule => !['/\\.css$/', '/\\.less$/', '/\\.(scss|sass)$/'].includes(rule.test.toString())
            ),
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
            },
            {
                test: /\.less$/,
                exclude: /antdTheme/,
                use: [
                    MiniCssExtractPlugin.loader,
                    moduleCSSLoader,
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(scss|sass)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    moduleCSSLoader,
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        ...baseConfig.plugins,
        new MiniCssExtractPlugin({
            filename: "[name].css",
        })
    ],
    optimization: {
        namedModules: true, // NamedModulesPlugin()
        splitChunks: { // CommonsChunkPlugin()
            name: 'commom',
            minChunks: 2,
            cacheGroups: {
                styles: {
                    name: 'commom',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        },
        noEmitOnErrors: true, // NoEmitOnErrorsPlugin
        concatenateModules: true, //ModuleConcatenationPlugin
    },
}
module.exports = config;