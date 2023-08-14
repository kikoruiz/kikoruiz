export function getPrettyDate(date: string, locale: string) {
  return new Date(date).toLocaleString(locale, {
    month: locale === 'ca' ? 'long' : 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
