import type {NextApiRequest, NextApiResponse} from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const toUnits = (amount: number) => amount / 100

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') return res.status(405).end()

  const {session_id: sessionId} = req.query as {session_id: string}

  if (!sessionId) return res.status(400).json({message: 'Missing session.'})

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items.data.price']
    })

    if (session.payment_status !== 'paid') {
      return res.status(403).json({message: 'This order is not paid.'})
    }

    const {amount_subtotal, total_details} = session

    // GA4 takes the value without tax or shipping, which go in their own
    // fields.
    res.setHeader('Cache-Control', 'private, no-store')
    res.status(200).json({
      transaction_id: session.id,
      currency: session.currency.toUpperCase(),
      value: toUnits(amount_subtotal - total_details.amount_discount),
      tax: toUnits(total_details.amount_tax),
      shipping: toUnits(total_details.amount_shipping),
      items: session.line_items.data.map(({price, quantity}) => ({
        item_id: price.lookup_key,
        item_name: price.nickname,
        price: toUnits(price.unit_amount),
        quantity
      }))
    })
  } catch (error) {
    console.error(error)

    res
      .status(error.statusCode ?? 500)
      .json({message: 'This order cannot be read.'})
  }
}
