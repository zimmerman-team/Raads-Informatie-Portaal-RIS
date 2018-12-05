module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        loaders: [
          {
            loader: require.resolve('style-loader'),
          },
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          require.resolve('sass-loader')
        ],
      },
    ],
  },
}
