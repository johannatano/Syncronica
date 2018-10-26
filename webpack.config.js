const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');

module.exports = env => {
  const config = {
    mode: eitherDevOrProd('development', 'production'),
    entry: {
      vendor: ['font-awesome-loader', 'bootstrap-loader'],
      polyfills: ['@babel/polyfill'],
      app: './src/app.js',
      admin: './src/admin.js'
    },
    output: {
      filename: eitherDevOrProd('[name].js', '[name].[chunkhash].js'),
      path: resolve(__dirname, 'assets')
    },
    module: {
      rules: [
        // Bootstrap 4
        {
          test: /bootstrap[\/\\]dist[\/\\]js[\/\\]umd[\/\\]/,
          use: 'imports-loader?jQuery=jquery'
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            // https://webpack.js.org/loaders/babel-loader
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        },
        {
          test: /\.s?css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.html$/,
          use: 'html-loader'
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          use: 'url-loader?limit=8192'
        },
        {
          test: /\.(woff2?|svg)$/,
          use: 'url-loader?limit=10000'
        },
        {
          test: /\.(ttf|eot)$/,
          use: 'file-loader'
        }
      ]
    },
    plugins: [
      new webpack.ProgressPlugin(),

      // Code Splitting - CSS
      new MiniCssExtractPlugin({
        filename: eitherDevOrProd('[name].css', '[name].[chunkhash].css')
      }),

      // Caching
      new HtmlWebpackPlugin({
        template: './src/index.ejs',
        favicon: './src/favicon.ico',
        chunks: ['vendor', 'polyfills', 'app']
      }),

       new HtmlWebpackPlugin({
        template: './src/admin.ejs',
        chunks: ['admin'],
        filename: './admin.html'
      }),
      
      // new InlineManifestWebpackPlugin(),

      /**
       *
       * @see https://github.com/shakacode/bootstrap-loader#bootstrap-4-internal-dependency-solution
       */
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Tether: 'tether',
        'window.Tether': 'tether',
        Popper: ['popper.js', 'default'],
        Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
        Button: 'exports-loader?Button!bootstrap/js/dist/button',
        Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
        Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
        Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
        Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
        Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
        Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
        Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
        Tooltip: 'exports-loader?Tooltip!bootstrap/js/dist/tooltip',
        Util: 'exports-loader?Util!bootstrap/js/dist/util'
      })
    ],
    optimization: {
      // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
      splitChunks: {
        chunks: 'all',
        name: false
      },
      runtimeChunk: 'single'
    },
    devServer: {
      contentBase: resolve(__dirname, 'assets'),
      compress: true,
      noInfo: false,
      historyApiFallback: true,
      https: false
    }
  };

  return config;

  function eitherDevOrProd(devStuff, prodStuff) {
    return env && env.production ? prodStuff : devStuff;
  }
};
