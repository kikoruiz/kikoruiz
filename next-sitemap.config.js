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
const PICTURE_ROUTE = /^(?:\/(?:ca|en))?\/galeria\/(?!tags\/)[^/]+\/([^/]+)$/

let pictures

function getPictures() {
  if (!pictures) {
    pictures = new Map(
      JSON.parse(fs.readFileSync(picturesFile, 'utf8')).map(
        ({title, fileName, createDate, processingDate}) => [
          getSlug(title),
          {
            id: fileName.replace(/\.[^.]+$/, ''),
            lastmod: new Date(processingDate ?? createDate).toISOString()
          }
        ]
      )
    )
  }

  return pictures
}

// Every picture page can tell when its picture was last worked on, which is a
// far better `lastmod` than the moment the sitemap happened to be built.
function getLastmod(route) {
  const [, slug] = route.match(PICTURE_ROUTE) ?? []

  return getPictures().get(slug)?.lastmod ?? new Date().toISOString()
}

// The picture itself is listed with its page, which is what lets Google Images
// find it from the sitemap and not only by crawling.
function getImages(route, config) {
  const [, slug] = route.match(PICTURE_ROUTE) ?? []
  const picture = getPictures().get(slug)

  return picture
    ? [
        {
          loc: new URL(
            `${config.siteUrl}/pictures/optimized/${picture.id}-1920w.webp`
          )
        }
      ]
    : undefined
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
      lastmod: getLastmod(route),
      images: getImages(route, config)
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
    '/ca/tienda/descargas',
    '/en/tienda',
    '/en/tienda/impresiones',
    '/en/tienda/descargas',
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
    '/ca/licencia-de-descargas',
    '/en/licencia-de-descargas',
    // Carries the holder's tax ID and address, so it stays out of search.
    '/aviso-legal',
    '/ca/aviso-legal',
    '/en/aviso-legal'
  ],
  robotsTxtOptions: {
    policies: [
      {userAgent: '*', allow: '/', disallow: ['/api/']},
      // The copyright page reserves the pictures against text and data mining,
      // and this is the machine-readable form of that reservation. These are
      // the crawlers that gather training data, not the ones behind search.
      ...[
        'GPTBot',
        'Google-Extended',
        'CCBot',
        'ClaudeBot',
        'anthropic-ai',
        'Applebot-Extended',
        'Bytespider',
        'meta-externalagent'
      ].map(userAgent => ({userAgent, disallow: '/'}))
    ]
  },
  transform: async (config, path) => ({
    loc: `${config.siteUrl}${path}`,
    changefreq: config.changefreq,
    priority: config.priority,
    lastmod: getLastmod(path),
    images: getImages(path, config)
  }),
  additionalPaths: async config => getEnglishGalleryFields(config)
}
