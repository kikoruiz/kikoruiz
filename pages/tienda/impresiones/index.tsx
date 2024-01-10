import Head from 'next/head'
import Link from 'next/link'
import Script from 'next/script'
import useTranslation from 'next-translate/useTranslation'
import {Alternate} from 'types'
import {fromLocalesToAlternates} from 'lib/mappers'
import {getPrints} from 'lib/store/prints'
import {getSlug, themeScreens} from 'lib/utils'
import {Print} from 'types/store'
import Image from 'components/image'
import Button from 'components/button'
import IconArrowLeft from 'assets/icons/arrow-left.svg'
import Logo from 'assets/brand/photo-logo.svg'

interface PrintsPageProps {
  alternates: Alternate[]
  prints: Print[]
}

export default function PrintsPage({alternates, prints}: PrintsPageProps) {
  const {sm, lg} = themeScreens
  const {t} = useTranslation()
  const title = t('store.categories.prints.name')
  const sectionSlug = getSlug(t('common:sections.store.name'))
  const backButtonHref = `/${sectionSlug}`
  const backButtonTitle = 'Back to Store'

  return (
    <>
      <Head>
        <title>{`Kiko Ruiz / ${title}`}</title>
        <meta name="description" content={t('sections.store.description')} />
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <Script
        id="snipcart-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.SnipcartSettings = {
            publicApiKey: "${process.env.NEXT_PUBLIC_SNIPCART_API_KEY}",
            loadStrategy: "on-user-interaction",
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
            className="bg-gradient-to-t to-neutral-900 bg-clip-text text-6xl font-black leading-tight text-transparent drop-shadow sm:text-8xl sm:leading-tight from-neutral-300/60"
            title={title}
          >
            {title}
          </h1>
        </div>

        <div className="relative mt-6 pt-3 after:absolute after:left-0 after:top-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:via-neutral-600">
          <Link
            href={backButtonHref}
            title={backButtonTitle}
            className="inline-flex items-center text-xs font-light text-neutral-300/30 hover:text-neutral-300/90 sm:text-sm"
          >
            <IconArrowLeft className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            {backButtonTitle}
          </Link>
        </div>
      </header>
      <section className="px-6">
        <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3 xl:gap-12 xl:space-y-12">
          {prints.map(({id, name, url, price, image, aspectRatio}) => {
            const {css, src} = image

            return (
              <div
                key={id}
                className="group p-3 bg-white/10 hover:bg-white/15 rounded break-inside-avoid-column"
              >
                <div className="relative bg-gradient-to-bl from-neutral-600 via-neutral-200 to-neutral-400 p-[10%] drop-shadow-md group-hover:from-neutral-100 group-hover:to-neutral-100 group-hover:drop-shadow-xl">
                  <Image
                    src={src}
                    url={url}
                    alt={name}
                    aspectRatio={aspectRatio}
                    sizes={`(min-width: ${lg}) 33vw, (min-width: ${sm}) 50vw, 100vw`}
                    fallbackStyle={css}
                  />

                  <Logo className="absolute left-[calc(10%+1em)] bottom-[calc(10%)] w-9 fill-white/80" />
                </div>

                <div className="flex items-center justify-between mt-3 py-1.5 pl-1.5">
                  <span className="font-black text-xl group-hover:text-neutral-100 drop-shadow">
                    {t('store:price', {count: price})}
                  </span>

                  <Button
                    intent="accent"
                    className="snipcart-add-item"
                    data-item-id={id}
                    data-item-name={name}
                    data-item-price={price}
                    data-item-url={url}
                    data-item-image={src}
                  >
                    Add to cart
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}

export async function getStaticProps({locale, locales, defaultLocale}) {
  const section = 'store'
  const subSection = 'prints'
  const alternates = await Promise.all(
    locales.map(
      await fromLocalesToAlternates({
        defaultLocale,
        section,
        subSection
      })
    )
  )
  const prints = await getPrints({locale})

  return {
    props: {section, subSection, alternates, prints}
  }
}
