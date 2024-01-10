import Head from 'next/head'
import Link from 'next/link'
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
                  <span className="font-black text-xl group-hover:text-neutral-100">
                    {t('store:price', {count: price})}
                  </span>

                  <Button intent="accent">Add to cart</Button>
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
