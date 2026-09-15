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
    '/en/terminos-y-condiciones'
  ],
  robotsTxtOptions: {
    policies: [{userAgent: '*', allow: '/', disallow: ['/api/']}]
  },
  transform: async (config, path) => ({
    loc: `${config.siteUrl}${path}`,
    changefreq: config.changefreq,
    priority: config.priority,
    lastmod: new Date().toISOString()
  })
}
