import getT from 'next-translate/getT'
import {BLOG} from '../../config/index.js'
import {getSlug} from '../utils.js'

export async function getTagsData({tags = BLOG.TAGS, locale}) {
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
