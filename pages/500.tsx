import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import {Alternate} from 'types'
import {fromLocalesToAlternates} from 'lib/mappers'
import ErrorPage from 'components/error-page'

export default function Custom500() {
  const {t} = useTranslation()

  return (
    <>
      <Head>
        <title>Kiko Ruiz | 500</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <ErrorPage title={t('error.500')} />
    </>
  )
}

export async function getStaticProps({
  locales,
  defaultLocale
}: {
  locales: string[]
  defaultLocale: string
}) {
  const alternates = (await Promise.all(
    locales.map(await fromLocalesToAlternates({defaultLocale}))
  )) as Alternate[]

  return {
    props: {
      section: 'error',
      alternates
    }
  }
}
