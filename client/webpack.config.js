const { Configuration } = require("webpack");
const { resolve } = require("path");
require("dotenv").config({
    path: "../.env"
});

const DotenvPlugin = require("dotenv-webpack");

const nodeEnv = process.env.NODE_ENV || "production";

/**
 * @type {Configuration}
 */
module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js",
        path: resolve("./dist")
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        alias: {
            "@pages": resolve("./src/pages"),
            "@components": resolve("./src/components"),
            "@hooks": resolve("./src/hooks"),
            "@constants": resolve("./src/constants"),
            "@stores": resolve("./src/stores"),
            "@ctypes": resolve("./src/types"),
            "@i18n": resolve("./src/i18n"),
            "@lib": resolve("./src/lib"),
            "@assets": resolve("./public")
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                use: "babel-loader"
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp|ttf|mp3)$/i,
                type: "asset"
            }
        ]
    },
    plugins: [
        new DotenvPlugin({ path: "../.env" })
    ],
    mode: nodeEnv
};