import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from 'tailwind.config.mjs'
import {paramCase, headerCase, camelCase, pascalCase} from 'change-case'
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

export function autoSortSeasons(currentDate = new Date(Date.now())) {
  const seasons = [
    ...GALLERY_ALBUMS.find(({id}) => id === 'seasonal').subcategories
  ]
  const seasonsConfig = [
    {
      id: 'winter',
      date: new Date(
        currentDate.getFullYear(),
        11,
        currentDate.getFullYear() % 4 === 0 ? 20 : 21
      ).getTime()
    },
    {
      id: 'spring',
      date: new Date(
        currentDate.getFullYear(),
        2,
        currentDate.getFullYear() % 4 === 0 ? 19 : 20
      ).getTime()
    },
    {
      id: 'summer',
      date: new Date(
        currentDate.getFullYear(),
        5,
        currentDate.getFullYear() % 4 === 0 ? 20 : 21
      ).getTime()
    },
    {
      id: 'autumn',
      date: new Date(
        currentDate.getFullYear(),
        8,
        currentDate.getFullYear() % 4 === 0 ? 22 : 23
      ).getTime()
    }
  ]
  const currentSeason = seasonsConfig
    .filter(({date}) => date <= currentDate.getTime())
    .slice(-1)[0] || {
    id: 'winter'
  }
  const currentSeasonData = seasons.find(({id}) => id === currentSeason.id)
  const currentIndex = seasons.indexOf(currentSeasonData)

  if (currentIndex === 0) return seasons

  const movedSeasons = seasons.slice(currentIndex)

  seasons.splice(currentIndex)

  return [...movedSeasons, ...seasons]
}
