var webpack = require('webpack');
var minimize = process.argv.indexOf('--no-minimize') === -1 ? true : false;
var plugins = minimize ? [new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    compress: {
        drop_console: true
    }
})] : [];

module.exports = {
    entry: './src/entry.js',
    output: {
        path: './dist',
        filename: minimize ? 'vissense.min.js' : 'vissense.js',
        libraryTarget: 'umd',
        library: 'vissense'
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel'
        }]
    },
    plugins: plugins
};
