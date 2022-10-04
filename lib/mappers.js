import {SECTIONS} from '../config/index.js'
import {GALLERY_ALBUMS} from '../config/gallery.js'

export function fromRouteToBreadcrumbItems({section, asPath, t}) {
  const [, , categorySlug] = asPath.split('/')
  const sectionItem = SECTIONS.find(({id}) => id === section)
  const categoryItem = sectionItem?.categories?.find(
    ({id}) => t(`${sectionItem.localePrefix}${id}.slug`) === categorySlug
  )
  let items = []

  if (sectionItem && section === 'gallery' && categoryItem) {
    items.push({
      ...sectionItem,
      href: `/${t('sections.gallery.slug')}`,
      name: t(`sections.${sectionItem.id}.name`)
    })
    const albumItem = GALLERY_ALBUMS.find(album => categorySlug === album.slug)
    items.push({
      ...albumItem,
      name: t(`${sectionItem.localePrefix}${categoryItem.id}.name`)
    })
  } else if (sectionItem) {
    items.push({...sectionItem, name: t(`sections.${sectionItem.id}.name`)})
  }

  return items
}
