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
    items.push({...sectionItem, href: '/gallery'})
    items.push(GALLERY_ALBUMS.find(album => categoryParam === album.slug))
  } else if (sectionItem) {
    items.push(sectionItem)
  }

  return items
}
