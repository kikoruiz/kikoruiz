import getT from 'next-translate/getT'
import type {Translate} from 'next-translate'
import {GALLERY_TAGS} from 'config/gallery'
import {getSlug} from 'lib/utils'
import {Tag} from 'types'

export async function getGalleryTags({
  locale,
  tags = GALLERY_TAGS,
  subSection = 'tags'
}: {
  locale: string
  tags?: string[]
  subSection?: string
}): Promise<Tag[]> {
  const t = await getT(locale, 'common')
  const galleryT = await getT(locale, 'gallery')

  return tags.map(tag => {
    const id = getSlug(tag)
    const name = galleryT(`tags.${id}`)
    const slug = getSlug(name)
    const gallerySlug = getSlug(t('sections.gallery.name'))
    const subSectionSlug = getSlug(t(subSection))
    const href = `/${gallerySlug}/${subSectionSlug}/${slug}`

    return {
      id,
      slug,
      href,
      name: name.toLowerCase()
    }
  })
}

// Every gallery tag is also an allowed picture tag, so `rawTags` already holds
// all of them and the rest is translation the browser has anyway. Building the
// list here instead of in the props keeps it out of the page data, where it was
// repeated for each one of the pictures of an album.
export function fromRawTagsToTags({
  rawTags,
  t
}: {
  rawTags: string[]
  t: Translate
}): Tag[] {
  const gallerySlug = getSlug(t('common:sections.gallery.name'))
  const subSectionSlug = getSlug(t('common:tags'))

  return rawTags
    .filter(rawTag => GALLERY_TAGS.includes(rawTag))
    .map(rawTag => {
      const id = getSlug(rawTag)
      const name = t(`gallery:tags.${id}`)
      const slug = getSlug(name)

      return {
        id,
        slug,
        href: `/${gallerySlug}/${subSectionSlug}/${slug}`,
        name: name.toLowerCase()
      }
    })
}
