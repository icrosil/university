/**
 * author - Illia Olenchenko
 * group  - PM-1 (OM)
 */

const path = require('path');

module.exports = {
  entry: './server/public/js/index.js',
  output: {
    path: __dirname,
    filename: 'server/public/build/bundle.js',
  },
  module: {
    loaders: [
      {
        test: path.join(__dirname, 'server/public'),
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        loaders: ['style', 'css', 'sass'],
      },
    ],
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, './server/public')],
  },
};
