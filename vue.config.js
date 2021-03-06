module.exports = {
  devServer: {
    disableHostCheck: true,
    proxy: {
      "^/auth": {
        target: "https://account.dev.ianduffy.ie",
        secure: false,
        xfwd: false,
        changeOrigin: true
      },
      "^/api": {
        target: "http://localhost:8080",
        secure: false
      }
    }
  }
};
