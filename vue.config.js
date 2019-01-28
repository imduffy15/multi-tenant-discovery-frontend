module.exports = {
  devServer: {
    disableHostCheck: true,
    proxy: {
      "^/auth": {
        target: "http://localhost:9080",
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
