const webppack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const PATHS = {
    src: path.join(__dirname, '../src'),
    build: path.join(__dirname, '../build'),
    public: path.join(__dirname, '../public'),
};
const moduleCSSLoader = {
    loader: 'css-loader',
    options: {
        modules: true,
        sourceMap: true,
        importLoaders: 2,
        localIdentName: '[path][name]__[local]__[hash:base64:5]'
    }
};


const config = {
    mode: 'development',
    context: path.resolve(__dirname, '../'),
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.less', '.json']
    },
    entry: {
        index: PATHS.src
    },
    output: {
        path: PATHS.build,
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.not_jsx?$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                include: [/node_modules/, PATHS.src]
            },
            {
                test: /\.less$/,
                use: ['style-loader', moduleCSSLoader, 'less-loader']
            },
            {
                test: /\.(scss|sass)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'images/[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.special\.json$/,
                type: 'javascript/auto',
                use: 'special-loader'
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),
            filename: './index.html'
        }),
        new webppack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        hot: true,
    }
}

module.exports = config;