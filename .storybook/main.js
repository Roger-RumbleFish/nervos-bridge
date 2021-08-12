const path = require('path')
const webpack = require('webpack')

module.exports = {
  core: {
    builder: 'webpack5',
  },
  typescript: {
    check: false,
    checkOptions: {
      typescript: {
        tsconfig: `${path.join(__dirname, '../')}/tsconfig.build.json`,
      },
    },
  },
  stories: ['../src/**/*.stories.@(tsx|mdx)'],
  addons: ['@storybook/addon-essentials'],
  webpackFinal: async (config) => {
    const rootPath = path.join(__dirname, '../')
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test.test('.svg'),
    )
    fileLoaderRule.exclude = /\.svg$/
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader'],
    })

    config.module.rules.push({
      test: /\.(png|woff2|ttf|jpe?g|gif)$/i,
      use: ['file-loader'],
    })

    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      }),
    )

    config.resolve.alias = {
      ...config.resolve.alias,
      '@api': path.resolve(rootPath, 'src/api/'),
      '@components': path.resolve(rootPath, 'src/components/'),
      '@interfaces': path.resolve(rootPath, 'src/interfaces/'),
      '@state': path.resolve(rootPath, 'src/state/'),
      '@styles': path.resolve(rootPath, 'src/styles/'),
      '@utils': path.resolve(rootPath, 'src/utils/'),
    }
    config.resolve.fallback = {
      fs: false,
      crypto: false,
      path: false,
      http: false,
      https: false,
      os: require.resolve('os-browserify/browser'),
      stream: require.resolve('stream-browserify'),
    }

    return config
  },
}
