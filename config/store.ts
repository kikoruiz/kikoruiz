import papers from 'data/store/papers.json'

export const DEFAULT_CURRENCY = 'eur'

// Prices shown to a consumer in the EU already contain the tax, so the amount
// on the card is the amount on the site. Stripe accepts this once per price and
// refuses to change it afterwards, so a different answer means new prices.
export const TAX_BEHAVIOR = 'inclusive'
export const DEFAULT_PRINT_PRICE = 45
export const DEFAULT_PRINT_SIZE = 'A2'
export const DEFAULT_UNIT_OF_MEASUREMENT = 'mm'
export const DEFAULT_PRINT_PAPER = 'hahnemuhle-photo-pearl-310'

export const PRINT_SIZES = {
  A2: {mm: '420x594', cm: '42x59.4', in: '16.5x23.4'},
  A3: {mm: '297x420', cm: '29.7x42', in: '11.7x16.5'},
  A4: {mm: '210x297', cm: '21x29.7', in: '8.3x11.7'}
}
export const UNITS_OF_MEASUREMENT = ['mm', 'cm', 'in']

// A4, A3 and A2 share this exact long:short ratio by design.
export const PRINT_SHEET_RATIO = 297 / 210

// How far from the sheet's own shape a picture can be and still be worth
// selling as a DIN print at all. Measured against the real catalogue, the
// ratios cluster at 6.1% off (the classic 3:2 of a camera sensor) with nothing
// between 7.3% and 13.1%, so 10% sits right in that gap: it keeps every
// ordinary frame and drops the squares and the panoramas, which no A4, A3 or
// A2 can hold without either cropping the composition or leaving a mat so
// uneven it stops looking deliberate.
export const PRINT_MAX_RATIO_DEVIATION = 0.1

// Every picture in the gallery is rated 3 at least, so this is the only
// threshold that actually selects: 4 and above is the printable catalogue.
export const PRINT_MIN_RATING = 4

// Rating and ratio decide the catalogue on their own, so this is purely for
// the cases neither can express: a picture that qualifies on both counts but
// is not mine to sell, or that I simply would rather not.
export const PICTURES_NOT_FOR_SALE = [
  // Temps de Collita
  '2017-06-11_0014'
]

export const PRINT_VARIANTS = [
  {size: 'A4', isBorderless: false, price: 30},
  {size: 'A4', isBorderless: true, price: 35},
  {size: 'A3', isBorderless: false, price: 37.5},
  {size: 'A3', isBorderless: true, price: 42.5},
  {size: 'A2', isBorderless: false, price: 45},
  {size: 'A2', isBorderless: true, price: 50}
]

// It prefixes every download id, so it is also how the checkout tells a file
// apart from something that has to be put in an envelope.
export const DOWNLOAD_TYPE = 'download'

// Same threshold as the prints, so a picture good enough to hang on a wall is
// the one good enough to sell as a file.
export const DOWNLOAD_MIN_RATING = PRINT_MIN_RATING

// `longestSide` is the pixel size the file is resized to, and `null` means the
// original one straight out of the raw development.
export const DOWNLOAD_VARIANTS = [
  {tier: 'web', longestSide: 1920, licence: 'personal', price: 3},
  {tier: 'full-resolution', longestSide: null, licence: 'personal', price: 9},
  {tier: 'commercial', longestSide: null, licence: 'commercial', price: 59}
]
export const DEFAULT_DOWNLOAD_TIER = DOWNLOAD_VARIANTS[0].tier

export const FILTER_OPTIONS = {
  size: Object.keys(PRINT_SIZES).map(key => ({
    value: key.toLowerCase(),
    name: key
  })),
  sizeOption: ['with-border', 'borderless'],
  paper: Object.keys(papers).map(key => ({
    value: key,
    name: `${papers[key].brand} ${papers[key].type}`
  }))
}
export const SIMPLE_FILTERS = ['size-option']
