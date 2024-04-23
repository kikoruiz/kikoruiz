import type {NextApiRequest, NextApiResponse} from 'next'
import getT from 'next-translate/getT'
import i18n from 'i18n'
import Stripe from 'stripe'
import {validateCartItems} from 'use-shopping-cart/utilities'
import {getSlug} from 'lib/utils'
import inventory from 'data/store/products.json'

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
      const {referer} = req.headers
      const storePath = getSlug(t('sections.store.name'))
      const [baseUrl] = referer.split(storePath)
      const [refererBaseUrl] = referer.split('?')
      const items = JSON.parse(req.body)
      const lineItems = validateCartItems(inventory, items)
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card', 'link'],
        billing_address_collection: 'auto',
        shipping_address_collection: {
          allowed_countries: ['ES']
        },
        success_url: `${baseUrl}${storePath}?checkout=success`,
        cancel_url: `${refererBaseUrl}?checkout=cancel`,
        line_items: lineItems,
        automatic_tax: {enabled: true}
      })

      res.status(200).json(session)
    } catch (error) {
      res.status(error.statusCode || 500).json(error.message)
    }
  }
}
