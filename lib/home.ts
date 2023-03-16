import {getPlaiceholder} from 'plaiceholder'
import {SECTIONS} from 'config'
import {getAverageColor} from 'lib/utils'
import {getAllPictures} from './gallery/pictures'
import {fromExifToGallery} from './gallery/mappers'
import {SectionImage} from 'types'
import {HighlightedImage, Picture} from 'types/gallery'

const HERO_DEFAULT_DATA = {
  alt: 'Kiko Ruiz Photography'
}
const HERO_IMAGE = '/pictures/2021-12-10_0008.jpg'

export async function getHeroImage(): Promise<HighlightedImage> {
  const src = HERO_IMAGE
  const {css} = await getPlaiceholder(src)
  const averageColor = await getAverageColor(src)

  return {
    ...HERO_DEFAULT_DATA,
    src,
    css,
    averageColor,
    sizes: '100vw'
  }
}

export async function getLastPicture({
  locale
}: {
  locale: string
}): Promise<Picture> {
  const [lastPicture] = await getAllPictures()

  return fromExifToGallery({locale})(lastPicture)
}

export async function getSectionImages(): Promise<SectionImage[]> {
  return Promise.all(
    SECTIONS.map(async function ({id, highlightedPicture}) {
      const src = highlightedPicture
      const {css} = await getPlaiceholder(src)

      return {
        id,
        src,
        css,
        sizes: '33vw'
      }
    })
  )
}
