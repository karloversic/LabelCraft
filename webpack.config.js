const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');


module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/i,
                include: path.resolve(__dirname, 'src'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                include: path.resolve(__dirname, 'src'),
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ],
    },
    optimization: {
        minimizer: [
            new TerserPlugin(),
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            // injects bundle.js to our new index.html
            inject: true,
            // copys the content of the existing index.html to the new /build index.html
            template: path.resolve('./index.html'), // Path to your HTML template
            filename: 'index.html', // Output filename for the generated HTML
        }),
        // new BundleAnalyzerPlugin({
        //     // Optional configuration options
        //     analyzerMode: 'static', // Set to 'server' to start an HTTP server
        //     reportFilename: 'report.html', // Name of the report file
        //     openAnalyzer: false, // Don't open the report automatically in the browser
        // }),
    ],
    devServer: {
        static: 'dist',
        port: 8080,
    },
};