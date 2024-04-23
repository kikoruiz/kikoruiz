#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import Stripe from 'stripe'
import {RawPicture} from 'types/gallery'

const PICTURES_FOR_PRINTING = [
  {id: '2018-02-11_0022'},
  {id: '2020-01-18_0131'},
  {id: '2019-03-05_0363'},
  {id: '2020-01-25_0040'}
]
const DEFAULT_CURRENCY = 'eur'
const DEFAULT_PRINT_PRICE = 45
const DEFAULT_PRINT_SIZE = 'A2'
const DEFAULT_PRINT_PAPER = 'hahnemuhle-photo-pearl-310'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const dataDirectory = path.join(process.cwd(), 'data')
const picturesFile = `${dataDirectory}/pictures/metadata.json`
const productsFile = `${dataDirectory}/store/products.json`

async function saveInventory() {
  const metadata = fs.readFileSync(picturesFile, 'utf8')
  const allPictures = JSON.parse(metadata) as RawPicture[]
  const {data: stripeProducts} = await stripe.products.list()
  const price = DEFAULT_PRINT_PRICE * 100
  const currency = DEFAULT_CURRENCY
  const products = await Promise.all(
    PICTURES_FOR_PRINTING.map(async ({id}) => {
      const {title: name, fileName} = allPictures.find(({fileName}) =>
        fileName.startsWith(id)
      )
      const image = `https://www.kikoruiz.es/_next/image?url=%2Fpictures%2F${fileName}&w=1200&q=75`
      const metadata = {
        id,
        print_size: DEFAULT_PRINT_SIZE,
        print_paper: DEFAULT_PRINT_PAPER
      }
      const product = {
        name,
        active: true,
        images: [image],
        metadata,
        shippable: true
      }
      const priceData = {
        currency,
        unit_amount: price
      }

      const stripeProduct = stripeProducts.find(
        ({metadata}) => metadata.id === id
      )
      const isAlreadyCreated = Boolean(stripeProduct)
      if (isAlreadyCreated) {
        await stripe.products.update(stripeProduct.id, product)
      } else {
        await stripe.products.create({
          ...product,
          default_price_data: priceData
        })
      }

      return {
        id,
        name,
        currency,
        price,
        ...(stripeProduct.default_price && {
          price_id: stripeProduct.default_price
        }),
        image,
        metadata
      }
    })
  )

  fs.writeFileSync(productsFile, JSON.stringify(products))
}

saveInventory()
  .then(() => {
    console.log('\n✅ Inventory has been saved properly.\n')
    process.exit(0)
  })
  .catch(error => {
    console.log(error)
    process.exit(1)
  })
