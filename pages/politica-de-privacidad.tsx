import Article from 'components/article'
import {getContent} from 'lib/content'
import {fromLocalesToAlternates} from 'lib/mappers'
import Head from 'next/head'
import {Alternate, StaticContent} from 'types'

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

      <section className="mx-auto px-6 xl:max-w-5xl">
        <header className="pt-12 sm:pt-6 text-center">
          <h1 className="text-6xl font-black sm:text-8xl">
            {content.title}
          </h1>
        </header>

        <Article content={content.body} className="relative mx-auto mt-16 pt-16 before:absolute before:left-0 before:top-0 before:block before:h-[1px] before:w-full before:bg-gradient-to-r before:from-transparent before:via-neutral-600"/>
      </section>
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
