import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from 'tailwind.config.mjs'
import {kebabCase, capitalCase, camelCase, pascalCase} from 'change-case'
import removeAccents from 'remove-accents'
import {
  DEFAULT_IS_ASCENDING_ORDER,
  GALLERY_ALBUMS,
  PENDING_EVAL_SORTING_OPTIONS
} from 'config/gallery'
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
  return capitalCase(slug)
}

export function getCapitalizedName(slug: string) {
  return pascalCase(slug)
}

export function getSlug(name: string) {
  return kebabCase(removeAccents(name))
}

export function isNew(date: string, currentDate?: string) {
  const MONTHS_AS_NEW = 6
  const pointerDate = currentDate ? new Date(currentDate) : new Date()

  pointerDate.setMonth(pointerDate.getMonth() - MONTHS_AS_NEW)

  const itemDate = new Date(date)

  return itemDate.getTime() > pointerDate.getTime()
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
      : a[camelCase(property)] >= b[camelCase(property)]

    return isFirstGreaterOrEqual ? 1 : -1
  })

  return DEFAULT_IS_ASCENDING_ORDER ? sortedList : sortedList.reverse()
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
    case 0.56:
      return '9:16'
    case 1.6:
      return '16:10'
    default:
      return ''
  }
}

export async function getAverageColor(src: string) {
  const {getAverageColor: fastAverageColor} = await import(
    'fast-average-color-node'
  )
  const resourceFile = `public${src}`
  const color = await fastAverageColor(resourceFile)
  const {hex, isDark, isLight} = color

  return {hex, isDark, isLight}
}

export function getAverageValue(values: number[]) {
  const sum = values.reduce((previous, current) => (current += previous))

  return sum / values.length
}

function getSeason(date = new Date()) {
  const dayOfYear = getDayOfYear(date)

  if (dayOfYear >= 80 && dayOfYear <= 171) {
    return 'spring'
  } else if (dayOfYear >= 172 && dayOfYear <= 263) {
    return 'summer'
  } else if (dayOfYear >= 264 && dayOfYear <= 354) {
    return 'autumn'
  } else {
    return 'winter'
  }
}

function getDayOfYear(date = new Date()) {
  const startOfYear = new Date(date.getFullYear(), 0, 0)
  const difference = date.getTime() - startOfYear.getTime()
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000 // hours * minutes * seconds * milliseconds
  const dayOfYear = Math.floor(difference / oneDayInMilliseconds)

  return dayOfYear
}

export function autoSortSeasons() {
  const seasons = [
    ...GALLERY_ALBUMS.find(({id}) => id === 'seasonal').subcategories
  ]
  const currentSeason = getSeason()
  const currentSeasonData = seasons.find(({id}) => id === currentSeason)
  const currentIndex = seasons.indexOf(currentSeasonData)

  if (currentIndex === 0) return seasons

  const movedSeasons = seasons.slice(currentIndex)

  seasons.splice(currentIndex)

  return [...movedSeasons, ...seasons]
}
