const nextTranslate = require('next-translate')

module.exports = nextTranslate({
  reactStrictMode: true,
  i18n: {
    locales: ['es'],
    defaultLocale: 'es'
  },
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    return config
  }
})
