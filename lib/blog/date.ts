export function getPrettyDate(date: string, locale: string) {
  return new Date(date).toLocaleString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
