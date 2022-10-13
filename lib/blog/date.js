export function getPrettyDate(date, locale) {
  return new Date(date).toLocaleString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
