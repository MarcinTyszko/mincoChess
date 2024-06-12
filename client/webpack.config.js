const { Configuration } = require("webpack");
const { resolve } = require("path");
require("dotenv").config({
    path: "../.env"
});

const nodeEnv = process.env.NODE_ENV == "dev" ? "development" : "production";

/**
 * @type {Configuration}
 */
module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js",
        path: resolve("./dist"),
        //assetModuleFilename: "[query][hash][ext]"
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        alias: {
            "@pages": resolve("./src/pages"),
            "@components": resolve("./src/components"),
            "@constants": resolve("./src/constants"),
            "@contexts": resolve("./src/contexts"),
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
                test: /\.(png|jpe?g|gif|svg|webp|ttf)$/i,
                type: "asset"
            }
        ]
    },
    mode: nodeEnv
};