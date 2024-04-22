import type {NextApiRequest, NextApiResponse} from 'next'
import Stripe from 'stripe'
import {validateCartItems} from 'use-shopping-cart/utilities'
import inventory from 'data/store/products.json'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const items = JSON.parse(req.body)
      const lineItems = validateCartItems(inventory, items)
      const origin = process.env.ORIGIN ?? 'https://www.kikoruiz.es'
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card', 'link'],
        billing_address_collection: 'auto',
        shipping_address_collection: {
          allowed_countries: ['ES']
        },
        success_url: `${origin}/checkout/success`,
        cancel_url: `${origin}/checkout/error`,
        line_items: lineItems,
        automatic_tax: {enabled: true}
      })

      res.status(200).json(session)
    } catch (error) {
      res.status(error.statusCode || 500).json(error.message)
    }
  }
}
