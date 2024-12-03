const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development', // Set mode to 'development' for local development
    entry: {
        main: './src/serviceworker.js',
        pins: './src/pins.js',
        profile: './src/profile.js',
        addPoll: './src/addpoll.js',
        editProfile: './src/editProfile.js',
        main: './src/main.js',
        webworker: './src/webworker.js',
        home: './src/home.js'
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
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[name][ext]'
                }
            },
            {
                test: /\.json$/,
                type: 'data/resource',
                generator: {
                    filename: 'data/[name][ext]'
                }
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['main, home, use_serviceworker']
        }),
        new HtmlWebpackPlugin({
            template: './src/addPoll.html',
            filename: 'addPoll.html',
            chunks: ['addPoll']
        }),
        new HtmlWebpackPlugin({
            template: './src/editprofile.html',
            filename: 'editprofile.html',
            chunks: ['editProfile']
        }),
        new HtmlWebpackPlugin({
            template: './src/pins.html',
            filename: 'pins.html',
            chunks: ['pins']
        }),
        new HtmlWebpackPlugin({
            template: './src/profile.html',
            filename: 'profile.html',
            chunks: ['profile']
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/data', to: 'data' },
                { from: 'src/assets', to: 'assets' },
                { from: 'src/styles/style.css', to: 'styles/style.css' },
                { from: 'src/manifest.json', to: 'manifest.json' }
            ]
        })
    ],
    devServer: {
        static: './dist',
        port: 8888,
        open: true
    }
};