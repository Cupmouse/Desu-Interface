import path from 'path';

export default {
  mode: 'development',
  entry: ['babel-polyfill', './src/app.jsx'],
  output: {
    path: path.join(__dirname, 'public/js/'),
    publicPath: '/js/',
    filename: 'bundled.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    port: 3001,
    historyApiFallback: {
      index: 'index.html',
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      },
    ],
  },
};
