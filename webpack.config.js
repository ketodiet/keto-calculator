var webpack = require("webpack");
var path = require("path");
var loaders = require("./webpack.loaders");

module.exports = {
	entry: [
		"./index.jsx"
	],
	output: {
		path: __dirname + "/public",
		filename: "bundle.js"
	},
	resolve: {
		extensions: ["", ".js", ".jsx"]
	},
	module: {
		loaders: loaders
	},
	devServer: {
		contentBase: "./public",
        inline: true,
        noInfo: true,
        host: "0.0.0.0"
	},

devtool: process.env.WEBPACK_DEVTOOL || "source-map",
	plugins: [
		new webpack.NoErrorsPlugin()
	]
};
