import {PropsWithChildren} from 'react'
import {useRouter} from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import Alert from './alert'
import ShoppingCartModal from './shopping-cart-modal'
import {getSlug} from 'lib/utils'
import IconArrowLeft from 'assets/icons/arrow-left.svg'
import IconCheckCircle from 'assets/icons/check-circle.svg'
import IconXCircle from 'assets/icons/x-circle.svg'
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
  const {
    query: {checkout}
  } = useRouter()
  const sectionSlug = getSlug(t('sections.store.name'))
  const backButtonHref = `/${sectionSlug}`
  const backButtonTitle = t('store:back-to-store')
  const comesFromCheckout = Boolean(checkout)
  const alertConfig = {
    success: {icon: IconCheckCircle, status: 'success'},
    cancel: {icon: IconXCircle, status: 'error'}
  }

  return (
    <>
      <Head>
        <title>{`Kiko Ruiz / ${title}`}</title>
        <meta name="description" content={description} />
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      {comesFromCheckout && (
        <Alert
          title="¡La compra se ha realizado con éxito!"
          message="Revisa la bandeja de tu correo electrónico para conocer el estado de tu pedido."
          icon={alertConfig[checkout]?.icon}
          status={alertConfig[checkout]?.status}
          className="mx-6 mt-6 sm:mt-0 mb-9"
        />
      )}

      <header className="mt-9 px-6 text-center sm:-mt-3 mb-12 sm:mb-16">
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
