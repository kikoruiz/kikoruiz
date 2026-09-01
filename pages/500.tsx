import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import {Alternate} from 'types'
import {fromLocalesToAlternates} from 'lib/mappers'
import {SITE_NAME} from 'config'
import SimplePage from 'components/simple-page'

export default function Custom500() {
  const {t} = useTranslation()

  return (
    <>
      <Head>
        <title>{`${SITE_NAME} | 500`}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <SimplePage title={t('error.500')} />
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
