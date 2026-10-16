import {describe, it, expect} from 'vitest'
import placeholders from 'data/image/placeholders.json'
import {HERO_IMAGES} from 'config'
import {getContrastRatio, getSectionPalette} from 'lib/utils/color'

// The average colour of each hero picture, as `getAverageColor` returns it.
const AVERAGE_COLORS: Record<string, string> = {
  '2019-03-04_0001': '#595152',
  '2019-03-07_0175': '#7684a0',
  '2020-01-25_0040': '#716c75',
  '2020-09-27_0057': '#7b675f',
  '2021-10-24_0031': '#5f5a5c',
  '2021-12-04_0153': '#7e4f45',
  '2021-12-10_0008': '#544761',
  '2022-06-25_0028': '#4b4541',
  '2023-04-02_0102': '#554840'
}

function getPlaceholder(id: string) {
  return placeholders.find(({image}) => image === `public/pictures/${id}.jpg`)
    ?.css.backgroundImage
}

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

  it('falls back to the default palette without a placeholder to read', () => {
    expect(getSectionPalette('#595152').title).toBe('#fdba74')
  })

  it('has an average colour for every hero picture', () => {
    expect(HERO_IMAGES.filter(id => !AVERAGE_COLORS[id])).toEqual([])
  })

  it.each(Object.keys(AVERAGE_COLORS))(
    'reads well on the cards of the hero picture %s',
    id => {
      const placeholder = getPlaceholder(id)
      const {from, to, title, description} = getSectionPalette(
        AVERAGE_COLORS[id],
        placeholder
      )

      expect(placeholder).toBeDefined()
      // The lighter end of the gradient is the hardest place to read.
      expect(getContrastRatio(title, from)).toBeGreaterThanOrEqual(4.5)
      expect(getContrastRatio(description, from)).toBeGreaterThanOrEqual(4.5)
      // On hover the card turns orange and its text takes the dark end.
      expect(getContrastRatio(to, title)).toBeGreaterThanOrEqual(7)
    }
  )

  it('keeps the titles in the brand orange on every hero picture', () => {
    const titles = Object.keys(AVERAGE_COLORS).map(
      id => getSectionPalette(AVERAGE_COLORS[id], getPlaceholder(id)).title
    )

    expect(new Set(titles)).toEqual(new Set(['#fdba74']))
  })

  it('runs every gradient from a lighter tone down to a darker one', () => {
    const steps = Object.keys(AVERAGE_COLORS).map(id => {
      const {from, to} = getSectionPalette(
        AVERAGE_COLORS[id],
        getPlaceholder(id)
      )

      return getContrastRatio(from, to)
    })

    expect(Math.min(...steps)).toBeGreaterThan(1.3)
  })
})
