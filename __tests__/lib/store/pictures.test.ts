import {describe, it, expect} from 'vitest'
import {PICTURES_NOT_FOR_SALE} from 'config/store'
import {getDownloadId} from 'lib/store/downloads'
import {fitsPrintSheet, isForSale} from 'lib/utils/pictures'

describe('store rules', () => {
  // Tests for `fitsPrintSheet`.

  it('fits a print sheet with a classic 3:2 frame', () => {
    expect(fitsPrintSheet('6000x4000')).toBe(true)
  })

  it('fits a print sheet regardless of the orientation', () => {
    expect(fitsPrintSheet('4000x6000')).toBe(true)
  })

  it('fits a print sheet with a frame that is exactly the sheet one', () => {
    expect(fitsPrintSheet('2970x2100')).toBe(true)
  })

  it('does not fit a print sheet with a square picture', () => {
    expect(fitsPrintSheet('5000x5000')).toBe(false)
  })

  it('does not fit a print sheet with an ultrawide panorama', () => {
    expect(fitsPrintSheet('17005x7288')).toBe(false)
  })

  // Tests for `isForSale`.

  it('puts a picture for sale by default', () => {
    expect(isForSale('2000-01-01_0000')).toBe(true)
  })

  it('keeps a listed picture off sale', () => {
    expect(isForSale(PICTURES_NOT_FOR_SALE[0])).toBe(false)
  })

  // Tests for `getDownloadId`.

  it('gets the id of a download from its picture and tier', () => {
    expect(getDownloadId({pictureId: '2017-12-22_0034', tier: 'web'})).toBe(
      'download_2017-12-22_0034_web'
    )
  })
})
