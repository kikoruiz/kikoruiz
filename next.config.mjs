import withBundleAnalyzer from '@next/bundle-analyzer'
import nextTranslate from 'next-translate-plugin'
import withPlaiceholder from '@plaiceholder/next'
import http from './next.http.config.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})(
  withPlaiceholder(
    nextTranslate({
      reactStrictMode: true,
      serverExternalPackages: ['sharp', 'fast-average-color-node'],
      images: {
        deviceSizes: [640, 1080, 1920],
        imageSizes: [],
        loader: 'custom',
        loaderFile: './lib/image-loader.js'
      },
      i18n: {
        locales: ['es', 'ca', 'en'],
        defaultLocale: 'es'
      },
      async redirects() {
        return http.redirects
      },
      async rewrites() {
        return http.rewrites
      },
      async headers() {
        return http.headers
      },
      turbopack: {
        rules: {
          '*.svg': {
            loaders: ['@svgr/webpack'],
            as: '*.js'
          }
        }
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
