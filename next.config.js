const nextTranslate = require('next-translate')
const {withPlaiceholder} = require('@plaiceholder/next')

module.exports = withPlaiceholder(
  nextTranslate({
    reactStrictMode: true,
    images: {
      formats: ['image/avif', 'image/webp']
    },
    i18n: {
      locales: ['es', 'ca', 'en'],
      defaultLocale: 'es'
    },
    async rewrites() {
      return [
        {
          source: '/en/about-me',
          destination: '/en/sobre-mi',
          locale: false
        },
        {
          source: '/en/gallery',
          destination: '/en/galeria',
          locale: false
        },
        {
          source: '/en/gallery/:slug',
          destination: '/en/galeria/:slug',
          locale: false
        },
        {
          source: '/en/gallery/tags/:tag',
          destination: '/en/galeria/tags/:tag',
          locale: false
        }
      ]
    },
    webpack: config => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack']
      })

      return config
    }
  })
)
