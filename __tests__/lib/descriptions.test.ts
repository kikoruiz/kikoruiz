import {describe, it, expect} from 'vitest'
import pictures from 'data/pictures/metadata.json'
import descriptions from 'data/pictures/descriptions.json'

const LOCALES = ['es', 'ca', 'en']
const translations = descriptions as Record<string, Record<string, string>>
const described = pictures.filter(({description}) => description) as {
  fileName: string
  description: string
}[]

// A new description written in the metadata has no translation yet, and the
// picture shows it as it is until it has one. These tests only guard what is
// already translated, so they do not stop a deploy for a picture added later.
describe('picture descriptions', () => {
  it('keeps the original text of every translated picture', () => {
    const changed = described
      .filter(({fileName, description}) => {
        const entry = translations[fileName.split('.')[0]]

        return entry && !Object.values(entry).includes(description)
      })
      .map(({fileName}) => fileName)

    expect(changed).toEqual([])
  })

  it('has the three languages for every translated picture', () => {
    const incomplete = Object.entries(translations)
      .filter(([, entry]) => LOCALES.some(locale => !entry[locale]?.trim()))
      .map(([id]) => id)

    expect(incomplete).toEqual([])
  })

  it('only describes pictures that exist', () => {
    const ids = new Set(pictures.map(({fileName}) => fileName.split('.')[0]))

    expect(Object.keys(translations).filter(id => !ids.has(id))).toEqual([])
  })

  it('tells a different text in each language', () => {
    const same = Object.entries(translations)
      .filter(([, {es, ca, en}]) => es === ca || es === en || ca === en)
      .map(([id]) => id)

    expect(same).toEqual([])
  })

  it('has no long dashes in the Spanish and Catalan texts', () => {
    const dashed = Object.entries(translations)
      .filter(([, entry]) => /[—–]/.test(entry.es) || /[—–]/.test(entry.ca))
      .map(([id]) => id)

    expect(dashed).toEqual([])
  })

  it('keeps the paragraphs of the descriptions that have them', () => {
    const counts = Object.entries(translations).filter(
      ([, entry]) =>
        new Set(LOCALES.map(locale => entry[locale].split(/\n\n/).length))
          .size > 1
    )

    expect(counts.map(([id]) => id)).toEqual([])
  })
})
