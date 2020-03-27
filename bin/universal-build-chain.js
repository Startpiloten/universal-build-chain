#!/usr/bin/env node

const figlet = require('figlet');
const inquirer = require('inquirer');
const shell = require('shelljs');
const clc = require("cli-color");
const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StyleLintPlugin = require('stylelint-webpack-plugin');
const WebpackBar = require('webpackbar');
const CopyPlugin = require('copy-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

// variables:
const executePath = process.cwd();

// helpers:
const logging = function () {
    console.log(process.cwd());
    console.log(path.resolve(__dirname, '.stylelintrc.json'));
};

// welcome text
const welcomeText = function () {
    figlet('Universal Build Chain', function (err, data) {
        if (err) {
            console.dir(err);
            return;
        }
        console.log(data);
    });
};

// shelljs comand runner
const runCmd = function (command) {
    shell.exec(command, { silent: true }, function (code, stdout) {
        if (code === 0) {
            console.log(clc.greenBright(stdout));
        } else if (code === 1) {
            console.log(clc.redBright(stdout));
        }
    });
};

const compileWebpack = webpack({
    mode: 'development',
    devtool: "inline-source-map",
    entry: './ubc.js',
    output: {
        path: executePath + '/dist',
    },
    stats: 'errors-only',
    optimization: {
        minimizer: [new UglifyJsPlugin()]
    },
    resolveLoader: {
        modules: ['node_modules', path.resolve(__dirname, '../node_modules')],
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                options: {
                    sourceMap: true,
                    cache: false,
                    configFile: path.resolve(__dirname, '.eslintrc.json'),
                    emitError: true,
                    emitWarning: true,
                    failOnError: false,
                    failOnWarning: false,
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        sourceMap: true,
                        presets: [path.resolve(__dirname, '../node_modules/@babel/preset-env')],
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'resolve-url-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            autoprefixer: {
                                browsers: ["> 5%"]
                            },
                            sourceMap: true,
                            plugins: [
                                require('autoprefixer'),
                                require('cssnano')
                            ],
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'Fonts/'
                }
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            outputPath: 'Images/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new WebpackBar({
            clear: false,
            profile: true,
        }),
        new FriendlyErrorsWebpackPlugin(),
        new MiniCssExtractPlugin({}),
        new UglifyJsPlugin({
            extractComments: true,
            sourceMap: true
        }),
        new StyleLintPlugin({
            configFile: path.resolve(__dirname, '.stylelintrc.json'),
            syntax: 'scss',
            files: '**/*.scss',
            quiet: false,
            emitError: true,
            emitWarning: true,
            failOnError: false,
            failOnWarning: false,
        }),
    ],
});

// collection of tasks
const runAll = function () {
    setTimeout(function () {
        logging();
        compileWebpack.run();
    }, 200);
};

// execute all
welcomeText();
runAll();
