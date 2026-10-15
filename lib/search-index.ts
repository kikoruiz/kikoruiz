import {kebabCase} from 'change-case'
import {getPictureAlbum} from 'lib/utils/pictures'
import {RawPicture} from 'types/gallery'
import {SearchItem} from 'types'

// Only what the search reads and shows, since the bundle that carries it is
// fetched the first time someone looks for something.
export function fromMetadataToSearchIndex(
  pictures: RawPicture[]
): Omit<SearchItem, 'type'>[] {
  return pictures.map(
    ({description, keywords, title, fileName, location, createDate}) => {
      const album = getPictureAlbum(keywords)
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
}
