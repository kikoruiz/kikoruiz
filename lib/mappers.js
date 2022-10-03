import {SECTIONS} from '../config/index.js'
import {GALLERY_ALBUMS} from '../config/gallery.js'

export function fromRouteToBreadcrumbItems({route, query}) {
  const [, sectionPath, categoryPath] = route.split('/')
  const sectionItem = SECTIONS.find(({slug}) => slug === sectionPath)
  const category = categoryPath && categoryPath.match(/\[([a-z]+)\]/)
  const categoryParamName = category?.[1]
  const categoryParam = query[categoryParamName]
  let items = []

  if (sectionPath === 'gallery' && categoryParam) {
    items.push({
      ...sectionItem,
      href: '/gallery',
      localeKey: `sections.${sectionItem.slug}`
    })
    const albumItem = GALLERY_ALBUMS.find(album => categoryParam === album.slug)
    items.push({
      ...albumItem,
      localeKey: `${sectionItem.localePrefix}${categoryParam}`
    })
  } else if (sectionItem) {
    items.push({...sectionItem, localeKey: `sections.${sectionItem.slug}`})
  }

  return items
}
