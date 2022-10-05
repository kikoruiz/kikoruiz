import Head from 'next/head'
import {fromLocalesToAlternates} from '../lib/mappers.js'

export default function AboutMe({alternates}) {
  return (
    <>
      <Head>
        <title>Kiko Ruiz</title>
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hreflang={locale} href={href} />
        ))}
      </Head>

      <div className="flex justify-center p-12">
        <h1 className="text-3xl">Hi, my name is Kiko!</h1>
      </div>
    </>
  )
}

export async function getStaticProps({locales, defaultLocale}) {
  const section = 'about-me'
  const alternates = await Promise.all(
    locales.map(await fromLocalesToAlternates({defaultLocale, section}))
  )

  return {
    props: {section, alternates}
  }
}
