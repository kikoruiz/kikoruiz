import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import {Alternate} from 'types'
import {fromLocalesToAlternates} from 'lib/mappers'

export default function Store({alternates}: StoreProps) {
  const {t} = useTranslation()

  return (
    <>
      <Head>
        <title>{`Kiko Ruiz / ${t('sections.store.name')}`}</title>
        <meta name="description" content={t('sections.store.description')} />
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <h2>Store</h2>
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

interface StoreProps {
  alternates: Alternate[]
}
