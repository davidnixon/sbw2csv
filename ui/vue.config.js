module.exports = {
  devServer: {
    proxy: {
      '/services': {
        target: 'http://localhost:' + process.env.SERVICES_PORT,
        xfwd: true,
        pathRewrite: { '^/services/': '' },
        autoRewrite: true,
        hostRewrite: true,
      },
    },
  },
};
