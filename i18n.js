const i18 = {
  defaultNS: 'common',
  pages: {
    '*': ['common'],
    '/': ['home', 'gallery'],
    '/sobre-mi': ['about-me'],
    'rgx:/galeria*': ['gallery'],
    'rgx:/blog*': ['blog']
  },
  loadLocaleFrom: (locale, namespace) =>
    import(`./locales/${locale}/${namespace}.json`).then(
      module => module.default
    )
}

module.exports = i18
