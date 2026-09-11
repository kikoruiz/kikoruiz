import {kebabCase} from 'change-case'
import {GALLERY_ALBUMS} from 'config/gallery'
import {taggedPictures} from 'lib/utils/pictures'
import searchContent from 'data/search/content.json'
import picturesMetadata from 'data/pictures/metadata.json'
import {SearchItem} from 'types'

const MAX_RESULTS_PER_TYPE = 21

const picturesIndex: Omit<SearchItem, 'type'>[] = picturesMetadata.map(
  ({description, keywords, title, fileName, location, createDate}) => {
    const album = GALLERY_ALBUMS.find(({tags, excludeTags}) =>
      taggedPictures({tags, excludeTags})({keywords})
    )
    const locationString = location
      ? [location.city, location.country].filter(Boolean).join(', ')
      : undefined

    return {
      slug: kebabCase(title),
      description,
      keywords,
      title,
      fileName,
      ...(album && {album: album.id}),
      ...(locationString && {location: locationString}),
      ...(createDate && {createDate})
    }
  }
)

function matchSearchKey(key: string) {
  const lowerKey = key.toLowerCase()

  return function (attrs: object) {
    return Object.keys(attrs).some(attr => {
      const item = attrs[attr] as string | string[]

      if (!item) return false

      return typeof item === 'string'
        ? item.toLowerCase().includes(lowerKey)
        : item.includes(lowerKey)
    })
  }
}

const cache = new Map<string, SearchItem[]>()

export default function search({
  key,
  locale
}: {
  key: string
  locale: string
}): SearchItem[] {
  const cacheKey = `${locale}:${key.toLowerCase()}`
  const cached = cache.get(cacheKey)
  if (cached) return cached

  const matcher = matchSearchKey(key)
  const posts: SearchItem[] = (searchContent[locale] || [])
    .filter(matcher)
    .slice(0, MAX_RESULTS_PER_TYPE)
    .map(post => ({...post, type: 'post' as const}))
  const pictures: SearchItem[] = picturesIndex
    .filter(matcher)
    .slice(0, MAX_RESULTS_PER_TYPE)
    .map(picture => ({...picture, type: 'picture' as const}))

  const results = [...posts, ...pictures]
  cache.set(cacheKey, results)

  return results
}
