import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from 'tailwind.config'
import {paramCase, headerCase, camelCase, pascalCase} from 'change-case'
import removeAccents from 'remove-accents'
import {PENDING_EVAL_SORTING_OPTIONS} from 'config/gallery'
import {Screens, ThemeScreens} from 'types'

const config = resolveConfig(tailwindConfig)
export const {screens: themeScreens}: {screens?: ThemeScreens} =
  config.theme as object

export const fetcher = {
  get: async (url: RequestInfo, options?: RequestInit) => {
    const response = await fetch(url, options)

    return response.json()
  }
}

export const screens = Object.keys(themeScreens).reduce(
  (acc, screen) => ({
    ...acc,
    [screen]: Number(themeScreens[screen].split('px')[0])
  }),
  {} as Screens
)

export function getTitle(slug: string) {
  return headerCase(slug)
}

export function getCapitalizedName(slug: string) {
  return pascalCase(slug)
}

export function getSlug(name: string) {
  return paramCase(removeAccents(name))
}

function getDeepProperty(obj: object, property: string) {
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

export function sortListBy(list: object[], property: string) {
  const isDeepProperty = property.includes('.')
  const sortedList = list.sort((a, b) => {
    const isFirstGreaterOrEqual = isDeepProperty
      ? getDeepProperty(a, property) >= getDeepProperty(b, property)
      : a[property] >= b[property]

    return isFirstGreaterOrEqual ? 1 : -1
  })

  return sortedList
}

export function getAspectRatio(size: string): string {
  const [width, height] = size.split('x')
  const remainder = Number(width) / Number(height)
  const fixedRemainder = Number(remainder.toFixed(2))

  switch (fixedRemainder) {
    case 1:
      return '1:1'
    case 2:
      return '2:1'
    case 1.5:
    case 1.52:
      return '3:2'
    case 0.67:
      return '2:3'
    case 1.33:
      return '4:3'
    case 0.75:
      return '3:4'
    case 1.25:
      return '5:4'
    case 0.8:
      return '4:5'
    case 1.67:
      return '5:3'
    case 0.6:
      return '3:5'
    case 1.78:
      return '16:9'
    case 1.6:
      return '16:10'
    default:
      return ''
  }
}
