import {describe, it, expect} from 'vitest'
import pictures from 'data/pictures/metadata.json'
import {GALLERY_ALBUMS, TRANSVERSAL_ALBUMS} from 'config/gallery'
import {getPictureAlbum, taggedPictures} from 'lib/utils/pictures'

describe('gallery albums', () => {
  // Tests for `taggedPictures`.

  it('matches a picture carrying any of the tags', () => {
    const match = taggedPictures({tags: ['a', 'b'], excludeTags: []})

    expect(match({keywords: ['b', 'c']})).toBe(true)
  })

  it('does not match a picture carrying none of the tags', () => {
    const match = taggedPictures({tags: ['a'], excludeTags: []})

    expect(match({keywords: ['c']})).toBe(false)
  })

  it('does not match a picture carrying an excluded tag', () => {
    const match = taggedPictures({tags: ['a'], excludeTags: ['x']})

    expect(match({keywords: ['a', 'x']})).toBe(false)
  })

  // Tests for `getPictureAlbum`.

  it('gets no album for a picture that fits none', () => {
    expect(getPictureAlbum(['nothing-matches'])).toBeUndefined()
  })

  it('gets the real album of a picture over a transversal one', () => {
    const [transversalId] = TRANSVERSAL_ALBUMS
    const transversal = GALLERY_ALBUMS.find(({id}) => id === transversalId)
    const real = GALLERY_ALBUMS.find(
      ({id, tags}) =>
        !TRANSVERSAL_ALBUMS.includes(id) &&
        !tags.some(tag => transversal.excludeTags?.includes(tag))
    )
    const keywords = [transversal.tags[0], real.tags[0]]

    expect(getPictureAlbum(keywords).id).toBe(real.id)
  })

  it('gets an album for every picture of the gallery', () => {
    const orphans = pictures
      .filter(({keywords}) => !getPictureAlbum(keywords))
      .map(({fileName}) => fileName)

    expect(orphans).toEqual([])
  })
})
