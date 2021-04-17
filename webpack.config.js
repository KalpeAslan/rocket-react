const path = require('path')
const isDev = process.env.NODE_ENV === 'development'
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const EslintPlugin = require('eslint-webpack-plugin')
const fileName = (ext) => isDev ? `[name].[contenthash].${ext}` : `[name].[contenthash].${ext}`

const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin')

const cssLoader = (loader) => {
    const loaders = [{
        loader: MiniCssExtractPlugin.loader,
    }, 'css-loader']
    if (loader) {
        loaders.push(loader)
    }
    return loaders
}
const babelOptions = (loader) => {
    const loaders = {
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env'],
            plugins: [
                '@babel/plugin-proposal-class-properties'
            ]
        },
    }
    if (loader) {
        loaders.options.presets.push(loader)
    }
    return loaders
}

const getPath = (pathElem) => path.resolve(__dirname, pathElem)


module.exports = {
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', path.resolve(__dirname, 'src', 'index.jsx')],
    },
    output: {
        filename: fileName('js'),
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        isDev && new EslintPlugin({
            extensions: ['js', 'jsx', 'ts']
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve(__dirname, 'src/assets/icons/favicon.ico'),
                to: path.resolve(__dirname, 'dist')
            }, ],
        }),
        new MiniCssExtractPlugin({
            filename: fileName('css')
        }),
        new OptimizeCssAssetsWebpackPlugin()
    ],
    module: {
        rules: [
            /**
             * css files
             */
            {
                test: /\.css$/,
                use: cssLoader()
            },
            {
                test: /\.scss$/,
                use: cssLoader('sass-loader')
            },
            /**
             * images and fonts
             */
            {
                test: /\.(png|jpg|jpeg|svg|gif|webp)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            /**
             * JS files
             */
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                // use: jsLoaders()
                use: babelOptions()
            },
            {
                test: /\.m?ts$/,
                exclude: /node_modules/,
                use: babelOptions('@babel/preset-typescript')
            },
            {
                test: /\.m?jsx$/,
                exclude: /node_modules/,
                use: babelOptions('@babel/preset-react')
            }
        ]
    },
    devServer: {
        port: 4000,
        /**
         * !This option needs only for development
         */
        writeToDisk: isDev
    },
    devtool: isDev && 'source-map',
    resolve: {
        // extensions: ['js', 'jsx', 'ts', 'css', 'scss', 'png', 'jpeg', 'svg', 'webp', 'gif'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            images: getPath('./src/assets/images/'),
            icons: getPath('./src/assets/icons/'),
            scss: getPath('./src/assets/scss/'),
            atoms: getPath('./src/components/atoms/'),
            moleculus: getPath('./src/components/moleculus/'),
            organisms: getPath('./src/components/organisms/'),
            template: getPath('./src/components/templates/'),
            api: getPath('./src/api/'),
            pages: getPath('./src/pages/'),
            services: getPath('./src/services/'),
        }
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
}