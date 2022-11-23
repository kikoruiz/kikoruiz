import {paramCase} from 'change-case'
import {remove} from 'remove-accents'
import getT from 'next-translate/getT'
import {SECTIONS, DEFAULT_ORIGIN} from '../config/index.js'
import {getSlug} from './utils.js'

export function fromSectionToBreadcrumbItems({
  section,
  category,
  post,
  tag,
  t
}) {
  const sectionItem = SECTIONS.find(({id}) => id === section)
  const categoryItem = sectionItem?.categories?.find(({id}) => {
    const slug = getSlug(t(`${sectionItem.localePrefix}${id}.name`))

    return slug === category
  })
  let items = []

  // When there are no levels.
  if (!sectionItem) return items

  // When there is more than one level.
  if (categoryItem || post || tag) {
    const slug = getSlug(t(`sections.${sectionItem.id}.name`))

    items.push({
      ...sectionItem,
      href: `/${slug}`,
      name: t(`sections.${sectionItem.id}.name`)
    })

    if (post) {
      items.push({
        id: paramCase(post.title),
        name: post.title
      })
    } else if (tag) {
      items.push({
        id: tag,
        name: t('blog:post.tag', {tag: t(`blog:tags.${tag}`)})
      })
    } else {
      items.push({
        id: categoryItem.id,
        name: t(`${sectionItem.localePrefix}${categoryItem.id}.name`)
      })
    }

    // When there is only one level.
  } else {
    items.push({...sectionItem, name: t(`sections.${sectionItem.id}.name`)})
  }

  return items
}

export async function fromLocalesToAlternates({
  defaultLocale,
  locale: currentLocale,
  section,
  category,
  tag
}) {
  const currentT = currentLocale && (await getT(currentLocale, 'common'))

  return async function (locale) {
    const t = await getT(locale, 'common')
    const localePath = locale === defaultLocale ? '' : `/${locale}`
    const sectionSlug = getSlug(t(`sections.${section}.name`))
    const sectionPath = section ? `/${sectionSlug}` : ''
    const sectionData = SECTIONS.find(({id}) => section === id)
    const categoryData =
      category &&
      sectionData.categories?.find(({id}) => {
        const categorySlug = getSlug(
          currentT(`${sectionData.localePrefix}${id}.name`)
        )

        return category === categorySlug
      })
    const justSlug =
      !sectionData?.localePrefix && category ? `/${category}` : ''
    const categoryPath = categoryData
      ? `/${getSlug(t(`${sectionData.localePrefix}${categoryData.id}.name`))}`
      : ''
    const blogT = await getT(locale, 'blog')
    const tagPath = tag ? `/tag/${remove(blogT(`tags.${tag}`))}` : ''
    const endingPath = justSlug || categoryPath || tagPath

    return {
      locale,
      href: `${
        process.env.ORIGIN || DEFAULT_ORIGIN
      }${localePath}${sectionPath}${endingPath}`
    }
  }
}
