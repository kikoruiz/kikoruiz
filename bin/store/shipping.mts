#!/usr/bin/env node
import Stripe from 'stripe'
import {ISLANDS_SHIPPING} from 'config/store'

const SHIPPING_TAX_CODE = 'txcd_92010001'
const RATES = [
  {
    key: 'peninsula',
    env: 'STRIPE_SHIPPING_RATE_ID',
    name: 'Envío a Península y Baleares (incluido)',
    amount: 0
  },
  {
    key: 'islands',
    env: 'STRIPE_SHIPPING_RATE_ISLANDS_ID',
    name: 'Envío a Canarias, Ceuta y Melilla',
    amount: Math.round(ISLANDS_SHIPPING.surcharge * 100)
  }
]

const apiKey = process.env.STRIPE_SECRET_KEY
const isDryRun = process.argv.includes('--dry-run')
const isLive = apiKey?.startsWith('sk_live')

// A shipping rate cannot change its amount once made, so a rate whose amount
// no longer matches the config is replaced by a new one and archived.
async function saveShippingRates() {
  if (!apiKey) throw new Error('There is no STRIPE_SECRET_KEY to work with.')

  if (isLive && !process.argv.includes('--live')) {
    throw new Error(
      'This key is a live one. Run it with --live if the live shop is what you want to change, or use a test key.'
    )
  }

  const stripe = new Stripe(apiKey)
  const existing = await stripe.shippingRates
    .list({active: true, limit: 100})
    .autoPagingToArray({limit: 1000})

  console.log(
    `\nStripe mode: ${isLive ? 'LIVE' : 'test'}${isDryRun ? ' (dry run)' : ''}\n`
  )

  for (const {key, env, name, amount} of RATES) {
    const current = existing.filter(rate => rate.metadata.kikoruiz_rate === key)
    const reusable = current.find(rate => rate.fixed_amount?.amount === amount)
    let id = reusable?.id

    if (reusable) {
      console.log(`${key}: already there (${id}, ${amount / 100} EUR)`)
    } else if (isDryRun) {
      console.log(`${key}: would create "${name}" at ${amount / 100} EUR`)
    } else {
      const created = await stripe.shippingRates.create({
        display_name: name,
        type: 'fixed_amount',
        fixed_amount: {amount, currency: 'eur'},
        tax_behavior: 'inclusive',
        tax_code: SHIPPING_TAX_CODE,
        metadata: {kikoruiz_rate: key}
      })

      id = created.id
      console.log(`${key}: created ${id} ("${name}", ${amount / 100} EUR)`)

      for (const old of current) {
        await stripe.shippingRates.update(old.id, {active: false})
        console.log(`${key}: archived the old one ${old.id}`)
      }
    }

    if (id) console.log(`   ${env}=${id}`)
  }

  console.log('\nPut those ids in the environment of the site and deploy it.\n')
}

saveShippingRates()
  .then(() => process.exit(0))
  .catch(error => {
    console.log(error.message)
    process.exit(1)
  })
