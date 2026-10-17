import type {NextApiRequest, NextApiResponse} from 'next'
import getT from 'next-translate/getT'
import i18n from 'i18n'
import Stripe from 'stripe'
import {getSlug} from 'lib/utils'
import {DOWNLOAD_TYPE, SIGNED_SUFFIX} from 'config/store'

interface CartItem {
  quantity: number
  product_data: {id: string}
}

global.i18nConfig = i18n

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const {locale} = req.query as {locale: string}
      const t = await getT(locale, 'common')
      const tStore = await getT(locale, 'store')
      const {referer} = req.headers
      const storePath = getSlug(t('sections.store.name'))
      const [baseUrl] = referer.split(`/${storePath}`)
      const [refererBaseUrl] = referer.split('?')
      const items = JSON.parse(req.body)
      // `use-shopping-cart` merges the product metadata into `product_data`, so
      // every entry carries the variant id the inventory scripts gave Stripe as
      // a lookup key, and its prefix is what tells a file from a print.
      const variantIds = Object.values(items).map(
        ({product_data: {id}}: {product_data: {id: string}}) => id
      )
      // A signed and an unsigned line of the same print are one Stripe price,
      // so they are bought together and the signature travels in the metadata
      // instead. Prints get signed by hand, and a metadata value cannot hold a
      // list that grows with the cart, hence one key per signed line.
      const quantities = new Map<string, number>()
      const signedPrints: Record<string, string> = {}

      Object.entries(items).forEach(([key, item]: [string, CartItem]) => {
        const price = key.replace(SIGNED_SUFFIX, '')

        quantities.set(price, (quantities.get(price) ?? 0) + item.quantity)

        if (key.endsWith(SIGNED_SUFFIX)) {
          signedPrints[`signed_${Object.keys(signedPrints).length + 1}`] =
            `${item.product_data.id} x${item.quantity}`
        }
      })
      const lineItems = [...quantities].map(([price, quantity]) => ({
        price,
        quantity
      }))
      const hasDownloads = variantIds.some(id =>
        id.startsWith(`${DOWNLOAD_TYPE}_`)
      )
      const needsShipping = variantIds.some(
        id => !id.startsWith(`${DOWNLOAD_TYPE}_`)
      )
      // The shipping is inside the price of a print, so the first rate is free
      // and the second one is the surcharge of the islands. Checkout shows
      // both and the buyer picks the one of their address; the webhook says if
      // it was not the right one.
      const shippingRates = [
        process.env.STRIPE_SHIPPING_RATE_ID,
        process.env.STRIPE_SHIPPING_RATE_ISLANDS_ID
      ].filter(Boolean)
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card', 'link'],
        // Nothing to ship means nothing to ask for, but the VAT of a file
        // depends on where the buyer is, so the billing address stops being
        // optional.
        billing_address_collection: needsShipping ? 'auto' : 'required',
        // The fee is a Stripe shipping rate made once in the dashboard, since
        // an amount written here would have to be deployed to be changed. Until
        // its id is set, the order carries no shipping charge.
        ...(needsShipping && {
          shipping_address_collection: {allowed_countries: ['ES']},
          ...(shippingRates.length > 0 && {
            shipping_options: shippingRates.map(shipping_rate => ({
              shipping_rate
            }))
          })
        }),
        // Instant delivery kills the right of withdrawal, and that has to be
        // said before paying, not in the receipt.
        ...(hasDownloads && {
          custom_text: {submit: {message: tStore('downloads.waiver')}}
        }),
        // The session id is what the success page exchanges for the signed
        // links of whatever files the order contains.
        success_url: `${baseUrl}/${storePath}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${refererBaseUrl}?checkout=cancel`,
        line_items: lineItems,
        automatic_tax: {enabled: true},
        metadata: {locale, hasDownloads: `${hasDownloads}`, ...signedPrints},
        payment_intent_data: {metadata: signedPrints}
      })

      res.status(200).json(session)
    } catch (error) {
      res.status(error.statusCode || 500).json(error.message)
    }
  }
}
