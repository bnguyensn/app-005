/** ********** WEBPACK CONFIG FILE 3/3 ********** **/

const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
//const ExtractTextPlugin = require("extract-text-webpack-plugin");  // currently not supported for webpack 4.0
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/** The main configuration */
module.exports = () => {
    // Loader constants
    const urlLoaderSizeLimit = 1024 * 10;  // 10kb

    // Main config
    return merge(common, {

        mode: 'production',  // webpack 4.0

        output: {
            publicPath: '/static/',  // Different from dev config. Be careful to include the prefix '/'
            filename: '[name].[chunkhash].js',  // Different from dev config
            chunkFilename: '[name].[chunkhash].js',  // Different from dev config
        },

        module: {
            rules: [
                /* .css
                 * === ExtractTextPlugin (not yet supported for webpack 4.0)
                 * We use ExtractTextPlugin for prod rather then 'style-loader'.
                 * Can't be used in dev because ExtractTextPlugin can't be used with HotModuleReplacement
                 * The fallback option below is identical to our dev config
                 * === MiniCssExtractPlugin (replacement)
                 *
                 */
                {
                    test: /\.css$/,
                    /*use: ExtractTextPlugin.extract({
                        fallback: [  // this option is identical to our dev config
                            'style-loader',
                            {
                                loader: 'css-loader',
                                options: {
                                    /!*modules: true,  // TODO: implement CSS modules
                                     localIdentName: '[chunkhash]'*!/
                                    importLoaders: 2
                                }
                            },
                            'postcss-loader',
                            'sass-loader'
                        ],
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 2
                                }
                            },
                            'postcss-loader',
                            'sass-loader'
                        ]
                    }),*/
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ],
                    exclude: /node_modules/
                },

                // Images (PNG | JPG | GIF)
                {
                    test: /\.(png|jpe?g|gif)$/,
                    use: {
                        loader: 'url-loader',  // url-loader has automatic file-loader fallback
                        options: {
                            limit: urlLoaderSizeLimit,
                            // [chunkhash] does not seem to work when loading large files. Reasons = unknown
                            name: 'assets/[name].[hash].[ext]'  // Different from dev config
                        }
                    }, //`url-loader?limit=${urlLoaderSizeLimit}&name=assets/[chunkhash].[ext]`,
                    exclude: /node_modules/
                }
            ]
        },

        plugins: [
            // Define environment
            // webpack 4.0: now has mode. Environment variables are defaulted with mode as well
            /*new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')  // Different from dev config
            }),*/

            // ExtractTextPlugin - compiling all .css into one for each entry. Used in prod ONLY.
            // This is currently not supported in webpack 4.0
            /*new ExtractTextPlugin({
                // We have multiple entries, so can't just use 'styles.css'.
                // In addition, only [contenthash], [id], and [name] are allowed
                filename: '[name].[contenthash].css',
                allChunks: true  // Needed for CommonsChunkPlugin. See official docs for info.
            }),*/
            new MiniCssExtractPlugin({
                filename: '[name].[chunkhash].css',
                chunkFilename: "[name].[chunkhash].css"
            }),

            /* UglifyJS - aliasing of this is scheduled for webpack v4.0.0
             * the below code was for 3.0
             */
            /*new UglifyJSPlugin({
                test: /\.js($|\?)/i,
                sourceMap: true,
            }),*/

            // HTML creation
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'src/html/t_index.html'),
                //inject: true,
                chunks: ['index', 'vendors', 'runtime~index'],
                filename: '../index.html'
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'src/html/t_login.html'),
                //inject: true,
                chunks: ['login', 'vendors', 'runtime~login'],
                filename: '../login.html'
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'src/html/t_chat.html'),
                //inject: true,
                chunks: ['chat', 'vendors', 'runtime~chat'],
                filename: '../chat.html'
            }),

            // Webpack caching. This is needed to cache the manifest file correctly
            // For development builds, we use NamedModulesPlugin instead
            new webpack.HashedModuleIdsPlugin(),

            /* Concatenate modules together (a.k.a. "module hoisting"). This improves browser execution time, but
             * decrease build speed. This also does not work with Hot Module Replacement and thus should be enabled
             * in production only.
             * ===
             * webpack 4.0 --> this is in their default config
             * optimization.concatenateModules  // on by default in production mode
             */
            //new webpack.optimize.ModuleConcatenationPlugin(),

        ],

        devtool: 'source-map',

        optimization: {
            minimizer: [
                new UglifyJSPlugin({
                    sourceMap: true
                }),
            ],
            concatenateModules: true
        },
    });
};