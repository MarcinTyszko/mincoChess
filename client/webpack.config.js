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
    entry: {
        analysis: "./src/apps/features/analysis/index.tsx",
        archive: "./src/apps/features/archive/index.tsx",
        news: "./src/apps/features/news/index.tsx",

        signin: "./src/apps/account/signin/index.tsx",
        profile: "./src/apps/account/profile/index.tsx",

        helpCenter: "./src/apps/footer/helpCenter/index.tsx",
        privacyPolicy: "./src/apps/footer/privacyPolicy/index.tsx",
        credits: "./src/apps/footer/credits/index.tsx",

        settings: "./src/apps/settings/index.tsx",
        internal: "./src/apps/internal/index.tsx",
        unfound: "./src/apps/unfound/index.tsx"
    },
    output: {
        filename: "[name].bundle.js",
        path: resolve("./dist")
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        alias: {
            "@": resolve("./src"),
            "@analysis": resolve("./src/apps/features/analysis"),
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