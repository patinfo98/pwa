const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: './main.js',
        index: './index.js',
        addpoll: './addpoll.js',
        editProfile: './editProfile.js',
        pins: './pins.js',
        profile: './profile.js',
        serviceworker: './serviceworker.js',
        use_serviceworker: './use_serviceworker.js',
        webworker: './webworker.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name][ext]'
                }
            },
            {
                test: /\.html$/i,
                use: 'html-loader',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            chunks: ['index', 'main', 'use_serviceworker']
        }),
        new HtmlWebpackPlugin({
            template: './addPoll.html',
            filename: 'addPoll.html',
            chunks: ['addpoll', 'main', 'use_serviceworker']
        }),
        new HtmlWebpackPlugin({
            template: './editprofile.html',
            filename: 'editprofile.html',
            chunks: ['editProfile', 'main', 'use_serviceworker']
        }),
        new HtmlWebpackPlugin({
            template: './pins.html',
            filename: 'pins.html',
            chunks: ['pins', 'main', 'use_serviceworker']
        }),
        new HtmlWebpackPlugin({
            template: './profile.html',
            filename: 'profile.html',
            chunks: ['profile', 'main', 'use_serviceworker']
        }),
    ],
    devServer: {
        static: './dist',
        port: 8888,
        open: true
    }
};