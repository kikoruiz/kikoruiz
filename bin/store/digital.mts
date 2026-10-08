#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import Stripe from 'stripe'
import {
  DEFAULT_CURRENCY,
  DOWNLOAD_MIN_RATING,
  DOWNLOAD_TYPE,
  DOWNLOAD_VARIANTS,
  TAX_BEHAVIOR
} from 'config/store'
import {RawPicture} from 'types/gallery'
import {RawDownload} from 'types/store'

// Digital goods are taxed where the buyer is, so Stripe needs to be told these
// are electronically supplied services instead of the default tangible goods.
const DOWNLOAD_TAX_CODE = 'txcd_10000000'
// Stripe allows 100 writes/second in live mode; this keeps a full run
// comfortably below that without making it crawl.
const WRITE_INTERVAL = 50

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const dataDirectory = path.join(process.cwd(), 'data')
const picturesFile = `${dataDirectory}/pictures/metadata.json`
const downloadsFile = `${dataDirectory}/store/downloads.json`

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
  tier: string
  licence: string
  longestSide: number | null
  price: number
  action: 'reuse' | 'reprice' | 'retax' | 'create'
  priceId?: string
}

interface PictureProduct {
  name: string
  active: boolean
  images: string[]
  shippable: boolean
  tax_code: string
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
    minRating: Number(flags.get('min-rating')) || DOWNLOAD_MIN_RATING,
    limit: Number(flags.get('limit')) || undefined,
    only: flags.get('only') || undefined
  }
}

function getPictureId({fileName}: RawPicture) {
  return fileName.split('.')[0]
}

// This is both the Stripe lookup key and the `downloads.json` row id, and it is
// what `lib/store/downloads.ts` looks the price up by, so the listing and the
// inventory always agree on what a variant is.
function getVariantId({pictureId, tier}: {pictureId: string; tier: string}) {
  return `${DOWNLOAD_TYPE}_${pictureId}_${tier}`
}

function getVariantName({title, tier}: {title: string; tier: string}) {
  return `${title} (${tier.replace('-', ' ')} download)`
}

function getVariantMetadata({
  pictureId,
  tier,
  licence,
  longestSide
}: {
  pictureId: string
  tier: string
  licence: string
  longestSide: number | null
}) {
  return {
    type: DOWNLOAD_TYPE,
    picture_id: pictureId,
    tier,
    licence,
    longest_side: `${longestSide ?? 'original'}`
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
    currentProduct.tax_code !== newProduct.tax_code ||
    JSON.stringify(sortObject(currentProduct.metadata)) !==
      JSON.stringify(sortObject(newProduct.metadata))
  )
}

