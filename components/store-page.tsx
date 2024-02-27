import {PropsWithChildren} from 'react'
import Head from 'next/head'
import Script from 'next/script'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import {getSlug} from 'lib/utils'
import IconArrowLeft from 'assets/icons/arrow-left.svg'
import {Alternate} from 'types'

interface StorePageProps extends PropsWithChildren {
  title: string
  description: string
  alternates: Alternate[]
  isIndex?: boolean
}

export default function StorePage({
  title,
  description,
  alternates,
  isIndex = false,
  children
}: StorePageProps) {
  const {t} = useTranslation()
  const sectionSlug = getSlug(t('sections.store.name'))
  const backButtonHref = `/${sectionSlug}`
  const backButtonTitle = t('store:back-to-store')

  return (
    <>
      <Head>
        <title>{`Kiko Ruiz / ${title}`}</title>
        <meta name="description" content={description} />
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <Script
        id="snipcart-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.SnipcartSettings = window.SnipcartSettings || {
  publicApiKey: "${process.env.NEXT_PUBLIC_SNIPCART_API_KEY}",
  version: "3.7.1",
  modalStyle: "side"
};

(function(){var c,d;(d=(c=window.SnipcartSettings).version)!=null||(c.version="3.0");var s,S;(S=(s=window.SnipcartSettings).timeoutDuration)!=null||(s.timeoutDuration=2750);var l,p;(p=(l=window.SnipcartSettings).domain)!=null||(l.domain="cdn.snipcart.com");var w,u;(u=(w=window.SnipcartSettings).protocol)!=null||(w.protocol="https");var m,g;(g=(m=window.SnipcartSettings).loadCSS)!=null||(m.loadCSS=!0);var y=window.SnipcartSettings.version.includes("v3.0.0-ci")||window.SnipcartSettings.version!="3.0"&&window.SnipcartSettings.version.localeCompare("3.4.0",void 0,{numeric:!0,sensitivity:"base"})===-1,f=["focus","mouseover","touchmove","scroll","keydown"];window.LoadSnipcart=o;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",r):r();function r(){window.SnipcartSettings.loadStrategy?window.SnipcartSettings.loadStrategy==="on-user-interaction"&&(f.forEach(function(t){return document.addEventListener(t,o)}),setTimeout(o,window.SnipcartSettings.timeoutDuration)):o()}var a=!1;function o(){if(a)return;a=!0;let t=document.getElementsByTagName("head")[0],n=document.querySelector("#snipcart"),i=document.querySelector('src[src^="'.concat(window.SnipcartSettings.protocol,"://").concat(window.SnipcartSettings.domain,'"][src$="snipcart.js"]')),e=document.querySelector('link[href^="'.concat(window.SnipcartSettings.protocol,"://").concat(window.SnipcartSettings.domain,'"][href$="snipcart.css"]'));n||(n=document.createElement("div"),n.id="snipcart",n.setAttribute("hidden","true"),document.body.appendChild(n)),h(n),i||(i=document.createElement("script"),i.src="".concat(window.SnipcartSettings.protocol,"://").concat(window.SnipcartSettings.domain,"/themes/v").concat(window.SnipcartSettings.version,"/default/snipcart.js"),i.async=!0,t.appendChild(i)),!e&&window.SnipcartSettings.loadCSS&&(e=document.createElement("link"),e.rel="stylesheet",e.type="text/css",e.href="".concat(window.SnipcartSettings.protocol,"://").concat(window.SnipcartSettings.domain,"/themes/v").concat(window.SnipcartSettings.version,"/default/snipcart.css"),t.prepend(e)),f.forEach(function(v){return document.removeEventListener(v,o)})}function h(t){!y||(t.dataset.apiKey=window.SnipcartSettings.publicApiKey,window.SnipcartSettings.addProductBehavior&&(t.dataset.configAddProductBehavior=window.SnipcartSettings.addProductBehavior),window.SnipcartSettings.modalStyle&&(t.dataset.configModalStyle=window.SnipcartSettings.modalStyle),window.SnipcartSettings.currency&&(t.dataset.currency=window.SnipcartSettings.currency),window.SnipcartSettings.templatesUrl&&(t.dataset.templatesUrl=window.SnipcartSettings.templatesUrl))}})();
    `
        }}
      />

      <header className="mt-9 px-6 text-center sm:-mt-3 mb-9 sm:mb-12">
        <div className="flex flex-col items-center justify-center gap-y-3 sm:flex-row">
          <h1
            className={`bg-gradient-to-t to-neutral-900 bg-clip-text text-6xl font-black leading-tight text-transparent drop-shadow sm:text-8xl sm:leading-tight ${
              isIndex ? 'from-orange-300' : 'from-neutral-300/60'
            }`}
            title={title}
          >
            {title}
          </h1>
        </div>

        <div
          className={`relative after:absolute after:left-0 after:block after:w-full after:h-[1px] after:bg-gradient-to-r after:from-transparent ${
            isIndex
              ? 'pb-6 after:bottom-[-1px] after:via-orange-300/60'
              : 'pt-3 mt-6 after:top-0 after:via-neutral-600'
          }`}
        >
          {isIndex ? (
            <p className="mt-3 font-light text-neutral-300/60">
              {t('sections.store.description')}
            </p>
          ) : (
            <Link
              href={backButtonHref}
              title={backButtonTitle}
              className="inline-flex items-center text-xs font-light text-neutral-300/30 hover:text-neutral-300/90 sm:text-sm"
            >
              <IconArrowLeft className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              {backButtonTitle}
            </Link>
          )}
        </div>
      </header>

      {children}
    </>
  )
}
