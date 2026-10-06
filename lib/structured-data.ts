import {SITE_NAME} from 'config'
import {getAbsoluteUrl} from './utils'
import {BreadcrumbItem} from 'types'
import {Picture} from 'types/gallery'
import {PicturePrint} from 'types/store'

const CONTEXT = 'https://schema.org'
const IN_STOCK = `${CONTEXT}/InStock`
const NEW_CONDITION = `${CONTEXT}/NewCondition`
const CURRENCY = 'EUR'

function getCreator() {
  return {
    '@type': 'Person',
    name: SITE_NAME,
    url: getAbsoluteUrl('/')
  }
}

function getContentLocation({coordinates, location}: Picture) {
  if (!location) return undefined

  const {city, state, country} = location

  return {
    '@type': 'Place',
    name: [city, country].filter(Boolean).join(', '),
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressRegion: state.replace('Province', '').trim(),
      addressCountry: country
    },
    ...(coordinates && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      }
    })
  }
}

function getImageObject({
  picture,
  canonical,
  licenseUrl
}: {
  picture: Picture
  canonical: string
  licenseUrl: string
}) {
  const {name, description, image, imageSize, processingDate, date} = picture
  const [width, height] = imageSize.split('x').map(Number)
  const contentLocation = getContentLocation(picture)

  return {
    '@type': 'ImageObject',
    contentUrl: getAbsoluteUrl(image.src),
    width,
    height,
    name,
    ...(description && {description}),
    creator: getCreator(),
    copyrightNotice: `© ${SITE_NAME}`,
    creditText: SITE_NAME,
    license: licenseUrl,
    acquireLicensePage: canonical,
    datePublished: processingDate ?? date,
    ...(contentLocation && {contentLocation})
  }
}

function getProduct({
  picture,
  prints,
  canonical
}: {
  picture: Picture
  prints: PicturePrint[]
  canonical: string
}) {
  const prices = prints.map(({price}) => price)
  const offers = prints.map(({name, price}) => ({
    '@type': 'Offer',
    name,
    price,
    priceCurrency: CURRENCY,
    availability: IN_STOCK,
    itemCondition: NEW_CONDITION,
    url: canonical
  }))

  return {
    '@type': 'Product',
    name: picture.name,
    ...(picture.description && {description: picture.description}),
    image: getAbsoluteUrl(picture.image.src),
    brand: {'@type': 'Brand', name: SITE_NAME},
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      priceCurrency: CURRENCY,
      offerCount: prints.length,
      offers
    }
  }
}

function getBreadcrumbList({
  items,
  localePath
}: {
  items: BreadcrumbItem[]
  localePath: string
}) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(({name, href}, index) => {
      const path = `${localePath}${href ?? ''}`.replace(/\/$/, '')

      return {
        '@type': 'ListItem',
        position: index + 1,
        name,
        ...(href && {item: getAbsoluteUrl(path || '/')})
      }
    })
  }
}

export function getWebSiteStructuredData({
  description,
  sameAs
}: {
  description: string
  sameAs: string[]
}) {
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    name: SITE_NAME,
    url: getAbsoluteUrl('/'),
    description,
    author: {...getCreator(), sameAs}
  }
}

export function getBlogPostingStructuredData({
  headline,
  description,
  datePublished,
  image,
  author
}: {
  headline: string
  description: string
  datePublished: string
  image: string
  author: string
}) {
  return {
    '@context': CONTEXT,
    '@type': 'BlogPosting',
    headline,
    description,
    datePublished,
    image,
    author: {...getCreator(), name: author}
  }
}

export function getPictureStructuredData({
  picture,
  prints,
  canonical,
  licenseUrl,
  breadcrumbItems,
  localePath
}: {
  picture: Picture
  prints: PicturePrint[]
  canonical: string
  licenseUrl: string
  breadcrumbItems: BreadcrumbItem[]
  localePath: string
}) {
  // A Product without a real price is a rich-result error, so it is only
  // emitted when the picture actually has prints on sale.
  const graph = [
    getImageObject({picture, canonical, licenseUrl}),
    ...(prints.length > 0 ? [getProduct({picture, prints, canonical})] : []),
    getBreadcrumbList({items: breadcrumbItems, localePath})
  ]

  return {'@context': CONTEXT, '@graph': graph}
}
