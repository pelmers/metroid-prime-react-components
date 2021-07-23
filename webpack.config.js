const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ROOT = path.resolve(__dirname, 'src');
const DESTINATION = path.resolve(__dirname, 'dist');
const pkg = require('./package.json');

const sharedConfig = {
    context: ROOT,

    mode: 'development',

    plugins: [new MiniCssExtractPlugin()],
    output: {
        path: DESTINATION,
        filename: '[name].js',
        library: pkg.name,
        libraryTarget: 'umd',
        publicPath: '/dist/',
        umdNamedDefine: true,
    },

    module: {
        rules: [
            /****************
             * PRE-LOADERS
             *****************/
            {
                enforce: 'pre',
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'tslint-loader',
            },

            /****************
             * LOADERS
             *****************/
            {
                test: /\.tsx?$/,
                exclude: [/node_modules/],
                use: 'ts-loader',
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                            ref: true,
                            svgo: false,
                        },
                    },
                ],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(ttf|png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                    },
                ],
            },
        ],
    },

    // devtool: 'cheap-module-source-map',
    devServer: {},
};

const libraryConfig = {
    ...sharedConfig,
    entry: {
        index: 'index.tsx',
    },

    resolve: {
        extensions: ['.ts', '.js', '.tsx'],
        modules: [ROOT, 'node_modules'],
        alias: {
            react: path.resolve(__dirname, './node_modules/react'),
            'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
        },
    },

    externals: {
        // Don't bundle react or react-dom
        react: {
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'React',
            root: 'React',
        },
        'react-dom': {
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
            amd: 'ReactDOM',
            root: 'ReactDOM',
        },
    },
};

const demoConfig = {
    ...sharedConfig,
    entry: {
        demo: 'demo/main.tsx',
    },

    resolve: {
        extensions: ['.ts', '.js', '.tsx'],
        modules: [ROOT, 'node_modules'],
    },

    plugins: [
        ...sharedConfig.plugins,
        new CopyPlugin({
            patterns: [{ from: 'demo/index.html' }, { from: 'demo/favicon.ico' }],
        }),
    ],
};

module.exports = [libraryConfig, demoConfig];
