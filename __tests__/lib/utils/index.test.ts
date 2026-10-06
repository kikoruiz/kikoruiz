import {describe, it, expect} from 'vitest'
import {
  getAbsoluteUrl,
  getAspectRatio,
  getAspectRatioClassName,
  getSeason,
  getSlug,
  getTitle,
  isNew
} from 'lib/utils'
import pictures from 'data/pictures/metadata.json'
import tailwindConfig from '../../../tailwind.config.mjs'

// `aspect-square` is the only one Tailwind ships, the rest come from the config.
const BUILT_IN_ASPECT_RATIO_CLASS_NAMES = ['aspect-square']

const galleryAspectRatios = [
  ...new Set(pictures.map(({imageSize}) => getAspectRatio(imageSize)))
]

describe('utils lib', () => {
  // Tests for `getSlug`.

  it('gets a slug from an uppercase name', () => {
    expect(getSlug('JOHN BOY')).toBe('john-boy')
  })

  it('gets a slug from a lowercase name', () => {
    expect(getSlug('john boy')).toBe('john-boy')
  })

  it('gets a slug from a name with special characters', () => {
    expect(getSlug('John (Boy)')).toBe('john-boy')
  })

  // Tests for `getTitle`.

  it('gets a title from an uppercase name', () => {
    expect(getTitle('JOHN BOY')).toBe('John Boy')
  })

  it('gets a title from a lowercase name', () => {
    expect(getTitle('john boy')).toBe('John Boy')
  })

  it('gets a title from a name with special characters', () => {
    expect(getTitle('John (Boy)')).toBe('John Boy')
  })

  // Tests for `isNew`.

  it('says an item from 2023-04-23 is new if today was 2023-10-22', () => {
    expect(isNew('2023-04-23', '2023-10-22')).toBe(true)
  })

  it('says an item from 2023-04-23 is not new if today was 2023-10-24', () => {
    expect(isNew('2023-04-23', '2023-10-24')).toBe(false)
  })

  // Tests for `getSeason`.

  it('checks it is winter season based on a selected day from 2023', () => {
    expect(getSeason(new Date('2023-12-22'))).toBe('winter')
  })

  it('checks it is spring season based on a selected day from 2024', () => {
    expect(getSeason(new Date('2024-03-20'))).toBe('spring')
  })

  it('checks it is summer season based on a selected day from 2024', () => {
    expect(getSeason(new Date('2024-06-21'))).toBe('summer')
  })

  it('checks it is autumn season based on a selected day from 2024', () => {
    expect(getSeason(new Date('2024-09-22'))).toBe('autumn')
  })

  it('checks it is winter season based on a selected day from 2024', () => {
    expect(getSeason(new Date('2024-12-21'))).toBe('winter')
  })

  // Tests for `getAbsoluteUrl`.

  it('gets the absolute url for a path', () => {
    expect(getAbsoluteUrl('foo.bar')).toBe('http://test/foo.bar')
  })

  it('gets the absolute url for a path starting with a trailing slash', () => {
    expect(getAbsoluteUrl('/foo.bar')).toBe('http://test/foo.bar')
  })

  // Tests for `getAspectRatio`.

  it('gets the aspect ratio of a square picture', () => {
    expect(getAspectRatio('5000x5000')).toBe('1:1')
  })

  it('gets the aspect ratio of a vertical picture', () => {
    expect(getAspectRatio('4000x6000')).toBe('2:3')
  })

  it('gets the aspect ratio of an ultrawide panorama', () => {
    expect(getAspectRatio('17005x7288')).toBe('21:9')
  })

  it('gets no aspect ratio from an uncovered one', () => {
    expect(getAspectRatio('1000x700')).toBe('')
  })

  // Tests for `getAspectRatioClassName`. An image is rendered with `fill`, so it
  // takes its height from the aspect ratio class of its parent. A picture whose
  // ratio falls through any of the three steps below gets no height at all.

  it('gets the class name of an aspect ratio', () => {
    expect(getAspectRatioClassName('21:9')).toBe('aspect-21/9')
  })

  it('gets an aspect ratio for every picture of the gallery', () => {
    const uncovered = pictures
      .filter(({imageSize}) => !getAspectRatio(imageSize))
      .map(({fileName, imageSize}) => `${fileName} (${imageSize})`)

    expect(uncovered).toEqual([])
  })

  it('gets a class name for every aspect ratio of the gallery', () => {
    const uncovered = galleryAspectRatios.filter(
      aspectRatio => !getAspectRatioClassName(aspectRatio)
    )

    expect(uncovered).toEqual([])
  })

  it('gets a configured Tailwind utility for every class name of the gallery', () => {
    const utilities = Object.keys(tailwindConfig.theme.extend.aspectRatio).map(
      ratio => `aspect-${ratio}`
    )
    const missing = galleryAspectRatios
      .map(getAspectRatioClassName)
      .filter(
        className =>
          !BUILT_IN_ASPECT_RATIO_CLASS_NAMES.includes(className) &&
          !utilities.includes(className)
      )

    expect(missing).toEqual([])
  })
})
