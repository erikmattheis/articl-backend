module.exports = {
  sourceMap: true,
  plugins: [
    require('postcss-font-awesome'),
    require('cssnano')({
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true
          }
        }
      ]
    })
  ]
};
