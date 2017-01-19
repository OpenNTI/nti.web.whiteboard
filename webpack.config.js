/*eslint no-var: 0*/
exports = module.exports = {
	entry: './src/index.js',
	output: {
		path: 'lib/',
		filename: 'index.js',
		library: true,
		libraryTarget: 'commonjs2'
	},

	cache: true,
	devtool: 'source-map',

	node: {
		global: false
	},

	target: 'web',

	resolve: {
		extensions: ['', '.jsx', '.js']
	},


	externals: [
		// Every non-relative module is external
		// abc -> require("abc")
		/^[a-z\-0-9]+/i
	],

	module: {
		loaders: [
			{
				test: /\.js(x?)$/i,
				exclude: /node_modules/,
				loader: 'babel',
				query: {
					sourceMaps: true
				}
			},
			{ test: /\.json$/, loader: 'json' }
		]
	}
};
