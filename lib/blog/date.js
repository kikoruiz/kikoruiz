export function getPrettyDate(date, locale) {
  return new Date(date).toLocaleString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}
