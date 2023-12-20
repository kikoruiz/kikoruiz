import withBundleAnalyzer from '@next/bundle-analyzer'
import nextTranslate from 'next-translate-plugin'
import withPlaiceholder from '@plaiceholder/next'

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})(
  withPlaiceholder(
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
          },
          {
            source: '/ca/politica-de-privacitat',
            destination: '/ca/politica-de-privacidad',
            locale: false
          },
          {
            source: '/en/privacy-policy',
            destination: '/en/politica-de-privacidad',
            locale: false
          },
          {
            source: '/ca/politica-de-galetes',
            destination: '/ca/politica-de-cookies',
            locale: false
          },
          {
            source: '/en/cookies-policy',
            destination: '/en/politica-de-cookies',
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
)

export default nextConfig
