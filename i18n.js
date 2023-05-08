module.exports = {
  defaultNS: 'common',
  pages: {
    '*': ['common'],
    '/': ['home', 'gallery'],
    '/sobre-mi': ['about-me'],
    'rgx:/galeria*': ['gallery'],
    'rgx:/blog*': ['blog']
  },
  loadLocaleFrom: (lang, ns) =>
    import(`./locales/${lang}/${ns}.json`).then(m => m.default)
}
