var path=require('path');
var webpack=require('webpack');

var ExtractTextPlugin = require("extract-text-webpack-plugin"); 
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

// var proxy=require("http-proxy-middleware");

module.exports={
	// devtool: 'eval-source-map',
	entry: {
		index: './app/index.js',
		vendor: ['react', 'react-dom', 'react-router-dom', 'jquery']
	},
	output:{
		path: path.resolve(__dirname,'./build'),
		filename:'bundle.js',
		publicPath: '/'
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
		new ExtractTextPlugin('style.css'),
		new webpack.optimize.CommonsChunkPlugin({
           name: 'vendor',
           filename: 'vendor.js'
        }),
        new webpack.optimize.UglifyJsPlugin({
	      compress: {
	        warnings: false
	      }
	    }),
	    new webpack.DefinePlugin({
	      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
	    })
	]
}