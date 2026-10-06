const fs = require('node:fs')
const path = require('node:path')

// `next-sitemap` runs on plain Node, so sharing the app's TypeScript helpers
// instead of duplicating them here needs the `tsx` require hook.
require('tsx/cjs')
const {getSlug} = require('./lib/utils/index.ts')

const picturesFile = path.join(__dirname, 'data/pictures/metadata.json')
const prerenderManifestFile = path.join(
  __dirname,
  '.next/prerender-manifest.json'
)
const PHOTO_PATHS = ['/foto', '/ca/foto', '/en/photo']

function getPhotoFields(config) {
  const pictures = JSON.parse(fs.readFileSync(picturesFile, 'utf8'))

  return pictures.flatMap(({title, createDate, processingDate}) => {
    const slug = getSlug(title)
    const lastmod = new Date(processingDate ?? createDate).toISOString()

    return PHOTO_PATHS.map(photoPath => ({
      loc: `${config.siteUrl}${photoPath}/${slug}`,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod
    }))
  })
}

// `/en/galeria/*` are only the physical routes the English gallery is
// rewritten from, so they are excluded and their public `/en/gallery/*` twins
// have to be listed here or the whole English gallery goes missing.
function getEnglishGalleryFields(config) {
  const {routes} = JSON.parse(fs.readFileSync(prerenderManifestFile, 'utf8'))

  return Object.keys(routes)
    .filter(
      route => route === '/en/galeria' || route.startsWith('/en/galeria/')
    )
    .map(route => ({
      loc: `${config.siteUrl}${route.replace('/en/galeria', '/en/gallery')}`,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString()
    }))
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.kikoruiz.es',
  generateRobotsTxt: true,
  exclude: [
    '/404',
    '/500',
    '/*/404',
    '/*/500',
    '/ca/tienda',
    '/ca/tienda/impresiones',
    '/en/tienda',
    '/en/tienda/impresiones',
    '/en/galeria',
    '/en/galeria/*',
    '/en/sobre-mi',
    '/en/sobre-mi/curriculum',
    '/ca/politica-de-privacidad',
    '/en/politica-de-privacidad',
    '/ca/politica-de-cookies',
    '/en/politica-de-cookies',
    '/ca/derechos-de-autor',
    '/en/derechos-de-autor',
    '/ca/terminos-y-condiciones',
    '/en/terminos-y-condiciones',
    // Photo pages come back through `additionalPaths`, which is where the
    // English ones get their translated path and each one its own `lastmod`.
    '/foto/*',
    '/ca/foto/*',
    '/en/foto/*'
  ],
  robotsTxtOptions: {
    policies: [{userAgent: '*', allow: '/', disallow: ['/api/']}]
  },
  transform: async (config, path) => ({
    loc: `${config.siteUrl}${path}`,
    changefreq: config.changefreq,
    priority: config.priority,
    lastmod: new Date().toISOString()
  }),
  additionalPaths: async config => [
    ...getEnglishGalleryFields(config),
    ...getPhotoFields(config)
  ]
}
