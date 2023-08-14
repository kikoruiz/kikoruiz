import {getPlaiceholder} from 'plaiceholder'
import {SECTIONS} from 'config'
import {getAverageColor, sortListBy} from 'lib/utils'
import {getAllPictures} from './gallery/pictures'
import {fromExifToGallery} from './gallery/mappers'
import {getAllPosts} from './blog/posts'
import {SectionImage} from 'types'
import {
  HighlightedImage,
  LatestPictures,
  RawPicture,
  Picture
} from 'types/gallery'
import {BlogPost} from 'types/blog'

const HERO_DEFAULT_DATA = {
  alt: 'Kiko Ruiz Photography'
}
const HERO_IMAGE = '/pictures/2021-12-10_0008.jpg'
const LATEST_PICTURES_LENGTH = 6

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

export async function getLatestContent({
  locale
}: {
  locale: string
}): Promise<BlogPost[]> {
  const TAG_TUTORIAL = 'tutorial'
  const allPosts = await getAllPosts(locale)
  const latestContent = []
  const latestTutorial = allPosts.find(({tags}) => tags.includes(TAG_TUTORIAL))
  if (latestTutorial) latestContent.push(latestTutorial)
  const latestPost = allPosts.find(({tags}) => !tags.includes(TAG_TUTORIAL))
  if (latestPost) latestContent.push(latestPost)

  return latestContent
}

function mapPictures(
  pictures: RawPicture[],
  {locale}: {locale: string}
): Promise<Picture[]> {
  return Promise.all(
    pictures.map(fromExifToGallery({locale, skipGalleryPath: true}))
  )
}

export async function getLatestPictures({
  locale
}: {
  locale: string
}): Promise<LatestPictures> {
  const allPictures = await getAllPictures()
  const latestPicturesByCreationDate = allPictures.slice(
    0,
    LATEST_PICTURES_LENGTH
  )
  const latestPicturesByProcessingDate = (
    sortListBy(
      allPictures.filter(({processingDate}) => Boolean(processingDate)),
      'processingDate'
    ) as RawPicture[]
  ).slice(0, LATEST_PICTURES_LENGTH)
  const byCreationDate = await mapPictures(latestPicturesByCreationDate, {
    locale
  })
  const byProcessingDate = await mapPictures(latestPicturesByProcessingDate, {
    locale
  })

  return {byCreationDate, byProcessingDate}
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
