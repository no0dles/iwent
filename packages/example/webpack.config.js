const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        path: path.join(__dirname, 'dist/bundle'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunkhash.bundle.js',
        publicPath: '/',
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    plugins: [new HtmlWebpackPlugin({
        template: 'src/index.html'
    })],
};