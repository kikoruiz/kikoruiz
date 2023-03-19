import getT from 'next-translate/getT'
import {BLOG} from 'config/index'
import {getSlug} from '../utils'

export async function getTagsData({
  tags = BLOG.TAGS,
  subSection = 'tags',
  locale
}: {
  tags?: string[]
  subSection?: string
  locale: string
}) {
  const commonT = await getT(locale, 'common')

  return tags
    .filter(tag => BLOG.TAGS.includes(tag))
    .map(tag => {
      const name = commonT(`blog.tags.${tag}`)
      const slug = getSlug(name)
      const sectionSlug = getSlug(commonT('sections.blog.name'))
      const subSectionSlug = getSlug(commonT(subSection))
      const href = `/${sectionSlug}/${subSectionSlug}/${slug}`

      return {
        id: tag,
        slug,
        name,
        href
      }
    })
}
