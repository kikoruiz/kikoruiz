import {useEffect} from 'react'
import Script from 'next/script'
import {useRouter} from 'next/router'
import {
  trackPage,
  initAnalytics,
  updateConsent,
  GA_TRACKING_ID
} from 'lib/tracking'
import {useCookieConsentContext} from '@use-cookie-consent/react'

export default function ThirdPartyScripts() {
  const router = useRouter()
  const {consent} = useCookieConsentContext()
  const hasThirdPartyConsent = Boolean(consent.thirdParty)

  // These effects run in this order on mount, which is what keeps the consent
  // default ahead of the update and both of them ahead of the first page view.
  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    updateConsent(hasThirdPartyConsent)
  }, [hasThirdPartyConsent])

  // `asPath` changes on every navigation, shallow ones included, so this alone
  // covers them, and the first page view too since the config sends none.
  useEffect(() => {
    trackPage()
  }, [router.asPath])

  return GA_TRACKING_ID ? (
    <Script
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
    />
  ) : null
}

ThirdPartyScripts.displayName = 'ThirdPartyScripts'
