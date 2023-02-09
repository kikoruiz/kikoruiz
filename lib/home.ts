import {getPlaiceholder} from 'plaiceholder'
import {getAverageColor} from 'lib/utils'
import {HighlightedImage} from 'types/gallery'
import {SECTIONS} from 'config'
import {SectionImage} from 'types'

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
