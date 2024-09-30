import Head from 'next/head'
import Article from 'components/article'
import {Alternate, StaticContent} from 'types'

export interface StaticPageProps {
  content: StaticContent
  alternates: Alternate[]
}

export default function StaticPage({content, alternates}: StaticPageProps) {
  return (
    <>
      <Head>
        <title>{`Kiko Ruiz / ${content.title}`}</title>
        <meta name="description" content={content.title} />
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <section className="mx-auto px-6 xl:max-w-5xl bg-slate-100">
        <header className="pt-12 sm:pt-6 text-center">
          <h1 className="text-6xl font-black sm:text-8xl">{content.title}</h1>
        </header>

        <Article
          content={content.body}
          className="relative mx-auto mt-12 pt-12 sm:mt-16 sm:pt-16 before:absolute before:left-0 before:top-0 before:block before:h-[1px] before:w-full before:bg-gradient-to-r before:from-transparent before:via-neutral-600"
        />
      </section>
    </>
  )
}
