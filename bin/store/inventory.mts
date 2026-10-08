#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import Stripe from 'stripe'
import {
  DEFAULT_PRINT_PAPER,
  PRINT_MIN_RATING,
  PRINT_VARIANTS,
  TAX_BEHAVIOR
} from 'config/store'
import {fitsBorderless} from 'lib/utils/pictures'
import {RawPicture} from 'types/gallery'
import {RawPrint} from 'types/store'

const DEFAULT_CURRENCY = 'eur'
const PRINT_TYPE = 'print'
// Stripe allows 100 writes/second in live mode; this keeps a full 187-picture
// run comfortably below that without making it crawl.
const WRITE_INTERVAL = 50
const PRINT_PAPERS = {
  'hahnemuhle-photo-pearl-310': {
    brand: 'Hahnemühle',
    type: 'Photo Pearl 310',
    gsm: 310,
    url: {
      en: 'https://www.hahnemuehle.com/en/digital-fineart/hahnemuehle-photo/p/Product/show/37/649.html',
      es: 'https://www.hahnemuehle.com/es/digital-fineart/hahnemuehle-photo/p/Product/show/37/649.html',
      ca: 'https://www.hahnemuehle.com/es/digital-fineart/hahnemuehle-photo/p/Product/show/37/649.html'
    }
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const dataDirectory = path.join(process.cwd(), 'data')
const picturesFile = `${dataDirectory}/pictures/metadata.json`
const productsFile = `${dataDirectory}/store/products.json`
const papersFile = `${dataDirectory}/store/papers.json`

interface Options {
  isDryRun: boolean
  needsPruning: boolean
  minRating: number
  limit?: number
  only?: string
}

interface VariantPlan {
  variantId: string
  name: string
  size: string
  isBorderless: boolean
  paper: string
  price: number
  action: 'reuse' | 'adopt' | 'reprice' | 'retax' | 'create'
  priceId?: string
  taxBehavior?: Stripe.Price.TaxBehavior
}

interface PictureProduct {
  name: string
  active: boolean
  images: string[]
  shippable: boolean
  metadata: {type: string; picture_id: string}
}

interface PicturePlan {
  pictureId: string
  title: string
  images: string[]
  productId: string
  productAction: 'reuse' | 'update' | 'create'
  product: PictureProduct
  variants: VariantPlan[]
}

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

function getOptions(): Options {
  const flags = new Map(
    process.argv
      .slice(2)
      .filter(argument => argument.startsWith('--'))
      .map(argument => {
        const [key, value] = argument.slice(2).split('=')

        return [key, value ?? '']
      })
  )

  return {
    isDryRun: flags.has('dry-run'),
    needsPruning: flags.has('prune'),
    minRating: Number(flags.get('min-rating')) || PRINT_MIN_RATING,
    limit: Number(flags.get('limit')) || undefined,
    only: flags.get('only') || undefined
  }
}

function getPictureId({fileName}: RawPicture) {
  return fileName.split('.')[0]
}

// This is both the Stripe lookup key and the `products.json` row id, and it is
// the very same string the old one-product-per-variant script used as a product
// id, so the rows already in the file keep their ids untouched.
function getVariantId({
  pictureId,
  size,
  isBorderless,
  paper
}: {
  pictureId: string
  size: string
  isBorderless: boolean
  paper: string
}) {
  return isBorderless
    ? `print_${pictureId}_${size}_borderless_${paper}`
    : `print_${pictureId}_${size}_${paper}`
}

function getVariantName({
  title,
  size,
  isBorderless,
  paper
}: {
  title: string
  size: string
  isBorderless: boolean
  paper: string
}) {
  const {brand, type} = PRINT_PAPERS[paper]

  return isBorderless
    ? `${title} (${size} borderless - ${brand} ${type})`
    : `${title} (${size} - ${brand} ${type})`
}

function getVariantMetadata({
  pictureId,
  size,
  isBorderless,
  paper
}: {
  pictureId: string
  size: string
  isBorderless: boolean
  paper: string
}) {
  return {
    type: PRINT_TYPE,
    picture_id: pictureId,
    size,
    borderless: `${isBorderless}`,
    paper
  }
}

function sortObject(data: Record<string, unknown>) {
  return Object.fromEntries(
    Object.keys(data)
      .sort()
      .map(key => [key, data[key]])
  )
}

function needsToBeUpdated(
  currentProduct: Stripe.Product,
  newProduct: PictureProduct
) {
  return (
    currentProduct.name !== newProduct.name ||
    currentProduct.active !== newProduct.active ||
    JSON.stringify(currentProduct.images) !==
      JSON.stringify(newProduct.images) ||
    currentProduct.shippable !== newProduct.shippable ||
    JSON.stringify(sortObject(currentProduct.metadata)) !==
      JSON.stringify(sortObject(newProduct.metadata))
  )
}

// The catalogue is picked by EXIF rating, and `--only` deliberately bypasses it
// so a single picture can be put on sale without touching the threshold.
// Pictures already on sale always stay in, since dropping them would archive
// live prices that customers may have in a cart or in a past Checkout session.
function getPicturesForPrinting({
  allPictures,
  legacyIds,
  minRating,
  limit,
  only
}: Pick<Options, 'minRating' | 'limit' | 'only'> & {
  allPictures: RawPicture[]
  legacyIds: Set<string>
}) {
  if (only) {
    const picture = allPictures.find(
      picture => getPictureId(picture) === only || picture.fileName === only
    )

    if (!picture) throw new Error(`There is no picture with the id "${only}".`)

    return [picture]
  }

  const pictures = allPictures.filter(
    picture =>
      picture.rating >= minRating || legacyIds.has(getPictureId(picture))
  )

  return limit ? pictures.slice(0, limit) : pictures
}

async function getExistingPrices(variantIds: string[]) {
  const prices = new Map<string, Stripe.Price>()

  // `lookup_keys` takes at most 10 values per request.
  for (let index = 0; index < variantIds.length; index += 10) {
    const {data} = await stripe.prices.list({
      lookup_keys: variantIds.slice(index, index + 10),
      active: true,
      limit: 100
    })

    data.forEach(price => {
      prices.set(price.lookup_key, price)
    })
  }

  return prices
}

// Stripe will not let a price change its product, so the prices created by the
// old script stay where they are forever. What can be migrated is their lookup
// key, which is what makes both shapes resolvable the same way.
async function getLegacyPrice(variantId: string) {
  try {
    const {default_price: defaultPrice} = await stripe.products.retrieve(
      variantId,
      {expand: ['default_price']}
    )

    return defaultPrice as Stripe.Price
  } catch {
    return undefined
  }
}

async function getInventoryPlan({
  pictures,
  legacyIds
}: {
  pictures: RawPicture[]
  legacyIds: Set<string>
}) {
  const plan: PicturePlan[] = []

  for (const picture of pictures) {
    const {title, fileName, imageSize} = picture
    const pictureId = getPictureId(picture)
    const productId = `${PRINT_TYPE}_${pictureId}`
    // The site uses a custom image loader, so `/_next/image` answers 400 and the
    // only public derivative is the one the optimize script writes.
    const images = [
      `https://www.kikoruiz.es/pictures/optimized/${fileName.replace(/\.[^.]+$/, '')}-1920w.webp`
    ]
    const product = {
      name: title,
      active: true,
      images,
      shippable: true,
      metadata: {type: PRINT_TYPE, picture_id: pictureId}
    }
    const paper = DEFAULT_PRINT_PAPER
    // A picture too far from the sheet's own ratio only gets the bordered
    // sizes: going edge to edge would mean cropping it or cutting the paper to
    // a size that isn't actually A4, A3 or A2 any more.
    const printVariants = PRINT_VARIANTS.filter(
      ({isBorderless}) => !isBorderless || fitsBorderless(imageSize)
    )
    const variantIds = printVariants.map(({size, isBorderless}) =>
      getVariantId({pictureId, size, isBorderless, paper})
    )
    const existingPrices = await getExistingPrices(variantIds)
    const variants: VariantPlan[] = []

    for (const [
      index,
      {size, isBorderless, price}
    ] of printVariants.entries()) {
      const variantId = variantIds[index]
      const name = getVariantName({title, size, isBorderless, paper})
      const existingPrice = existingPrices.get(variantId)
      const variant = {variantId, name, size, isBorderless, paper, price}

      if (existingPrice) {
        const {tax_behavior: taxBehavior} = existingPrice
        // A price that never got a tax behaviour can still be told once, which
        // saves recreating it. One that already carries the wrong answer is
        // stuck with it, so that one needs a replacement.
        const action =
          existingPrice.unit_amount !== price * 100 ||
          (taxBehavior !== TAX_BEHAVIOR && taxBehavior !== 'unspecified')
            ? 'reprice'
            : taxBehavior === 'unspecified'
              ? 'retax'
              : 'reuse'

        variants.push({
          ...variant,
          action,
          priceId: existingPrice.id,
          taxBehavior
        })
        continue
      }

      // Only the pictures that were already on sale can have a legacy product
      // to adopt, so the rest skip the lookup entirely.
      const legacyPrice = legacyIds.has(pictureId)
        ? await getLegacyPrice(variantId)
        : undefined

      variants.push({
        ...variant,
        action: legacyPrice ? 'adopt' : 'create',
        priceId: legacyPrice?.id,
        taxBehavior: legacyPrice?.tax_behavior
      })
    }

    // The per-picture product is only needed when a price has to be created on
    // it, since the adopted ones keep living under their legacy product.
    const needsProduct = variants.some(
      ({action}) => action === 'create' || action === 'reprice'
    )
    let currentProduct: Stripe.Product

    try {
      currentProduct = await stripe.products.retrieve(productId)
    } catch {
      currentProduct = undefined
    }

    const productAction = currentProduct
      ? needsToBeUpdated(currentProduct, product)
        ? 'update'
        : 'reuse'
      : needsProduct
        ? 'create'
        : 'reuse'

    plan.push({
      pictureId,
      title,
      images,
      productId,
      productAction,
      product,
      variants
    })
  }

  return plan
}

function getOrphans({
  plan,
  currentProducts
}: {
  plan: PicturePlan[]
  currentProducts: RawPrint[]
}) {
  const variantIds = new Set(
    plan.flatMap(({variants}) => variants.map(({variantId}) => variantId))
  )

  return currentProducts.filter(({id}) => !variantIds.has(id))
}

function printInventoryPlan({
  plan,
  orphans,
  isDryRun,
  needsPruning,
  minRating
}: Pick<Options, 'isDryRun' | 'needsPruning' | 'minRating'> & {
  plan: PicturePlan[]
  orphans: RawPrint[]
}) {
  const variants = plan.flatMap(({variants}) => variants)
  const counters = {
    create: variants.filter(({action}) => action === 'create').length,
    adopt: variants.filter(({action}) => action === 'adopt').length,
    reprice: variants.filter(({action}) => action === 'reprice').length,
    retax: variants.filter(({action}) => action === 'retax').length,
    reuse: variants.filter(({action}) => action === 'reuse').length
  }
  const products = {
    create: plan.filter(({productAction}) => productAction === 'create').length,
    update: plan.filter(({productAction}) => productAction === 'update').length
  }

  console.log(
    `\n📋 ${plan.length} pictures · ${variants.length} variants · rated ${minRating}+${
      isDryRun ? ' · dry run' : ''
    }\n`
  )

  plan
    .filter(({variants}) => variants.some(({action}) => action !== 'reuse'))
    .forEach(({pictureId, title, productAction, variants}) => {
      const pending = variants.filter(({action}) => action !== 'reuse')
      const counts = ['create', 'adopt', 'reprice', 'retax']
        .map(action => ({
          action,
          count: pending.filter(variant => variant.action === action).length
        }))
        .filter(({count}) => count > 0)
        .map(({action, count}) => `${count} to ${action}`)
        .join(' · ')

      console.log(
        `   ${pictureId} · ${title} · product: ${productAction} · ${counts}`
      )
    })

  console.log(
    `\n   products · ✨ ${products.create} to create · 🛠️ ${products.update} to update` +
      `\n   prices · ✨ ${counters.create} to create · 🔗 ${counters.adopt} to adopt` +
      ` · 💸 ${counters.reprice} to reprice · 🧾 ${counters.retax} to mark ${TAX_BEHAVIOR} of tax` +
      ` · ♻️ ${counters.reuse} untouched`
  )

  if (orphans.length > 0) {
    console.log(
      `   orphans · 🧹 ${orphans.length} rows no longer match any variant` +
        `${needsPruning ? ', they will be archived' : ', run with --prune to archive them'}`
    )
  }

  console.log('')
}

async function applyInventoryPlan(plan: PicturePlan[]) {
  const products: RawPrint[] = []

  for (const {
    pictureId,
    images,
    productId,
    productAction,
    product,
    variants
  } of plan) {
    if (productAction === 'create') {
      console.log(`✨ Creating the product "${productId}".`)
      await stripe.products.create({id: productId, ...product})
      await sleep(WRITE_INTERVAL)
    }

    if (productAction === 'update') {
      console.log(`🛠️ Updating the product "${productId}".`)
      await stripe.products.update(productId, product)
      await sleep(WRITE_INTERVAL)
    }

    for (const variant of variants) {
      const {variantId, name, size, isBorderless, paper, price, action} =
        variant
      const metadata = getVariantMetadata({
        pictureId,
        size,
        isBorderless,
        paper
      })
      let {priceId} = variant

      if (action === 'adopt') {
        console.log(`🔗 Adopting the legacy price of "${variantId}".`)
        await stripe.prices.update(priceId, {
          lookup_key: variantId,
          transfer_lookup_key: true,
          nickname: name,
          metadata,
          // Stripe rejects the field once it carries an answer, and a legacy
          // price that already has one keeps it.
          ...(variant.taxBehavior === 'unspecified' && {
            tax_behavior: TAX_BEHAVIOR
          })
        })
        await sleep(WRITE_INTERVAL)
      }

      // The amount of a Stripe price is immutable, so repricing means creating
      // the new one, moving the lookup key over and archiving the old one.
      if (action === 'create' || action === 'reprice') {
        const previousPriceId = action === 'reprice' ? priceId : undefined

        console.log(
          previousPriceId
            ? `💸 Repricing "${variantId}" to ${price}.`
            : `✨ Creating the price "${variantId}".`
        )

        const {id} = await stripe.prices.create({
          product: productId,
          currency: DEFAULT_CURRENCY,
          unit_amount: price * 100,
          tax_behavior: TAX_BEHAVIOR,
          lookup_key: variantId,
          transfer_lookup_key: true,
          nickname: name,
          metadata
        })
        priceId = id
        await sleep(WRITE_INTERVAL)

        if (previousPriceId) {
          await stripe.prices.update(previousPriceId, {active: false})
          await sleep(WRITE_INTERVAL)
        }
      } else if (action === 'retax') {
        console.log(`🧾 Marking "${variantId}" as ${TAX_BEHAVIOR} of tax.`)

        await stripe.prices.update(priceId, {tax_behavior: TAX_BEHAVIOR})
        await sleep(WRITE_INTERVAL)
      }

      products.push({
        id: variantId,
        name,
        type: PRINT_TYPE,
        currency: DEFAULT_CURRENCY,
        images,
        pictureId,
        size,
        isBorderless,
        paper,
        price,
        priceId
      })
    }
  }

  return products
}

async function pruneOrphans(orphans: RawPrint[]) {
  for (const {id, priceId} of orphans) {
    console.log(`🧹 Archiving the orphan price "${id}".`)
    await stripe.prices.update(priceId, {active: false})
    await sleep(WRITE_INTERVAL)
  }
}

// A `--limit` or `--only` run only knows about part of the catalogue, so its
// rows are merged into the file instead of replacing it.
function getMergedProducts({
  products,
  prunedIds
}: {
  products: RawPrint[]
  prunedIds: Set<string>
}) {
  const currentProducts = JSON.parse(
    fs.readFileSync(productsFile, 'utf8')
  ) as RawPrint[]
  const productIds = new Set(products.map(({id}) => id))

  return [
    ...currentProducts.filter(
      ({id}) => !productIds.has(id) && !prunedIds.has(id)
    ),
    ...products
  ]
}

async function saveInventory() {
  const {isDryRun, needsPruning, minRating, limit, only} = getOptions()
  const allPictures = JSON.parse(
    fs.readFileSync(picturesFile, 'utf8')
  ) as RawPicture[]
  const currentProducts = JSON.parse(
    fs.readFileSync(productsFile, 'utf8')
  ) as RawPrint[]
  const legacyIds = new Set(currentProducts.map(({pictureId}) => pictureId))
  const pictures = getPicturesForPrinting({
    allPictures,
    legacyIds,
    minRating,
    limit,
    only
  })
  const plan = await getInventoryPlan({pictures, legacyIds})
  // Orphans can only be told apart on a full run, when the plan covers the
  // whole catalogue.
  const orphans = limit || only ? [] : getOrphans({plan, currentProducts})

  printInventoryPlan({plan, orphans, isDryRun, needsPruning, minRating})

  if (isDryRun) {
    console.log('🧪 Dry run, so nothing has been sent to Stripe.\n')

    return undefined
  }

  const products = await applyInventoryPlan(plan)

  if (needsPruning) await pruneOrphans(orphans)

  return {
    products,
    prunedIds: new Set(needsPruning ? orphans.map(({id}) => id) : [])
  }
}

saveInventory()
  .then(result => {
    if (!result) {
      process.exit(0)
    } else if (result.products.length === 0) {
      console.log('😶 There is nothing to save.\n')
    } else if (process.env.NODE_ENV === 'production') {
      fs.writeFileSync(productsFile, JSON.stringify(getMergedProducts(result)))
      fs.writeFileSync(papersFile, JSON.stringify(PRINT_PAPERS))
      console.log('✅ Inventory has been saved properly.\n')
    } else {
      console.log(
        `🙈 ${result.products.length} rows are ready, but only a NODE_ENV=production run writes them.\n`
      )
    }
    process.exit(0)
  })
  .catch(error => {
    console.log(error)
    process.exit(1)
  })
