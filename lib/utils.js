import resolveConfig from 'tailwindcss/resolveConfig.js'
import tailwindConfig from '../tailwind.config.js'
import {paramCase, headerCase, camelCase} from 'change-case'
import removeAccents from 'remove-accents'
import {PENDING_EVAL_SORTING_OPTIONS} from '../config/gallery.js'

const config = resolveConfig(tailwindConfig)
const {screens: themeScreens} = config.theme

export const fetcher = {
  get: async (url, options) => {
    const response = await fetch(url, options)

    return response.json()
  }
}

export const screens = Object.keys(themeScreens).reduce(
  (acc, screen) => ({
    ...acc,
    [screen]: Number(themeScreens[screen].split('px')[0])
  }),
  {}
)

export function getTitle(slug) {
  return headerCase(slug)
}

export function getSlug(name) {
  return paramCase(removeAccents(name))
}

function getDeepProperty(obj, property) {
  const propertyValue = property.split('.').reduce((acc, key) => {
    const value = acc[camelCase(key)]
    const needsEval =
      PENDING_EVAL_SORTING_OPTIONS.includes(property) &&
      typeof value === 'string' &&
      value.includes('/')

    return needsEval ? eval(value) : value
  }, obj)

  return propertyValue
}

export function sortListBy(list, property) {
  const isDeepProperty = property.includes('.')
  const sortedList = list.sort((a, b) => {
    const isFirstGreaterOrEqual = isDeepProperty
      ? getDeepProperty(a, property) >= getDeepProperty(b, property)
      : a[property] >= b[property]

    return isFirstGreaterOrEqual ? 1 : -1
  })

  return sortedList
}

export {themeScreens}
