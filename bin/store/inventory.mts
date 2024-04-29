#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import Stripe from 'stripe'
import {RawPicture} from 'types/gallery'

const PICTURES_FOR_PRINTING = [
  '2018-02-11_0022',
  '2020-01-18_0131',
  '2019-03-05_0363',
  '2020-01-25_0040'
]
const DEFAULT_CURRENCY = 'eur'
const PRINT_PRICES = {
  '30': {size: 'A4', paper: 'hahnemuhle-photo-pearl-310', isBorderless: false},
  '35': {size: 'A4', paper: 'hahnemuhle-photo-pearl-310', isBorderless: true},
  '37.5': {
    size: 'A3',
    paper: 'hahnemuhle-photo-pearl-310',
    isBorderless: false
  },
  '42.5': {
    size: 'A3',
    paper: 'hahnemuhle-photo-pearl-310',
    isBorderless: true
  },
  '45': {size: 'A2', paper: 'hahnemuhle-photo-pearl-310', isBorderless: false},
  '50': {size: 'A2', paper: 'hahnemuhle-photo-pearl-310', isBorderless: true}
}
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

function sortObject(data) {
  const sortedKeys = Object.keys(data).sort()
  const sortedObject = {}
  sortedKeys.forEach(key => {
    sortedObject[key] = data[key]
  })

  return sortedObject
}

function needsToBeUpdated(currentProduct, newProduct) {
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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const dataDirectory = path.join(process.cwd(), 'data')
const picturesFile = `${dataDirectory}/pictures/metadata.json`
const productsFile = `${dataDirectory}/store/products.json`
const papersFile = `${dataDirectory}/store/papers.json`

async function saveInventory() {
  const metadata = fs.readFileSync(picturesFile, 'utf8')
  const allPictures = JSON.parse(metadata) as RawPicture[]
  const products = []

  for (const pictureId of PICTURES_FOR_PRINTING) {
    const {title, fileName} = allPictures.find(({fileName}) =>
      fileName.startsWith(pictureId)
    )
    const images = [
      `https://www.kikoruiz.es/_next/image?url=%2Fpictures%2F${fileName}&w=1200&q=75`
    ]
    const currency = DEFAULT_CURRENCY
    const type = 'print'

    for (const priceKey of Object.keys(PRINT_PRICES)) {
      const price = Number(priceKey)
      const {size, paper, isBorderless} = PRINT_PRICES[priceKey]
      const id = isBorderless
        ? `print_${pictureId}_${size}_borderless_${paper}`
        : `print_${pictureId}_${size}_${paper}`
      const {brand: paperBrand, type: paperType} = PRINT_PAPERS[paper]
      const name = isBorderless
        ? `${title} (${size} borderless - ${paperBrand} ${paperType})`
        : `${title} (${size} - ${paperBrand} ${paperType})`
      const metadata = {
        type,
        picture_id: pictureId,
        size: size,
        borderless: `${isBorderless}`,
        paper: paper
      }
      const product = {
        name,
        active: true,
        images,
        metadata,
        shippable: true
      }
      const priceData = {
        currency,
        unit_amount: price * 100
      }
      let stripeProduct
      try {
        stripeProduct = await stripe.products.retrieve(id)
      } catch (error) {}
      const isAlreadyCreated = Boolean(stripeProduct)
      let newStripeProduct

      if (isAlreadyCreated) {
        if (needsToBeUpdated(stripeProduct, product)) {
          console.log(`🛠️ Updating the product "${id}".`)
          newStripeProduct = await stripe.products.update(id, product)
        } else {
          newStripeProduct = stripeProduct
        }
      } else {
        console.log(`✨ Creating a new product: "${id}".`)
        newStripeProduct = await stripe.products.create({
          id,
          ...product,
          default_price_data: priceData
        })
      }

      if (newStripeProduct && process.env.NODE_ENV === 'production') {
        products.push({
          id,
          name,
          type,
          currency,
          images,
          pictureId,
          size,
          isBorderless,
          paper,
          price,
          priceId: newStripeProduct.default_price
        })
      }
    }
  }

  return products
}

saveInventory()
  .then(products => {
    if (products.length > 0) {
      fs.writeFileSync(productsFile, JSON.stringify(products))
      fs.writeFileSync(papersFile, JSON.stringify(PRINT_PAPERS))
      console.log('\n✅ Inventory has been saved properly.\n')
    }

    console.log('\n😶 There is nothing to save.\n')
    process.exit(0)
  })
  .catch(error => {
    console.log(error)
    process.exit(1)
  })
