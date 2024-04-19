import {PropsWithChildren} from 'react'
import Head from 'next/head'
// import Script from 'next/script'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import ShoppingCartModal from './shopping-cart-modal'
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

      <ShoppingCartModal />
    </>
  )
}
