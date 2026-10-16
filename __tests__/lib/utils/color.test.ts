import {describe, it, expect} from 'vitest'
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

  it('has an average colour for every hero picture', () => {
    expect(HERO_IMAGES.filter(id => !AVERAGE_COLORS[id])).toEqual([])
  })

  it.each(Object.keys(AVERAGE_COLORS))(
    'reads well on the cards of the hero picture %s',
    id => {
      const background = AVERAGE_COLORS[id]
      const {title, description, ink} = getSectionPalette(background)

      expect(getContrastRatio(title, background)).toBeGreaterThanOrEqual(4.5)
      expect(getContrastRatio(description, background)).toBeGreaterThanOrEqual(
        4.5
      )
      // On hover the card turns orange and its text takes the ink.
      expect(getContrastRatio(ink, '#fdba74')).toBeGreaterThanOrEqual(7)
    }
  )

  it('keeps the flat average colour as the background', () => {
    const backgrounds = Object.values(AVERAGE_COLORS).map(
      hex => getSectionPalette(hex).background
    )

    expect(backgrounds).toEqual(Object.values(AVERAGE_COLORS))
  })

  it('never uses pure white where a softer light reads just as well', () => {
    const lightOnes = Object.values(AVERAGE_COLORS)
      .map(hex => getSectionPalette(hex))
      .filter(({title}) => title !== '#fdba74')
      .map(({title, description}) => [title, description])
      .flat()

    expect(lightOnes).not.toContain('#ffffff')
  })

  it('keeps the description a notch quieter than the orange title', () => {
    const palette = getSectionPalette('#4b4541')

    expect(palette.title).toBe('#fdba74')
    expect(palette.description).not.toBe(palette.title)
  })

  it('uses a dark text over a light background', () => {
    const {title} = getSectionPalette('#c9d3e6')

    expect(getContrastRatio(title, '#c9d3e6')).toBeGreaterThanOrEqual(4.5)
    expect(
      title.startsWith('#') && parseInt(title.slice(1, 3), 16)
    ).toBeLessThan(100)
  })
})
