import {useEffect} from 'react'
import Script from 'next/script'
import {useRouter} from 'next/router'
import {trackPage, GA_TRACKING_ID} from 'lib/tracking'
import {useCookieConsentContext} from '@use-cookie-consent/react'

export default function ThirdPartyScripts() {
  const router = useRouter()
  const {consent} = useCookieConsentContext()
  const hasThirdPartyConsent = Boolean(consent.thirdParty)

  // `asPath` changes on every navigation, shallow ones included, so this alone
  // covers them. The first page view comes from the init script below.
  useEffect(() => {
    if (hasThirdPartyConsent) trackPage(router.asPath)
  }, [router.asPath, hasThirdPartyConsent])

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

ThirdPartyScripts.displayName = 'ThirdPartyScripts'
