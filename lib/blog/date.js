import {DEFAULT_LOCALE} from '../../config/index.js'

export function getPrettyDate(date) {
  return new Date(date).toLocaleString(DEFAULT_LOCALE, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}
