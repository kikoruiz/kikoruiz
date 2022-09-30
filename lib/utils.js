import resolveConfig from 'tailwindcss/resolveConfig.js'
import tailwindConfig from '../tailwind.config.js'

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

export {themeScreens}
