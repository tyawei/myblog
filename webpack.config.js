var path=require('path');
var webpack=require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin"); 
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

var PORT = 8080;
var HOSTNAME = '127.0.0.1';

var env = process.env.NODE_ENV
var envPlugins = env==='development'?
	[
		new webpack.HotModuleReplacementPlugin(),
		new CommonsChunkPlugin({
           name: 'vendor',
           filename: 'vendor.js'
        })
    ]:
    [
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
	      'process.env.NODE_ENV': JSON.stringify(env)
	    })
    ]


module.exports={
	devtool: env==='development'? 'eval-source-map':false,
	entry: {
		index: env==='development'?
			[
				'react-hot-loader/patch',
				'webpack-dev-server/client?http://'+HOSTNAME+':'+PORT,
				'./src/pages/index.js'
			] : './src/pages/index.js',
		vendor: ['react', 'react-dom', 'jquery', 'react-router-dom']
	},
	output:{
		path: path.resolve(__dirname,'./dist'),
		filename:'bundle.js',
		publicPath: '/'
	},
	devServer: env==='development'? {
		contentBase: './dist',
		inline: true,
		historyApiFallback: true,
		port:PORT,
		host: HOSTNAME
	}:{},
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
		new ExtractTextPlugin('style.css'),
		...envPlugins
	]
}


