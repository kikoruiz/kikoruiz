import getT from 'next-translate/getT'
import {getGalleryPictures} from './pictures'
import {fromExifToGallery} from './mappers'
import {fromLocalesToAlternates} from 'lib/mappers'
import {autoSortSeasons, getSlug} from 'lib/utils'
import {GALLERY_ALBUMS} from 'config/gallery'
import {Alternate} from 'types'
import {Picture} from 'types/gallery'

const SECTION = 'gallery'

// Shared by the album page and by the page of each one of its pictures, which
// is the very same view with the carousel already open.
export async function getAlbumPageProps({
  slug,
  locale,
  locales,
  defaultLocale,
  pictureSlug
}: {
  slug: string
  locale: string
  locales: string[]
  defaultLocale: string
  pictureSlug?: string
}) {
  const galleryPictures = await getGalleryPictures({locale, slug})
  const pictures: Picture[] = await Promise.all(
    galleryPictures.map(fromExifToGallery({locale, slug}))
  )
  const t = await getT(locale, 'common')
  const album = GALLERY_ALBUMS.find(
    ({id}) => getSlug(t(`gallery.albums.${id}.name`)) === slug
  )
  const subcategories =
    album.id === 'seasonal' ? autoSortSeasons() : album.subcategories
  const alternates: Alternate[] = await Promise.all(
    locales.map(
      await fromLocalesToAlternates({
        defaultLocale,
        locale,
        section: SECTION,
        category: slug,
        picture: pictureSlug
      })
    )
  )

  return {
    pictures,
    category: album.id,
    ...(subcategories && {subcategories}),
    basePath: `/${getSlug(t(`sections.${SECTION}.name`))}/${slug}`,
    alternates,
    section: SECTION
  }
}
