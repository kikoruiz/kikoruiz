import Link from 'next/link'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import {fromSectionToBreadcrumbItems} from 'lib/mappers'
import useSubcategoryContext from 'contexts/Subcategory'
import {SectionData} from 'types'
import sectionIcons from './section-icons'
import subcategoryIcons from './gallery-subcategory-icons'
import {getCapitalizedName, getSlug} from 'lib/utils'
import {GALLERY_ALBUMS} from 'config/gallery'
import {BLOG} from 'config'

function scrollToTop() {
  window?.scrollTo({top: 0})
}

export default function Breadcrumb({
  section,
  subSection,
  post,
  tag
}: SectionData) {
  const {t} = useTranslation()
  const router = useRouter()
  const {query} = router
  const {subcategory} = useSubcategoryContext()
  const category = query.slug as string
  const items = fromSectionToBreadcrumbItems({
    section,
    subSection,
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
  const subcategoryData = categoryItem?.subcategories?.find(
    ({id}) => subcategory === id
  )
  const needsSectionIcon = items.length === 1
  const SectionIcon = sectionIcons[`Icon${getCapitalizedName(section)}`]
  let SubcategoryIcon
  if (subcategoryData) {
    SubcategoryIcon = subcategoryIcons[`Icon${getCapitalizedName(subcategory)}`]
  }

  return items.length > 0 ? (
    <div id="breadcrumb" className="bg-neutral-800/75">
      <div className="container mx-auto flex px-6 py-2">
        {items.map(({href, id, name}, index) => {
          const isFirstItem = index === 0

          if (href) {
            return (
              <Link
                key={id}
                href={href}
                title={t('navigation.back-to', {section: name})}
                className="inline-flex font-light text-neutral-300/30 after:content-['\00a0/\00a0'] hover:text-neutral-300/60 hover:after:text-neutral-300/30"
              >
                {isFirstItem && <SectionIcon className="mr-1 w-5" />}
                {name}
              </Link>
            )
          }

          return subcategoryData ? (
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
            <span key={id} className="flex font-bold text-orange-300/60">
              {needsSectionIcon && <SectionIcon className="mr-1 w-5" />}
              {post && name.includes(BLOG.TITLE_SEPARATOR) ? (
                <>
                  <span className="mr-1 font-light">
                    {name.split(BLOG.TITLE_SEPARATOR)[0]}
                    {BLOG.TITLE_SEPARATOR}
                  </span>
                  {name.split(BLOG.TITLE_SEPARATOR)[1]}
                </>
              ) : (
                <>{name}</>
              )}
            </span>
          )
        })}
        {subcategoryData && (
          <span
            className={`font-bold text-orange-300/60 ${
              subcategoryData.emoji
                ? 'inline-block'
                : 'inline-flex items-center'
            }`}
          >
            {SubcategoryIcon && (
              <SubcategoryIcon className="ml-0.5 mr-1.5 w-3 rounded-full" />
            )}
            {subcategoryData.emoji && (
              <>
                <span className="text-neutral-900">
                  {subcategoryData.emoji}
                </span>{' '}
              </>
            )}
            {t(
              `${section}.albums.${categoryItem.id}.subcategories.${subcategory}`
            )}
          </span>
        )}
      </div>
    </div>
  ) : null
}
