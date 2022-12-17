import getT from 'next-translate/getT'
import {BLOG} from '../../config/index'
import {getSlug} from '../utils'

export async function getTagsData({
  tags = BLOG.TAGS,
  locale
}: {
  tags: string[]
  locale: string
}) {
  const t = await getT(locale, 'blog')

  return tags
    .filter(tag => BLOG.TAGS.includes(tag))
    .map(tag => {
      const name = t(`tags.${tag}`)
      const slug = getSlug(name)

      return {
        id: tag,
        slug,
        name: name,
        href: `/blog/tag/${slug}`
      }
    })
}
