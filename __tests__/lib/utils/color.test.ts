import {describe, it, expect} from 'vitest'
import {HERO_IMAGES} from 'config'
import {getAverageColor} from 'lib/utils'
import {getContrastRatio, getSectionPalette} from 'lib/utils/color'

// The average colour of each hero picture, as the page gets it.
const AVERAGE_COLORS = Object.fromEntries(
  HERO_IMAGES.map(id => [id, getAverageColor(`/pictures/${id}.jpg`).hex])
)

describe('color utils', () => {
  // Tests for `getContrastRatio`.

  it('gets the contrast ratio between black and white', () => {
    expect(getContrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0)
  })

  it('gets the same contrast ratio whichever colour is the foreground', () => {
    expect(getContrastRatio('#fdba74', '#7e4f45')).toBeCloseTo(
      getContrastRatio('#7e4f45', '#fdba74'),
      5
    )
  })

  // Tests for `getSectionPalette`.

  it('falls back to the default palette without a valid colour', () => {
    expect(getSectionPalette('nope').title).toBe('#fdba74')
  })

  it.each(Object.keys(AVERAGE_COLORS))(
    'reads well on the cards of the hero picture %s',
    id => {
      const {background, title, description, ink} = getSectionPalette(
        AVERAGE_COLORS[id]
      )

      expect(getContrastRatio(title, background)).toBeGreaterThanOrEqual(5)
      expect(getContrastRatio(description, background)).toBeGreaterThanOrEqual(
        4.5
      )
      // On hover the card turns orange and its text takes the ink.
      expect(getContrastRatio(ink, '#fdba74')).toBeGreaterThanOrEqual(7)
    }
  )

  it('paints a deeper tone of the same hue than the average colour', () => {
    const [average, deep] = ['#7e4f45', getSectionPalette('#7e4f45').background]
    const hue = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16))

      return Math.round(
        Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b) * 57.3
      )
    }

    expect(getContrastRatio('#ffffff', deep)).toBeGreaterThan(
      getContrastRatio('#ffffff', average)
    )
    expect(Math.abs(hue(deep) - hue(average))).toBeLessThan(8)
  })

  it('keeps the titles in the brand orange on every hero picture', () => {
    const titles = Object.values(AVERAGE_COLORS).map(
      hex => getSectionPalette(hex).title
    )

    expect(new Set(titles)).toEqual(new Set(['#fdba74']))
  })

  it('keeps the orange readable even on a picture that is light on average', () => {
    const {background, title} = getSectionPalette('#e0e6f0')

    expect(getContrastRatio(title, background)).toBeGreaterThanOrEqual(5)
  })

  it('tints the description with the hue instead of a plain grey', () => {
    const {description} = getSectionPalette('#7e4f45')
    const [r, , b] = [1, 3, 5].map(i =>
      parseInt(description.slice(i, i + 2), 16)
    )

    expect(r).toBeGreaterThan(b)
  })
})
