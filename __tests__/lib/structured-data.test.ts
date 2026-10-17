import {describe, it, expect, afterEach} from 'vitest'
import {SHIPPING} from 'config/store'
import {getPictureStructuredData} from 'lib/structured-data'
import {Picture} from 'types/gallery'

const picture = {
  name: 'Secrets of the Misty Grove',
  description: 'Captured in Aigüestortes National Park.',
  id: '2024-04-08_0133',
  slug: 'secrets-of-the-misty-grove',
  image: {src: '/pictures/2024-04-08_0133.jpg', orientation: 'horizontal'},
  imageSize: '6720x4480',
  date: '2024-04-08T15:31:19.450+02:00',
  processingDate: '2024-08-21T17:45:08+02:00',
  model: 'Canon EOS R',
  lens: 'Canon RF 15-35mm F2.8L IS USM',
  shotInfo: {iso: 50, aperture: 16, shutterSpeed: '1/5', focalLength: 15},
  rawTags: ['landscape', 'long exposure'],
  location: {city: 'Alt Àneu', state: 'Lleida', country: 'Spain'}
} as unknown as Picture
const prints = [
  {
    id: 'print_2024-04-08_0133_A4_hahnemuhle-photo-pearl-310',
    name: 'Secrets of the Misty Grove (A4)',
    size: 'A4',
    isBorderless: false,
    paper: 'hahnemuhle-photo-pearl-310',
    price: 30
  }
]
const downloads = [
  {
    id: 'download_2024-04-08_0133_web',
    name: 'Secrets of the Misty Grove (Screen)',
    price: 3
  }
]
const base = {
  picture,
  canonical: 'http://test/galeria/estacional/secrets-of-the-misty-grove',
  licenseUrl: 'http://test/derechos-de-autor',
  breadcrumbItems: [],
  localePath: ''
}

// The graph is checked by shape, so its nodes are read as plain objects.
type GraphNode = Record<string, any>

function getGraph(
  args: Partial<Parameters<typeof getPictureStructuredData>[0]>
): Record<string, GraphNode> {
  const {'@graph': graph} = getPictureStructuredData({
    ...base,
    prints,
    downloads,
    ...args
  })

  return Object.fromEntries(graph.map(item => [item['@type'], item]))
}

afterEach(() => {
  SHIPPING.rate = 0
})

describe('structured data lib', () => {
  // Tests for the `ImageObject`.

  it('gives the image its camera settings as exif data', () => {
    const {ImageObject} = getGraph({})
    const exif = Object.fromEntries(
      ImageObject.exifData.map(({name, value}) => [name, value])
    )

    expect(exif).toEqual({
      Camera: 'Canon EOS R',
      Lens: 'Canon RF 15-35mm F2.8L IS USM',
      ISO: 50,
      Aperture: 'f/16',
      'Exposure time': '1/5 s',
      'Focal length': '15 mm'
    })
  })

  it('gives the image the tags of the picture as keywords', () => {
    expect(getGraph({}).ImageObject.keywords).toBe('landscape, long exposure')
  })

  // Tests for the `Product`.

  it('offers the prints and the files of a picture together', () => {
    const {offers} = getGraph({}).Product.offers

    expect(offers.map(({sku}) => sku)).toEqual([
      'print_2024-04-08_0133_A4_hahnemuhle-photo-pearl-310',
      'download_2024-04-08_0133_web'
    ])
    expect(getGraph({}).Product.offers).toMatchObject({
      lowPrice: 3,
      highPrice: 30,
      offerCount: 2
    })
  })

  it('has a product for a picture that only sells files', () => {
    expect(getGraph({prints: []}).Product.offers.offerCount).toBe(1)
  })

  it('has no product for a picture with nothing on sale', () => {
    expect(getGraph({prints: [], downloads: []}).Product).toBeUndefined()
  })

  it('lets the buyer of a print return it within the window of the terms', () => {
    const [print] = getGraph({}).Product.offers.offers

    expect(print.hasMerchantReturnPolicy).toMatchObject({
      applicableCountry: 'ES',
      merchantReturnDays: 14
    })
  })

  it('does not let the buyer of a file return it', () => {
    const [, download] = getGraph({}).Product.offers.offers

    expect(download.hasMerchantReturnPolicy.returnPolicyCategory).toContain(
      'MerchantReturnNotPermitted'
    )
    expect(download.shippingDetails).toBeUndefined()
  })

  it('says the shipping of a print is free, since the price includes it', () => {
    const [print] = getGraph({}).Product.offers.offers
    const [peninsula] = print.shippingDetails

    expect(peninsula).toMatchObject({
      shippingRate: {value: 0, currency: 'EUR'},
      shippingDestination: {addressCountry: 'ES'}
    })
  })

  it('ships to the peninsula and the Balearic Islands for free', () => {
    const [print] = getGraph({}).Product.offers.offers
    const regions: string[] =
      print.shippingDetails[0].shippingDestination.addressRegion

    expect(regions).toHaveLength(48)
    expect(regions).toContain('ES-PM')
    expect(regions).not.toContain('ES-GC')
    expect(regions).not.toContain('ES-CE')
  })

  it('charges the surcharge to Canarias, Ceuta and Melilla', () => {
    const [print] = getGraph({}).Product.offers.offers
    const islands = print.shippingDetails[1]

    expect(islands.shippingRate.value).toBe(7.65)
    expect(islands.shippingDestination.addressRegion).toEqual([
      'ES-GC',
      'ES-TF',
      'ES-CE',
      'ES-ML'
    ])
  })

  it('says nothing about shipping when there is no rate', () => {
    SHIPPING.rate = null
    const [print] = getGraph({}).Product.offers.offers

    expect(print.shippingDetails).toBeUndefined()
  })

  it('says how much the shipping of a print costs when it is not free', () => {
    SHIPPING.rate = 4.5
    const [print] = getGraph({}).Product.offers.offers

    expect(print.shippingDetails[0].shippingRate.value).toBe(4.5)
  })
})
