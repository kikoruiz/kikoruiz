import {useEffect} from 'react'
import Script from 'next/script'
import {useRouter} from 'next/router'
import {trackPage, GA_TRACKING_ID} from 'lib/tracking'
import {useCookieConsentContext} from '@use-cookie-consent/react'

function handleRouteChangeComplete(canDoTrack: boolean) {
  return function (url: string) {
    if (canDoTrack) trackPage(url)
  }
}

export default function ThirdPartyScripts() {
  const router = useRouter()
  const {consent} = useCookieConsentContext()
  const hasThirdPartyConsent = Boolean(consent.thirdParty)

  useEffect(() => {
    trackPage(router.asPath)
  }, [router.asPath])

  useEffect(() => {
    router.events.on(
      'routeChangeComplete',
      handleRouteChangeComplete(hasThirdPartyConsent)
    )

    return function () {
      router.events.off(
        'routeChangeComplete',
        handleRouteChangeComplete(hasThirdPartyConsent)
      )
    }
  }, [router.events, hasThirdPartyConsent])

  return hasThirdPartyConsent ? (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname
          });
        `
        }}
      />
    </>
  ) : null
}
