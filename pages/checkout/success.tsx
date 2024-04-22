import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import {Alternate} from 'types'
import {fromLocalesToAlternates} from 'lib/mappers'
import SimplePage from 'components/simple-page'

export default function CheckoutError() {
  const {t} = useTranslation()

  return (
    <>
      <Head>
        <title>Kiko Ruiz | Checkout Error</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <SimplePage title={t('checkout.success')} />
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
      section: 'checkout',
      alternates
    }
  }
}
