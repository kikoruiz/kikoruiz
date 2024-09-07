interface PurchaseItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface GTagEvent {
  action: string
  category?: string
  label?: string
  value?: number
  currency?: string
  items?: PurchaseItem[]
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID

export function trackPage(url: string) {
  if (window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url
    })
  }
}

export function trackEvent({
  action,
  category,
  label,
  value,
  currency,
  items
}: GTagEvent) {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
      currency,
      items
    })
  }
}
