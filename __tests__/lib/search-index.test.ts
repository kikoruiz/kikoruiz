import {describe, it, expect} from 'vitest'
import pictures from 'data/pictures/metadata.json'
import searchIndex from 'data/search/pictures.json'
import {fromMetadataToSearchIndex} from 'lib/search-index'
import {RawPicture} from 'types/gallery'

describe('search index', () => {
  // The index is generated from the metadata, and a stale one would leave new
  // pictures out of the search without anything failing.
  it('is up to date with the pictures metadata', () => {
    expect(searchIndex).toEqual(
      JSON.parse(
        JSON.stringify(fromMetadataToSearchIndex(pictures as RawPicture[]))
      )
    )
  })
})
