module.exports = {
  devServer: {
    proxy: {
      '/services': {
        target: 'http://localhost:3000',
        xfwd: true,
        pathRewrite: {'^/services/': ''},
        autoRewrite: true,
        hostRewrite: true,
      },
    },
  },
};
