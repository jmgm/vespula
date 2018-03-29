const webpack = require('webpack'),
    path = require('path'),
    chalk = require('chalk'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    CopyPlugin = require('copy-webpack-plugin'),
    ProgressBarPlugin = require('progress-bar-webpack-plugin');

const ENV = process.env.WEBPACK_ENV;

let config = {
    entry: {
        bundle: ['./src/index.tsx']
    },

    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'build')
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: path.join(__dirname, 'node_modules'),
                loader: 'ts-loader',
                options: {
                    onlyCompileBundledFiles: true
                }
            },
            {
                test: /\.less$/,
                exclude: path.join(__dirname, 'node_modules'),
                loader: [
                    ENV === 'dev_server'
                        ? 'style-loader'
                        : MiniCssExtractPlugin.loader,
                    'css-loader?-url',
                    'postcss-loader',
                    'less-loader?relativeUrls=false'
                ]
            }
        ]
    },

    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.less']
    },

    performance: {
        hints: false
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'bundle.css'
        }),
        new CopyPlugin([{ from: 'assets/', to: './assets/' }]),
        new webpack.DefinePlugin({
            __PRODUCTION: ENV === 'production'
        }),
        new ProgressBarPlugin({
            format: [
                ' ' + chalk.cyan.bold('build'),
                chalk.green.bold(':percent'),
                chalk.grey('•'),
                chalk.magenta(':elapsed s'),
                chalk.grey('[:msg]')
            ].join(' ')
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],

    devServer: {
        contentBase: [path.join(__dirname, 'src')],
        port: 9000,
        historyApiFallback: true,
        hot: true
    },

    devtool: 'source-map',
    context: __dirname
};

if (ENV === 'dev_server') {
    //...
}

if (ENV === 'dev') {
    //...
}

if (ENV === 'production') {
    // add minification here
    //config.plugins.push(...);
}

module.exports = config;
