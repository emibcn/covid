// Script to enable webpack-bundle-analyzer
// https://medium.com/@hamidihamza/optimize-react-web-apps-with-webpack-bundle-analyzer-6ecb9f162c76
process.env.NODE_ENV = 'production'
const webpack = require('webpack')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpackConfigProd = require('react-scripts/config/webpack.config')(
  'production'
)

webpackConfigProd.plugins.push(
  new BundleAnalyzerPlugin({
    analyzerHost: '0.0.0.0',
    analyzerPort: 3001,
    openAnalyzer: false
  })
)

// actually running compilation and waiting for plugin to start explorer
webpack(webpackConfigProd, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(err)
  }
})
