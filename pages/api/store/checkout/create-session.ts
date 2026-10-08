import type {NextApiRequest, NextApiResponse} from 'next'
import getT from 'next-translate/getT'
import i18n from 'i18n'
import Stripe from 'stripe'
import {formatLineItems} from 'use-shopping-cart/utilities'
import {getSlug} from 'lib/utils'
import {DOWNLOAD_TYPE} from 'config/store'

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
      const lineItems = formatLineItems(items)
      // `use-shopping-cart` merges the product metadata into `product_data`, so
      // every entry carries the variant id the inventory scripts gave Stripe as
      // a lookup key, and its prefix is what tells a file from a print.
      const variantIds = Object.values(items).map(
        ({product_data: {id}}: {product_data: {id: string}}) => id
      )
      const hasDownloads = variantIds.some(id =>
        id.startsWith(`${DOWNLOAD_TYPE}_`)
      )
      const needsShipping = variantIds.some(
        id => !id.startsWith(`${DOWNLOAD_TYPE}_`)
      )
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card', 'link'],
        // Nothing to ship means nothing to ask for, but the VAT of a file
        // depends on where the buyer is, so the billing address stops being
        // optional.
        billing_address_collection: needsShipping ? 'auto' : 'required',
        ...(needsShipping && {
          shipping_address_collection: {allowed_countries: ['ES']}
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
        metadata: {locale, hasDownloads: `${hasDownloads}`}
      })

      res.status(200).json(session)
    } catch (error) {
      res.status(error.statusCode || 500).json(error.message)
    }
  }
}
