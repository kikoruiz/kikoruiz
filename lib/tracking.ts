/// <reference types="@types/gtag.js" />

export interface TrackedItem {
  item_id: string
  item_name: string
  price: number
  quantity: number
}

interface CartLine {
  name: string
  price: number
  quantity: number
  product_data?: unknown
}

type EventParams = Record<string, string | number | boolean | TrackedItem[]>

const PURCHASE_KEY_PREFIX = 'ga_purchase_'

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID

// gtag.js only reads `arguments` objects off the data layer, never arrays, so
// this cannot be written with a rest parameter.
function gtag(...args: unknown[]): void
function gtag() {
  const dataLayer = ((
    window as unknown as {dataLayer?: IArguments[]}
  ).dataLayer ??= [])

  dataLayer.push(arguments)
}

let isInitialized = false

// Consent has to be declared before the first config, and everything starts
// denied. Google then only gets cookieless pings until the visitor agrees.
export function initAnalytics() {
  if (!GA_TRACKING_ID || isInitialized) return

  isInitialized = true
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied'
  })
  gtag('js', new Date())
  gtag('config', GA_TRACKING_ID, {send_page_view: false})
}

export function updateConsent(isGranted: boolean) {
  if (!GA_TRACKING_ID) return

  gtag('consent', 'update', {
    analytics_storage: isGranted ? 'granted' : 'denied'
  })
}

export function trackPage() {
  if (!GA_TRACKING_ID) return

  const url = new URL(window.location.href)

  // The session id is what unlocks the downloads of an order, so it must not
  // end up in the reports.
  url.searchParams.delete('session_id')
  gtag('event', 'page_view', {page_location: url.href})
}

export function trackEvent(action: string, params?: EventParams) {
  if (!GA_TRACKING_ID) return

  gtag('event', action, params)
}

export function getCartItems(
  cartDetails: Record<string, CartLine>
): TrackedItem[] {
  return Object.values(cartDetails).map(
    ({name, price, quantity, product_data: productData}) => ({
      item_id: (productData as {id: string}).id,
      item_name: name,
      price,
      quantity
    })
  )
}

export async function trackPurchase(sessionId: string) {
  const key = `${PURCHASE_KEY_PREFIX}${sessionId}`

  // The success page can be reloaded or revisited from the download links, and
  // an order must be counted once.
  if (window.localStorage.getItem(key)) return

  window.localStorage.setItem(key, '1')

  try {
    const response = await fetch(`/api/store/purchase?session_id=${sessionId}`)

    if (!response.ok) throw new Error('The purchase could not be read.')

    trackEvent('purchase', await response.json())
  } catch (error) {
    window.localStorage.removeItem(key)
    console.error(error)
  }
}
