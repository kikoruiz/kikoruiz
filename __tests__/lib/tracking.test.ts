import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

type Tracking = typeof import('lib/tracking')

async function loadTracking(trackingId = 'G-TEST'): Promise<Tracking> {
  vi.resetModules()
  vi.stubEnv('NEXT_PUBLIC_GA_TRACKING_ID', trackingId)

  return import('lib/tracking')
}

function getCommands() {
  return (window as unknown as {dataLayer: IArguments[]}).dataLayer.map(
    command => Array.from(command)
  )
}

describe('tracking', () => {
  beforeEach(() => {
    delete (window as unknown as {dataLayer?: unknown}).dataLayer
    window.localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  describe('initAnalytics', () => {
    it('denies everything before the first config', async () => {
      const {initAnalytics} = await loadTracking()

      initAnalytics()

      const commands = getCommands()

      expect(commands[0]).toEqual([
        'consent',
        'default',
        {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied'
        }
      ])
      expect(commands[1][0]).toBe('js')
      expect(commands[2]).toEqual(['config', 'G-TEST', {send_page_view: false}])
    })

    it('pushes arguments objects, which is all gtag.js reads', async () => {
      const {initAnalytics} = await loadTracking()

      initAnalytics()

      const [command] = (window as unknown as {dataLayer: unknown[]}).dataLayer

      expect(Array.isArray(command)).toBe(false)
      expect(Object.prototype.toString.call(command)).toBe('[object Arguments]')
    })

    it('only initializes once', async () => {
      const {initAnalytics} = await loadTracking()

      initAnalytics()
      initAnalytics()

      expect(getCommands()).toHaveLength(3)
    })

    it('does nothing without a tracking id', async () => {
      const {initAnalytics} = await loadTracking('')

      initAnalytics()

      expect((window as unknown as {dataLayer?: unknown}).dataLayer).toBe(
        undefined
      )
    })
  })

  describe('updateConsent', () => {
    it('grants only analytics storage', async () => {
      const {updateConsent} = await loadTracking()

      updateConsent(true)

      expect(getCommands()).toEqual([
        ['consent', 'update', {analytics_storage: 'granted'}]
      ])
    })

    it('denies analytics storage when consent is withdrawn', async () => {
      const {updateConsent} = await loadTracking()

      updateConsent(false)

      expect(getCommands()).toEqual([
        ['consent', 'update', {analytics_storage: 'denied'}]
      ])
    })
  })

  describe('trackPage', () => {
    it('sends a page view with the current location', async () => {
      const {trackPage} = await loadTracking()

      window.history.replaceState({}, '', '/galeria?tag=sea')
      trackPage()

      expect(getCommands()).toEqual([
        [
          'event',
          'page_view',
          {page_location: `${window.location.origin}/galeria?tag=sea`}
        ]
      ])
    })

    it('keeps the session id out of the reports', async () => {
      const {trackPage} = await loadTracking()

      window.history.replaceState(
        {},
        '',
        '/tienda?checkout=success&session_id=cs_live_secret'
      )
      trackPage()

      const [[, , {page_location: location}]] = getCommands()

      expect(location).toBe(`${window.location.origin}/tienda?checkout=success`)
      expect(location).not.toContain('cs_live_secret')
    })
  })

  describe('trackEvent', () => {
    it('sends the event with its params', async () => {
      const {trackEvent} = await loadTracking()

      trackEvent('show_map', {picture_name: 'Sea'})

      expect(getCommands()).toEqual([
        ['event', 'show_map', {picture_name: 'Sea'}]
      ])
    })

    it('sends nothing without a tracking id', async () => {
      const {trackEvent} = await loadTracking('')

      trackEvent('show_map')

      expect((window as unknown as {dataLayer?: unknown}).dataLayer).toBe(
        undefined
      )
    })
  })

  describe('getCartItems', () => {
    it('maps the cart to GA4 items', async () => {
      const {getCartItems} = await loadTracking()

      expect(
        getCartItems({
          price_1: {
            name: 'Sea · 30x45',
            price: 90,
            quantity: 2,
            product_data: {id: 'print_sea_30x45'}
          },
          price_2: {
            name: 'Rocks · web',
            price: 12,
            quantity: 1,
            product_data: {id: 'download_rocks_web'}
          }
        })
      ).toEqual([
        {
          item_id: 'print_sea_30x45',
          item_name: 'Sea · 30x45',
          price: 90,
          quantity: 2
        },
        {
          item_id: 'download_rocks_web',
          item_name: 'Rocks · web',
          price: 12,
          quantity: 1
        }
      ])
    })
  })

  describe('trackPurchase', () => {
    const purchase = {
      transaction_id: 'cs_1',
      currency: 'EUR',
      value: 90,
      tax: 0,
      shipping: 5,
      items: []
    }

    it('sends the purchase read from the order', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => purchase
      })
      vi.stubGlobal('fetch', fetchMock)
      const {trackPurchase} = await loadTracking()

      await trackPurchase('cs_1')

      expect(fetchMock).toHaveBeenCalledWith(
        '/api/store/purchase?session_id=cs_1'
      )
      expect(getCommands()).toEqual([['event', 'purchase', purchase]])
    })

    it('counts an order once, even if the page is revisited', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => purchase
      })
      vi.stubGlobal('fetch', fetchMock)
      const {trackPurchase} = await loadTracking()

      await trackPurchase('cs_1')
      await trackPurchase('cs_1')

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(getCommands()).toHaveLength(1)
    })

    it('does not count an order twice when called at the same time', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => purchase
      })
      vi.stubGlobal('fetch', fetchMock)
      const {trackPurchase} = await loadTracking()

      await Promise.all([trackPurchase('cs_1'), trackPurchase('cs_1')])

      expect(getCommands()).toHaveLength(1)
    })

    it('tracks different orders separately', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({ok: true, json: async () => purchase})
      )
      const {trackPurchase} = await loadTracking()

      await trackPurchase('cs_1')
      await trackPurchase('cs_2')

      expect(getCommands()).toHaveLength(2)
    })

    it('tries again later when the order cannot be read', async () => {
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce({ok: false})
        .mockResolvedValueOnce({ok: true, json: async () => purchase})
      vi.stubGlobal('fetch', fetchMock)
      const {trackPurchase} = await loadTracking()

      await trackPurchase('cs_1')

      expect((window as unknown as {dataLayer?: unknown}).dataLayer).toBe(
        undefined
      )

      await trackPurchase('cs_1')

      expect(getCommands()).toEqual([['event', 'purchase', purchase]])
      consoleError.mockRestore()
    })
  })
})
