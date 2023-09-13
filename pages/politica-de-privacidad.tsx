import Article from 'components/article'
import {getContent} from 'lib/content'
import {fromLocalesToAlternates} from 'lib/mappers'
import Head from 'next/head'
import {StaticContent} from 'types'

export default function PrivacyPolicy({
  content,
  alternates
}: PrivacyPolicyProps) {
  return (
    <>
      <Head>
        <title>{`Kiko Ruiz / ${content.title}`}</title>
        <meta name="description" content={content.title} />
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <article className="mx-auto p-6 xl:max-w-5xl">
        <header className="pt-9 text-center sm:pt-0">
          <h1 className="my-6 text-6xl font-black sm:text-8xl">
            {content.title}
          </h1>
        </header>

        <Article content={content.body} className="mt-9 flex-1 sm:mt-0" />
      </article>
    </>
  )
}

export async function getStaticProps({locales, locale, defaultLocale}) {
  const category = 'legal'
  const page = 'privacy-policy'
  const content = await getContent({locale, page, category})
  const alternates = await Promise.all(
    locales.map(await fromLocalesToAlternates({defaultLocale, page, category}))
  )

  return {
    props: {content, section: page, alternates}
  }
}

interface PrivacyPolicyProps {
  content: StaticContent
  alternates: Alternate[]
}
