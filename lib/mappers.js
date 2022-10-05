import getT from 'next-translate/getT'
import {paramCase} from 'change-case'
import {SECTIONS} from '../config/index.js'

export function fromSectionToBreadcrumbItems({section, category, post, t}) {
  const sectionItem = SECTIONS.find(({id}) => id === section)
  const categoryItem = sectionItem?.categories?.find(
    ({id}) => t(`${sectionItem.localePrefix}${id}.slug`) === category
  )
  let items = []

  // When there are no levels.
  if (!sectionItem) return items

  // When there is more than one level.
  if (categoryItem || post) {
    items.push({
      ...sectionItem,
      href: `/${t(`sections.${sectionItem.id}.slug`)}`,
      name: t(`sections.${sectionItem.id}.name`)
    })

    if (section === 'blog') {
      items.push({
        id: paramCase(post.title),
        name: post.title
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
  locale: actualLocale,
  section,
  category
}) {
  const actualT = actualLocale && (await getT(actualLocale, 'common'))

  return async function (locale) {
    const t = await getT(locale, 'common')
    const localePath = locale === defaultLocale ? '' : `/${locale}`
    const sectionPath = section ? `/${t(`sections.${section}.slug`)}` : ''
    const sectionData = SECTIONS.find(({id}) => section === id)
    const categoryData =
      category &&
      sectionData.categories?.find(({id}) => {
        const categorySlug = actualT(`${sectionData.localePrefix}${id}.slug`)

        return category === categorySlug
      })
    const justSlug =
      !sectionData?.localePrefix && category ? `/${category}` : ''
    const categoryPath = categoryData
      ? `/${t(`${sectionData.localePrefix}${categoryData.id}.slug`)}`
      : ''
    const slugPath = justSlug || categoryPath

    return {
      locale,
      href: `${process.env.ORIGIN}${localePath}${sectionPath}${slugPath}`
    }
  }
}
