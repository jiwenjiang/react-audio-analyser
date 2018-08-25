/**
 * Created by j_bleach on 2018/8/25.
 */
"use strict"

const path = require("path")
const webpack = require("webpack")

const resolve = dir => path.join(__dirname, ".", dir)

module.exports = {
    entry: {
        audioAnalyser: "./src/component/index.js"
    },
    output: {
        path: resolve("dist"),
        filename: "[name].js",
        libraryTarget: "umd",
        library: "audioAnalyser",
        libraryExport: "default"
    },
    module: {
        strictExportPresence: true,

        rules: [
            {
                test: /\.(js)$/,
                loader: "eslint-loader",
                enforce: "pre",
                include: [resolve("src")]
            },
            {
                oneOf: [
                    // "url" loader works just like "file" loader but it also embeds
                    // assets smaller than specified size as data URLs to avoid requests.
                    // Process JS with Babel.
                    {
                        test: /\.(js|jsx|mjs)$/,
                        include: [resolve("src")],
                        loader: require.resolve("babel-loader"),
                        options: {
                            compact: true
                        },
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                // Disabled because of an issue with Uglify breaking seemingly valid code:
                // https://github.com/facebookincubator/create-react-app/issues/2376
                // Pending further investigation:
                // https://github.com/mishoo/UglifyJS2/issues/2011
                comparisons: false
            },
            mangle: {
                safari10: true
            },
            output: {
                comments: false,
                // Turned on because emoji and regex is not minified properly using default
                // https://github.com/facebookincubator/create-react-app/issues/2488
                ascii_only: true
            }
        })
    ],
    node: {
        dgram: "empty",
        fs: "empty",
        net: "empty",
        tls: "empty",
        child_process: "empty"
    }

}