// The catalogue is picked by EXIF rating, and `--only` deliberately bypasses it
// so a single picture can be put on sale without touching the threshold.
// Pictures already on sale always stay in, since dropping them would archive
// prices that customers may have in a cart or in a past Checkout session.
function getPicturesForDownloading({
  allPictures,
  currentIds,
  minRating,
  limit,
  only
}: Pick<Options, 'minRating' | 'limit' | 'only'> & {
  allPictures: RawPicture[]
  currentIds: Set<string>
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
      picture.rating >= minRating || currentIds.has(getPictureId(picture))
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

async function getDigitalPlan(pictures: RawPicture[]) {
  const plan: PicturePlan[] = []

  for (const picture of pictures) {
    const {title, fileName} = picture
    const pictureId = getPictureId(picture)
    const productId = `${DOWNLOAD_TYPE}_${pictureId}`
    // The site uses a custom image loader, so `/_next/image` answers 400 and the
    // only public derivative is the one the optimize script writes.
    const images = [
      `https://www.kikoruiz.es/pictures/optimized/${fileName.replace(/\.[^.]+$/, '')}-1920w.webp`
    ]
    const product = {
      name: `${title} (digital download)`,
      active: true,
      images,
      shippable: false,
      tax_code: DOWNLOAD_TAX_CODE,
      metadata: {type: DOWNLOAD_TYPE, picture_id: pictureId}
    }
    const variantIds = DOWNLOAD_VARIANTS.map(({tier}) =>
      getVariantId({pictureId, tier})
    )
    const existingPrices = await getExistingPrices(variantIds)
    const variants: VariantPlan[] = DOWNLOAD_VARIANTS.map(
      ({tier, licence, longestSide, price}, index) => {
        const variantId = variantIds[index]
        const existingPrice = existingPrices.get(variantId)
        const variant = {
          variantId,
          name: getVariantName({title, tier}),
          tier,
          licence,
          longestSide,
          price
        }

        if (!existingPrice) return {...variant, action: 'create' as const}

        // A price that never got a tax behaviour can still be told once, which
        // saves recreating it. One that already carries the wrong answer is
        // stuck with it, so that one needs a replacement.
        const action =
          existingPrice.unit_amount !== price * 100 ||
          (existingPrice.tax_behavior !== TAX_BEHAVIOR &&
            existingPrice.tax_behavior !== 'unspecified')
            ? ('reprice' as const)
            : existingPrice.tax_behavior === 'unspecified'
              ? ('retax' as const)
              : ('reuse' as const)

        return {...variant, action, priceId: existingPrice.id}
      }
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
      : 'create'

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
  currentDownloads
}: {
  plan: PicturePlan[]
  currentDownloads: RawDownload[]
}) {
  const variantIds = new Set(
    plan.flatMap(({variants}) => variants.map(({variantId}) => variantId))
  )

  return currentDownloads.filter(({id}) => !variantIds.has(id))
}

async function printDigitalPlan({
  plan,
  orphans,
  isDryRun,
  needsPruning,
  minRating
}: Pick<Options, 'isDryRun' | 'needsPruning' | 'minRating'> & {
  plan: PicturePlan[]
  orphans: RawDownload[]
}) {
  const variants = plan.flatMap(({variants}) => variants)
  const counters = {
    create: variants.filter(({action}) => action === 'create').length,
    reprice: variants.filter(({action}) => action === 'reprice').length,
    retax: variants.filter(({action}) => action === 'retax').length,
    reuse: variants.filter(({action}) => action === 'reuse').length
  }
  const products = {
    create: plan.filter(({productAction}) => productAction === 'create').length,
    update: plan.filter(({productAction}) => productAction === 'update').length
  }
  // A wrong tax code only fails once the first product is written, so the plan
  // resolves its name to make a typo obvious before anything is sent.
  const {name: taxCodeName} = await stripe.taxCodes.retrieve(DOWNLOAD_TAX_CODE)

  console.log(
    `\n📋 ${plan.length} pictures · ${variants.length} variants · rated ${minRating}+${
      isDryRun ? ' · dry run' : ''
    }\n   🧾 ${DOWNLOAD_TAX_CODE} · ${taxCodeName}\n`
  )

  plan
    .filter(({variants}) => variants.some(({action}) => action !== 'reuse'))
    .forEach(({pictureId, title, productAction, variants}) => {
      const pending = variants.filter(({action}) => action !== 'reuse')
      const counts = ['create', 'reprice', 'retax']
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
      `\n   prices · ✨ ${counters.create} to create` +
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

async function applyDigitalPlan(plan: PicturePlan[]) {
  const downloads: RawDownload[] = []

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
      const {variantId, name, tier, licence, longestSide, price, action} =
        variant
      let {priceId} = variant

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
          metadata: getVariantMetadata({pictureId, tier, licence, longestSide})
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

      downloads.push({
        id: variantId,
        name,
        type: DOWNLOAD_TYPE,
        currency: DEFAULT_CURRENCY,
        images,
        pictureId,
        tier,
        price,
        priceId
      })
    }
  }

  return downloads
}

async function pruneOrphans(orphans: RawDownload[]) {
  for (const {id, priceId} of orphans) {
    console.log(`🧹 Archiving the orphan price "${id}".`)
    await stripe.prices.update(priceId, {active: false})
    await sleep(WRITE_INTERVAL)
  }
}

// A `--limit` or `--only` run only knows about part of the catalogue, so its
// rows are merged into the file instead of replacing it.
function getMergedDownloads({
  downloads,
  prunedIds
}: {
  downloads: RawDownload[]
  prunedIds: Set<string>
}) {
  const currentDownloads = JSON.parse(
    fs.readFileSync(downloadsFile, 'utf8')
  ) as RawDownload[]
  const downloadIds = new Set(downloads.map(({id}) => id))

  return [
    ...currentDownloads.filter(
      ({id}) => !downloadIds.has(id) && !prunedIds.has(id)
    ),
    ...downloads
  ]
}

async function saveDigitalInventory() {
  const {isDryRun, needsPruning, minRating, limit, only} = getOptions()
  const allPictures = JSON.parse(
    fs.readFileSync(picturesFile, 'utf8')
  ) as RawPicture[]
  const currentDownloads = JSON.parse(
    fs.readFileSync(downloadsFile, 'utf8')
  ) as RawDownload[]
  const currentIds = new Set(currentDownloads.map(({pictureId}) => pictureId))
  const pictures = getPicturesForDownloading({
    allPictures,
    currentIds,
    minRating,
    limit,
    only
  })
  const plan = await getDigitalPlan(pictures)
  // Orphans can only be told apart on a full run, when the plan covers the
  // whole catalogue.
  const orphans = limit || only ? [] : getOrphans({plan, currentDownloads})

  await printDigitalPlan({plan, orphans, isDryRun, needsPruning, minRating})

  if (isDryRun) {
    console.log('🧪 Dry run, so nothing has been sent to Stripe.\n')

    return undefined
  }

  const downloads = await applyDigitalPlan(plan)

  if (needsPruning) await pruneOrphans(orphans)

  return {
    downloads,
    prunedIds: new Set(needsPruning ? orphans.map(({id}) => id) : [])
  }
}

saveDigitalInventory()
  .then(result => {
    if (!result) {
      process.exit(0)
    } else if (result.downloads.length === 0) {
      console.log('😶 There is nothing to save.\n')
    } else if (process.env.NODE_ENV === 'production') {
      fs.writeFileSync(
        downloadsFile,
        JSON.stringify(getMergedDownloads(result))
      )
      console.log('✅ Digital inventory has been saved properly.\n')
    } else {
      console.log(
        `🙈 ${result.downloads.length} rows are ready, but only a NODE_ENV=production run writes them.\n`
      )
    }
    process.exit(0)
  })
  .catch(error => {
    console.log(error)
    process.exit(1)
  })
