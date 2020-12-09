var path = require("path");
var webpack = require("webpack");

module.exports = function (env) {
  var pack = require("./package.json");
  var MiniCssExtractPlugin = require("mini-css-extract-plugin");

  var production = !!(env && env.production === "true");
  var asmodule = !!(env && env.module === "true");
  var standalone = !!(env && env.standalone === "true");

  var babelSettings = {
    extends: path.join(__dirname, "/.babelrc"),
  };

  var config = {
    mode: production ? "production" : "development",
    entry: {
      myapp: "./sources/myapp.js",
    },
    output: {
      path: path.join(__dirname, "codebase"),
      publicPath: "/codebase/",
      filename: "[name].js",
      chunkFilename: "[name].bundle.js",
    },
    module: {
    //   loaders: [
    //     {
    //       test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
    //       use: [
    //         {
    //           loader: "file-loader",
    //           options: {
    //             name: "[name].[ext]",
    //             outputPath: "fonts/",
    //           },
    //         },
    //       ],
    //     },
    //   ],
      rules: [
        {
          test: /\.js$/,
          use: "babel-loader?" + JSON.stringify(babelSettings),
        },
        {
          test: /\.(svg|png|jpg|gif)$/,
          use: "url-loader?limit=25000",
        },
        {
          test: /\.(less|css)$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
        },
      ],
    },
    stats: "minimal",
    resolve: {
      extensions: [".js"],
      modules: ["./sources", "node_modules"],
      alias: {
        "services": path.resolve(__dirname, "sources/services"),
        "models": path.resolve(__dirname, "sources/models"),
        "jet-views": path.resolve(__dirname, "sources/views"),
        "jet-locales": path.resolve(__dirname, "sources/locales"),
      },
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css",
      }),
      new webpack.DefinePlugin({
        VERSION: `"${pack.version}"`,
        APPNAME: `"${pack.name}"`,
        PRODUCTION: production,
        BUILD_AS_MODULE: asmodule || standalone,
      }),
    ],
    devServer: {
      stats: "errors-only",
    },
  };

  if (!production) {
    config.devtool = "eval-source-map"; //Was using inline-source-map originally
  }

  if (asmodule) {
    if (!standalone) {
      config.externals = config.externals || {};
      config.externals = ["webix-jet"];
    }

    const out = config.output;
    const sub = standalone ? "full" : "module";

    out.library = pack.name.replace(/[^a-z0-9]/gi, "");
    out.libraryTarget = "umd";
    out.path = path.join(__dirname, "dist", sub);
    out.publicPath = "/dist/" + sub + "/";
  }

  return config;
};
