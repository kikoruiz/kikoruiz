import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import {Alternate} from 'types'
import {fromLocalesToAlternates} from 'lib/mappers'

interface StoreProps {
  alternates: Alternate[]
}

export default function Store({alternates}: StoreProps) {
  const {t} = useTranslation()
  const title = t('sections.store.name')

  return (
    <>
      <Head>
        <title>{`Kiko Ruiz / ${t('sections.store.name')}`}</title>
        <meta name="description" content={t('sections.store.description')} />
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <header className="mt-9 px-6 text-center sm:-mt-3 mb-9 sm:mb-12">
        <div className="flex flex-col items-center justify-center gap-y-3 sm:flex-row">
          <h1
            className="bg-gradient-to-t to-neutral-900 bg-clip-text text-6xl font-black leading-tight text-transparent drop-shadow sm:text-8xl sm:leading-tight from-orange-300"
            title={title}
          >
            {title}
          </h1>
        </div>
        <div className="relative after:absolute after:left-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent pb-6 after:bottom-[-1px] after:via-orange-300/60">
          <p className="mt-3 font-light text-neutral-300/60">
            {t('sections.store.description')}
          </p>
        </div>
      </header>
    </>
  )
}

export async function getStaticProps({locales, defaultLocale}) {
  const section = 'store'
  const alternates = await Promise.all(
    locales.map(await fromLocalesToAlternates({defaultLocale, section}))
  )

  return {
    props: {section, alternates}
  }
}
