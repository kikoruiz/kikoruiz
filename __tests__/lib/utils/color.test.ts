import {describe, it, expect} from 'vitest'
import {getContrastRatio, getReadableTextClassName} from 'lib/utils/color'

describe('color utils', () => {
  it('gets the contrast ratio between black and white', () => {
    expect(getContrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0)
  })

  it('gets the same contrast ratio whichever colour is the foreground', () => {
    expect(getContrastRatio('#fdba74', '#7e4f45')).toBeCloseTo(
      getContrastRatio('#7e4f45', '#fdba74'),
      5
    )
  })

  it('keeps the orange on a dark background', () => {
    expect(getReadableTextClassName('#1a1a1a')).toBe('text-orange-300')
  })

  it('uses white where the orange is too faint over a mid dark background', () => {
    expect(getReadableTextClassName('#7e4f45')).toBe('text-white')
  })

  it('uses near black over a light background', () => {
    expect(getReadableTextClassName('#e5e5e5')).toBe('text-neutral-900')
  })
})
