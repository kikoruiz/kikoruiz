import {describe, it, expect} from 'vitest'
import {getShippingMismatch, isIslandsPostalCode} from 'lib/store/shipping'

const islandsRateId = 'shr_islands'

describe('shipping lib', () => {
  // Tests for `isIslandsPostalCode`.

  it.each(['35001', '38001', '51001', '52001'])(
    'knows %s is not in the peninsula',
    postalCode => {
      expect(isIslandsPostalCode(postalCode)).toBe(true)
    }
  )

  it.each(['28001', '08001', '07001', '03001', '03501'])(
    'knows %s is in the peninsula or the Balearic Islands',
    postalCode => {
      expect(isIslandsPostalCode(postalCode)).toBe(false)
    }
  )

  it('reads a postal code with spaces around it', () => {
    expect(isIslandsPostalCode(' 35001 ')).toBe(true)
  })

  // Tests for `getShippingMismatch`.

  it('says an order to the islands without the surcharge is missing it', () => {
    expect(
      getShippingMismatch({
        postalCode: '35001',
        rateId: 'shr_free',
        islandsRateId
      })
    ).toBe('missing-surcharge')
  })

  it('says an order to the peninsula with the surcharge did not need it', () => {
    expect(
      getShippingMismatch({
        postalCode: '28001',
        rateId: islandsRateId,
        islandsRateId
      })
    ).toBe('unneeded-surcharge')
  })

  it('finds nothing wrong with an order that picked the right option', () => {
    expect(
      getShippingMismatch({
        postalCode: '35001',
        rateId: islandsRateId,
        islandsRateId
      })
    ).toBeUndefined()
    expect(
      getShippingMismatch({
        postalCode: '28001',
        rateId: 'shr_free',
        islandsRateId
      })
    ).toBeUndefined()
  })

  it('finds nothing to check without a surcharge rate or a postal code', () => {
    expect(
      getShippingMismatch({postalCode: '35001', rateId: 'shr_free'})
    ).toBeUndefined()
    expect(
      getShippingMismatch({rateId: 'shr_free', islandsRateId})
    ).toBeUndefined()
  })
})
