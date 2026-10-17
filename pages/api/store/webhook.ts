import type {NextApiRequest, NextApiResponse} from 'next'
import Stripe from 'stripe'
import i18n from 'i18n'
import {sendDownloadsEmail, sendShippingAlert} from 'lib/store/email'
import {getShippingMismatch} from 'lib/store/shipping'

global.i18nConfig = i18n

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Stripe signs the exact bytes it sent, so the body has to reach us unparsed
// or the signature can never match.
export const config = {api: {bodyParser: false}}

function getRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []

    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end()

  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (!secret) {
    console.error('There is no STRIPE_WEBHOOK_SECRET to verify against.')

    return res.status(500).json({received: false})
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      await getRawBody(req),
      req.headers['stripe-signature'],
      secret
    )
  } catch (error) {
    // An unverified payload is indistinguishable from an attacker's, so it
    // never gets read.
    console.error('Webhook signature verification failed.', error.message)

    return res.status(400).json({received: false})
  }

  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({received: true})
  }

  const session = event.data.object as Stripe.Checkout.Session
  const {locale, hasDownloads} = session.metadata ?? {}
  const to = session.customer_details?.email
  const shippingRate = session.shipping_cost?.shipping_rate
  const postalCode = (
    session.collected_information?.shipping_details ?? session.customer_details
  )?.address?.postal_code
  const mismatch = getShippingMismatch({
    postalCode,
    rateId: typeof shippingRate === 'string' ? shippingRate : shippingRate?.id,
    islandsRateId: process.env.STRIPE_SHIPPING_RATE_ISLANDS_ID
  })

  // A print is sent by hand, so whoever picked the wrong option can still be
  // told before it leaves. The payment is never put at risk by this.
  if (mismatch) {
    try {
      await sendShippingAlert({sessionId: session.id, postalCode, mismatch})
    } catch (error) {
      console.error('Could not send the shipping alert.', error)
    }
  }

  // Prints get an email from me by hand, so only files have anything to
  // deliver automatically. Anything already paid for stays reachable through
  // the order URL regardless, so a failed send is worth retrying but never
  // worth losing the payment over.
  if (hasDownloads !== 'true' || !to) {
    return res.status(200).json({received: true})
  }

  try {
    await sendDownloadsEmail({to, sessionId: session.id, locale})
  } catch (error) {
    console.error('Could not send the downloads email.', error)

    // A non-2xx tells Stripe to retry, which is what we want: the buyer has
    // paid and has no other way back to their files.
    return res.status(500).json({received: false})
  }

  res.status(200).json({received: true})
}
