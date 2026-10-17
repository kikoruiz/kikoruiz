import {SITE_NAME} from 'config'
import {ISLANDS_SHIPPING, RETURN_POLICY, SHIPPING} from 'config/store'
import {getAbsoluteUrl, getSocialImageSize, getSocialImageUrl} from './utils'
import {BreadcrumbItem} from 'types'
import {Picture} from 'types/gallery'
import {PictureDownload, PicturePrint} from 'types/store'

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

function getExifData({model, lens, shotInfo}: Picture) {
  const properties = [
    ['Camera', model],
    ['Lens', lens],
    ['ISO', shotInfo?.iso],
    ['Aperture', shotInfo?.aperture && `f/${shotInfo.aperture}`],
    ['Exposure time', shotInfo?.shutterSpeed && `${shotInfo.shutterSpeed} s`],
    ['Focal length', shotInfo?.focalLength && `${shotInfo.focalLength} mm`]
  ]

  return properties
    .filter(([, value]) => value)
    .map(([name, value]) => ({'@type': 'PropertyValue', name, value}))
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
  const {name, description, image, imageSize, processingDate, date, rawTags} =
    picture
  const {width, height} = getSocialImageSize(imageSize)
  const contentLocation = getContentLocation(picture)
  const exifData = getExifData(picture)

  return {
    '@type': 'ImageObject',
    contentUrl: getAbsoluteUrl(getSocialImageUrl(image.src)),
    width,
    height,
    name,
    ...(description && {description}),
    ...(rawTags?.length > 0 && {keywords: rawTags.join(', ')}),
    creator: getCreator(),
    copyrightNotice: `© ${SITE_NAME}`,
    creditText: SITE_NAME,
    license: licenseUrl,
    acquireLicensePage: canonical,
    datePublished: processingDate ?? date,
    ...(exifData.length > 0 && {exifData}),
    ...(contentLocation && {contentLocation})
  }
}

// What Google needs to show a print as a merchant listing: where it ships, for
// how much, and how it comes back. Each part is only said when it is known, so
// nothing here is a promise the shop does not keep.
function getPrintShippingDetails() {
  if (SHIPPING.rate === null) return undefined

  const range = (days: {min: number; max: number}) => ({
    '@type': 'QuantitativeValue',
    minValue: days.min,
    maxValue: days.max,
    unitCode: 'DAY'
  })
  const deliveryTime = (SHIPPING.handlingDays || SHIPPING.transitDays) && {
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      ...(SHIPPING.handlingDays && {
        handlingTime: range(SHIPPING.handlingDays)
      }),
      ...(SHIPPING.transitDays && {transitTime: range(SHIPPING.transitDays)})
    }
  }
  const getDetails = (value: number, addressRegion: string[]) => ({
    '@type': 'OfferShippingDetails',
    shippingRate: {'@type': 'MonetaryAmount', value, currency: CURRENCY},
    shippingDestination: {
      '@type': 'DefinedRegion',
      addressCountry: SHIPPING.country,
      addressRegion
    },
    ...deliveryTime
  })

  return [
    getDetails(SHIPPING.rate, SHIPPING.regions),
    getDetails(ISLANDS_SHIPPING.surcharge, ISLANDS_SHIPPING.regions)
  ]
}

const PRINT_RETURN_POLICY = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: RETURN_POLICY.country,
  returnPolicyCategory: `${CONTEXT}/MerchantReturnFiniteReturnWindow`,
  merchantReturnDays: RETURN_POLICY.days,
  returnMethod: `${CONTEXT}/ReturnByMail`,
  returnFees: `${CONTEXT}/ReturnFeesCustomerResponsibility`,
  refundType: `${CONTEXT}/FullRefund`
}

// The buyer of a file waives the right of withdrawal when paying for it.
const DOWNLOAD_RETURN_POLICY = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: RETURN_POLICY.country,
  returnPolicyCategory: `${CONTEXT}/MerchantReturnNotPermitted`
}

function getProduct({
  picture,
  prints,
  downloads,
  canonical
}: {
  picture: Picture
  prints: PicturePrint[]
  downloads: PictureDownload[]
  canonical: string
}) {
  const shippingDetails = getPrintShippingDetails()
  const baseOffer = {
    '@type': 'Offer',
    priceCurrency: CURRENCY,
    availability: IN_STOCK,
    itemCondition: NEW_CONDITION,
    url: canonical
  }
  const offers = [
    ...prints.map(({id, name, price}) => ({
      ...baseOffer,
      name,
      sku: id,
      price,
      ...(shippingDetails && {shippingDetails}),
      hasMerchantReturnPolicy: PRINT_RETURN_POLICY
    })),
    ...downloads.map(({id, name, price}) => ({
      ...baseOffer,
      name,
      sku: id,
      price,
      category: 'Digital download',
      hasMerchantReturnPolicy: DOWNLOAD_RETURN_POLICY
    }))
  ]
  const prices = offers.map(({price}) => price)

  return {
    '@type': 'Product',
    name: picture.name,
    ...(picture.description && {description: picture.description}),
    image: getAbsoluteUrl(getSocialImageUrl(picture.image.src)),
    url: canonical,
    brand: {'@type': 'Brand', name: SITE_NAME},
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      priceCurrency: CURRENCY,
      offerCount: offers.length,
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
  dateModified,
  image,
  author,
  url,
  keywords,
  inLanguage
}: {
  headline: string
  description: string
  datePublished: string
  dateModified?: string
  image: string
  author: string
  url: string
  keywords?: string
  inLanguage?: string
}) {
  const person = {...getCreator(), name: author}

  return {
    '@context': CONTEXT,
    '@type': 'BlogPosting',
    headline,
    description,
    datePublished,
    dateModified: dateModified ?? datePublished,
    image,
    url,
    mainEntityOfPage: {'@type': 'WebPage', '@id': url},
    author: person,
    publisher: person,
    ...(keywords && {keywords}),
    ...(inLanguage && {inLanguage})
  }
}

export function getPictureStructuredData({
  picture,
  prints,
  downloads = [],
  canonical,
  licenseUrl,
  breadcrumbItems,
  localePath
}: {
  picture: Picture
  prints: PicturePrint[]
  downloads?: PictureDownload[]
  canonical: string
  licenseUrl: string
  breadcrumbItems: BreadcrumbItem[]
  localePath: string
}) {
  // A Product without a real price is a rich-result error, so it is only
  // emitted when the picture actually has something on sale.
  const hasOffers = prints.length + downloads.length > 0
  const graph = [
    getImageObject({picture, canonical, licenseUrl}),
    ...(hasOffers ? [getProduct({picture, prints, downloads, canonical})] : []),
    getBreadcrumbList({items: breadcrumbItems, localePath})
  ]

  return {'@context': CONTEXT, '@graph': graph}
}
