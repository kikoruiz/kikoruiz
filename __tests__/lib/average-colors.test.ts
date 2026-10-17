import {describe, it, expect} from 'vitest'
import pictures from 'data/pictures/metadata.json'
import {HERO_IMAGES} from 'config'
import {getAverageColor} from 'lib/utils'

describe('average colors', () => {
  it('has the colour of every hero picture', () => {
    const missing = HERO_IMAGES.filter(id => {
      try {
        return !getAverageColor(`/pictures/${id}.jpg`).hex
      } catch {
        return true
      }
    })

    expect(missing).toEqual([])
  })

  it('has the colour of every picture of the gallery', () => {
    const missing = pictures
      .map(({fileName}) => `/pictures/${fileName}`)
      .filter(src => {
        try {
          getAverageColor(src)

          return false
        } catch {
          return true
        }
      })

    expect(missing).toEqual([])
  })

  it('says what to run when a colour is missing', () => {
    expect(() => getAverageColor('/pictures/nope.jpg')).toThrow(
      'make save_colors'
    )
  })
})
