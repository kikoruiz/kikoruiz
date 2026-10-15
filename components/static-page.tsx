import {ReactNode} from 'react'
import Head from 'next/head'
import Article from 'components/article'
import {SITE_NAME} from 'config'
import {FIT_TITLE_CLASS_NAME, getFitTitleStyle} from 'lib/utils/title'
import {Alternate, StaticContent} from 'types'

export interface StaticPageProps {
  content: StaticContent
  alternates: Alternate[]
}

export default function StaticPage({
  content,
  alternates,
  noindex = false,
  children
}: StaticPageProps & {noindex?: boolean; children?: ReactNode}) {
  return (
    <>
      <Head>
        <title>{`${SITE_NAME} / ${content.title}`}</title>
        <meta name="description" content={content.title} />
        {noindex && <meta name="robots" content="noindex, follow" />}
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <section className="mx-auto px-6 xl:max-w-5xl">
        <header className="pt-12 sm:pt-6 text-center">
          <h1
            className={`text-6xl font-black sm:text-8xl ${FIT_TITLE_CLASS_NAME}`}
            style={getFitTitleStyle(content.title)}
          >
            {content.title}
          </h1>
        </header>

        {children}

        <Article
          content={content.body}
          className="relative mx-auto mt-12 pt-12 sm:mt-16 sm:pt-16 before:absolute before:left-0 before:top-0 before:block before:h-[1px] before:w-full before:bg-gradient-to-r before:from-transparent before:via-neutral-600"
        />
      </section>
    </>
  )
}

StaticPage.displayName = 'StaticPage'
