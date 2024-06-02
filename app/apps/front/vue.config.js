module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
    public: 'wfs.local',
    proxy: {
      '^/api': {
        target: 'http://wfs.local/api',
        ws: true,
        changeOrigin: true
      }
    }
  },
  //disableHostCheck: true,
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.module.rule('vue').uses.delete('cache-loader');
      config.module.rule('js').uses.delete('cache-loader');
      config.module.rule('ts').uses.delete('cache-loader');
      config.module.rule('tsx').uses.delete('cache-loader');
    }
  }
}
