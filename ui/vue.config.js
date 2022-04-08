module.exports = {
  css: {
    loaderOptions: {
      scss: {
        sassOptions: {
          quietDeps: true,
        },
      },
    },
  },
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
