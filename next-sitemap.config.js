/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.kikoruiz.es',
  generateRobotsTxt: true,
  exclude: ['/404', '/500'],
  alternateRefs: [
    {href: 'https://www.kikoruiz.es', hreflang: 'es'},
    {href: 'https://www.kikoruiz.es/ca', hreflang: 'ca'},
    {href: 'https://www.kikoruiz.es/en', hreflang: 'en'}
  ],
  robotsTxtOptions: {
    policies: [{userAgent: '*', allow: '/', disallow: ['/api/']}]
  }
}
