import getT from 'next-translate/getT'
import {GALLERY_TAGS} from 'config/gallery'
import {getSlug} from 'lib/utils'
import {Tag} from 'types'

export async function getGalleryTags({
  locale,
  tags = GALLERY_TAGS,
  subSection = 'tags'
}: {
  locale: string
  tags: string[]
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
