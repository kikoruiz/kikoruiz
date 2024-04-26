function getPriceFormatter({language, value}) {
  return Intl.NumberFormat(locales[language], {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: (value | 0) < value ? 2 : 0
  })
}

const locales = {ca: 'ca-ES', en: 'en-EN', es: 'es-ES'}
const i18 = {
  defaultNS: 'common',
  pages: {
    '*': ['common'],
    '/': ['home', 'gallery'],
    '/sobre-mi': ['about-me'],
    'rgx:/galeria*': ['gallery'],
    'rgx:/blog*': ['blog'],
    'rgx:/tienda*': ['store']
  },
  interpolation: {
    format: (value, format, language) => {
      if (format === 'price') {
        const priceFormatter = getPriceFormatter({language, value})

        return priceFormatter.format(value)
      }

      return value
    }
  },
  loadLocaleFrom: (locale, namespace) =>
    import(`./locales/${locale}/${namespace}.json`).then(
      module => module.default
    )
}

module.exports = i18
