var path=require('path');
var webpack=require('webpack');
var PORT = 8080;
var HOSTNAME = '127.0.0.1';
var ExtractTextPlugin = require("extract-text-webpack-plugin"); 
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

// var proxy=require("http-proxy-middleware");

module.exports={
	devtool: 'eval-source-map',
	entry: {
		index: [
			'react-hot-loader/patch',
			'webpack-dev-server/client?http://'+HOSTNAME+':'+PORT,
			// 'webpack/hot/only-dev-server',
			'./src/pages/index.js'
		],
		vendor: ['react', 'react-dom', 'react-router', 'jquery', 'react-router-dom']
	},
	output:{
		// path: path.resolve(__dirname,'./build'),
		filename:'bundle.js',
		publicPath: '/'
	},
	devServer: {
		contentBase: "./",
		inline: true,
		historyApiFallback: true,
		port:PORT,
		host: HOSTNAME
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json']
	},
	module: {
		loaders: [
			{
				test: /\.js?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets:['es2015', 'stage-0', 'react'],
					plugins: [
						['import', {libraryName: 'antd', style: 'css'}]
					]
				}
			},
			{
				test: /\.css$/, 
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader'
				})
			},
			{
				test: /\.scss$/, 
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader!sass-loader'
				})
			},
			{
		       	test: /\.(png|jpg|eot|svg|woff|ttf)$/, 
		        loader: 'url-loader?limit=8192'
		    }
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new ExtractTextPlugin('style.css'),
		new CommonsChunkPlugin({
           name: 'vendor',
           filename: 'vendor.js'
        })
	]
}


