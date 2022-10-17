import resolveConfig from 'tailwindcss/resolveConfig.js'
import tailwindConfig from '../tailwind.config.js'
import {paramCase} from 'change-case'
import removeAccents from 'remove-accents'

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

export function getSlug(name) {
  return paramCase(removeAccents(name))
}

export function getSectionSeparator({isAccent = false} = {}) {
  return `relative pt-9 after:absolute after:left-0 after:top-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent ${
    isAccent ? 'after:via-orange-300/60' : 'after:via-neutral-600'
  }`
}

export {themeScreens}
