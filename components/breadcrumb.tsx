import Link from 'next/link'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import {useShoppingCart} from 'use-shopping-cart'
import {fromSectionToBreadcrumbItems} from 'lib/mappers'
import {getCapitalizedName, getSlug} from 'lib/utils'
import {trackEvent} from 'lib/tracking'
import useSubcategoryContext from 'contexts/Subcategory'
import {SectionData} from 'types'
import sectionIcons from './section-icons'
import subcategoryIcons from './gallery-subcategory-icons'
import BreadcrumbActionButton from './breadcumb-action-button'
import IconShoppingCart from 'assets/icons/shopping-cart.svg'
import IconDocumentArrowDown from 'assets/icons/document-arrow-down.svg'
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
  const {query, locale} = router
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
  const needsShoppingCart = section === 'store'
  const {handleCartHover, cartCount, cartDetails, totalPrice, currency} =
    useShoppingCart()
  const isResumePage = subSection === 'resume'

  return items.length > 0 ? (
    <div id="breadcrumb" className="bg-neutral-800/75">
      <div className="container mx-auto flex justify-between items-center px-6 py-2">
        <div className="flex">
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

        {needsShoppingCart && (
          <BreadcrumbActionButton
            icon={IconShoppingCart}
            title={t('store:shopping-cart', {count: cartCount})}
            bagdeContent={cartCount}
            className="gap-3"
            onClick={() => {
              handleCartHover()
              trackEvent({
                action: 'view_cart',
                value: totalPrice,
                currency: currency.toUpperCase(),
                items: Object.keys(cartDetails).map(id => {
                  const item = cartDetails[id]
                  const {id: productId} = item.product_data as {id: string}

                  return {
                    id: productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                  }
                })
              })
            }}
          >
            {Boolean(totalPrice) && t('store:price', {count: totalPrice})}
          </BreadcrumbActionButton>
        )}

        {isResumePage && (
          <BreadcrumbActionButton
            icon={IconDocumentArrowDown}
            title={t('about-me:download-resume')}
            className="gap-1.5 px-3"
            onClick={() => {
              window.location.href = `/documents/kikoruiz-${locale}-${getSlug(t('about-me.pages.resume.name'))}.pdf`
            }}
          >
            {t('about-me:download-resume').split(' ')[0]}
          </BreadcrumbActionButton>
        )}
      </div>
    </div>
  ) : null
}
