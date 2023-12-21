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
      async redirects() {
        return [
          {
            source: '/en/galeria',
            destination: '/en/gallery',
            locale: false,
            permanent: true
          },
          {
            source: '/ca/tienda',
            destination: '/ca/tenda',
            locale: false,
            permanent: true
          },
          {
            source: '/en/tienda',
            destination: '/en/store',
            locale: false,
            permanent: true
          },
          {
            source: '/ca/tienda/impresiones',
            destination: '/ca/tenda/impressions',
            locale: false,
            permanent: true
          },
          {
            source: '/en/tienda/impresiones',
            destination: '/en/store/prints',
            locale: false,
            permanent: true
          },
          {
            source: '/en/sobre-mi',
            destination: '/en/about-me',
            locale: false,
            permanent: true
          },
          {
            source: '/ca/politica-de-privacidad',
            destination: '/ca/politica-de-privacitat',
            locale: false,
            permanent: true
          },
          {
            source: '/en/politica-de-privacidad',
            destination: '/en/privacy-policy',
            locale: false,
            permanent: true
          },
          {
            source: '/ca/politica-de-cookies',
            destination: '/ca/politica-de-galetes',
            locale: false,
            permanent: true
          },
          {
            source: '/en/politica-de-cookies',
            destination: '/en/cookies-policy',
            locale: false,
            permanent: true
          }
        ]
      },
      async rewrites() {
        return [
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
            source: '/ca/tenda',
            destination: '/ca/tienda',
            locale: false
          },
          {
            source: '/en/store',
            destination: '/en/tienda',
            locale: false
          },
          {
            source: '/ca/tenda/impressions',
            destination: '/ca/tienda/impresiones',
            locale: false
          },
          {
            source: '/en/store/prints',
            destination: '/en/tienda/impresiones',
            locale: false
          },
          {
            source: '/en/about-me',
            destination: '/en/sobre-mi',
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
