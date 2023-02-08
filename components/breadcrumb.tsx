import Link from 'next/link'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import {fromSectionToBreadcrumbItems} from 'lib/mappers'
import useSubcategoryContext from 'contexts/subcategory'
import {SectionData} from 'types'
import icons from './gallery-subcategory-icons'
import {getCapitalizedName, getSlug} from 'lib/utils'
import {GALLERY_ALBUMS} from 'config/gallery'

function scrollToTop() {
  if (typeof window === 'undefined') return

  window.scrollTo({top: 0})
}

export default function Breadcrumb({section, post, tag}: SectionData) {
  const {t} = useTranslation()
  const router = useRouter()
  const {query} = router
  const {subcategory} = useSubcategoryContext()
  const category = query.slug as string
  const items = fromSectionToBreadcrumbItems({
    section,
    category,
    post,
    tag,
    t
  })
  const categoryItem =
    section === 'gallery' &&
    GALLERY_ALBUMS.find(
      ({id}) => getSlug(t(`gallery.albums.${id}.name`)) === category
    )
  const hasSubcategory = subcategory && categoryItem
  let Icon
  if (hasSubcategory) {
    Icon = icons[`Icon${getCapitalizedName(subcategory)}`]
  }

  return items.length > 0 ? (
    <div id="breadcrumb" className="bg-neutral-800/75">
      <div className="container mx-auto py-2 px-6">
        {items.map(({href, id, name}) => {
          if (href) {
            return (
              <Link
                key={id}
                href={href}
                title={t('navigation.back-to', {section: name})}
                className="font-light text-neutral-300/30 after:content-['\00a0/\00a0'] hover:text-neutral-300/60 hover:after:text-neutral-300/30"
              >
                {name}
              </Link>
            )
          }

          return hasSubcategory ? (
            <span
              key={id}
              aria-label={t('navigation.album.scroll-to-top')}
              title={t('navigation.album.scroll-to-top')}
              className="cursor-pointer text-neutral-300/30 after:content-['\00a0/\00a0'] hover:text-neutral-300/60 hover:after:text-neutral-300/30"
              onClick={scrollToTop}
            >
              {name}
            </span>
          ) : (
            <span key={id} className="font-bold text-orange-300/60">
              {name}
            </span>
          )
        })}
        {hasSubcategory && (
          <span className="inline-flex items-center font-bold text-orange-300/60">
            {Icon && <Icon className="mr-1.5 ml-0.5 w-3 rounded-full" />}
            {t(
              `${section}.albums.${categoryItem.id}.subcategories.${subcategory}`
            )}
          </span>
        )}
      </div>
    </div>
  ) : null
}
