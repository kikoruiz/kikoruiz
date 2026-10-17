import {describe, it, expect} from 'vitest'
import {getPictureDescription, getPictureTitle} from 'lib/seo'

describe('seo lib', () => {
  // Tests for `getPictureTitle`.

  it('gets a title with the city and the print of a picture for sale', () => {
    expect(
      getPictureTitle({
        name: 'The Yellow Boat',
        city: 'Calonge',
        printLabel: 'Impresión',
        siteName: 'Kiko Ruiz'
      })
    ).toBe('The Yellow Boat · Calonge · Impresión / Kiko Ruiz')
  })

  it('gets a title without the print for a picture that is not for sale', () => {
    expect(
      getPictureTitle({
        name: 'The Yellow Boat',
        city: 'Calonge',
        siteName: 'Kiko Ruiz'
      })
    ).toBe('The Yellow Boat · Calonge / Kiko Ruiz')
  })

  it('gets a title with just the name when there is no place', () => {
    expect(
      getPictureTitle({name: 'The Yellow Boat', siteName: 'Kiko Ruiz'})
    ).toBe('The Yellow Boat / Kiko Ruiz')
  })

  it('drops the city before the print when the title would be too long', () => {
    const title = getPictureTitle({
      name: 'Last Autumn Lights and Colors II',
      city: 'Fogars de Montclús',
      printLabel: 'Impresión',
      siteName: 'Kiko Ruiz'
    })

    expect(title).toBe(
      'Last Autumn Lights and Colors II · Impresión / Kiko Ruiz'
    )
    expect(title.length).toBeLessThanOrEqual(60)
  })

  it('never cuts the name of the picture', () => {
    const name =
      'A very long name for a picture that goes well beyond the limit'

    expect(getPictureTitle({name, siteName: 'Kiko Ruiz'})).toContain(name)
  })

  // Tests for `getPictureDescription`.

  it('keeps a description that fits as it is', () => {
    const description =
      'Captured at dawn, when the light first reaches the rocks of the cape.'

    expect(
      getPictureDescription({description, fallback: 'unused', facts: ['x']})
    ).toContain(description)
  })

  it('cuts a long description at the end of a sentence', () => {
    const description =
      'Captured in the national park as the warmth of spring began to melt the winter ice, a scene that shows the raw beauty of nature awakening. The melting snow feeds the streams.'
    const text = getPictureDescription({description, fallback: 'unused'})

    expect(text.length).toBeLessThanOrEqual(155)
    expect(text.endsWith('.')).toBe(true)
    expect(description.startsWith(text)).toBe(true)
  })

  it('cuts a long description without a sentence end at a word', () => {
    const text = getPictureDescription({
      description: 'word '.repeat(60),
      fallback: 'unused'
    })

    expect(text.length).toBeLessThanOrEqual(155)
    expect(text.endsWith('…')).toBe(true)
  })

  it('fills a short description with the facts of the picture', () => {
    const text = getPictureDescription({
      description: 'A quiet morning.',
      fallback: 'unused',
      facts: ['Calonge, Spain', 'July 2021', 'Canon EOS R']
    })

    expect(text).toBe(
      'A quiet morning. Calonge, Spain. July 2021. Canon EOS R.'
    )
  })

  it('uses the fallback when the picture has no description', () => {
    expect(
      getPictureDescription({fallback: 'Photograph of The Yellow Boat.'})
    ).toContain('Photograph of The Yellow Boat.')
  })

  it('says the picture is for sale when there is room', () => {
    expect(
      getPictureDescription({
        description: 'A quiet morning.',
        fallback: 'unused',
        printNote: 'Available as a print.'
      })
    ).toBe('A quiet morning. Available as a print.')
  })

  it('leaves the print note out when it would not fit', () => {
    const description = `${'x'.repeat(145)}.`
    const text = getPictureDescription({
      description,
      fallback: 'unused',
      printNote: 'Available as a print.'
    })

    expect(text.length).toBeLessThanOrEqual(155)
    expect(text).not.toContain('print')
  })
})
