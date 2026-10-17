import {ISLANDS_SHIPPING} from 'config/store'

export function isIslandsPostalCode(postalCode?: string | null) {
  return ISLANDS_SHIPPING.postalCodePrefixes.some(prefix =>
    postalCode?.trim().startsWith(prefix)
  )
}

// Checkout lets the buyer pick the shipping option, and nothing stops them
// from picking the one that does not match the address they typed. This says
// which way it went wrong, if it did.
export function getShippingMismatch({
  postalCode,
  rateId,
  islandsRateId
}: {
  postalCode?: string | null
  rateId?: string | null
  islandsRateId?: string
}) {
  if (!postalCode || !rateId || !islandsRateId) return undefined

  const isIslands = isIslandsPostalCode(postalCode)
  const paidIslands = rateId === islandsRateId

  if (isIslands && !paidIslands) return 'missing-surcharge'
  if (!isIslands && paidIslands) return 'unneeded-surcharge'

  return undefined
}
