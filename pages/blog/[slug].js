import Head from 'next/head'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import {getAllPosts} from '../../lib/blog/posts.js'
import {getPrettyDate} from '../../lib/blog/date.js'
import {fromLocalesToAlternates} from '../../lib/mappers.js'
import Article from '../../components/article.js'
import {BLOG_AUTHORS} from '../../config/index.js'

export default function Post({post, alternates}) {
  const {locale} = useRouter()
  const {t} = useTranslation('blog')
  const author = BLOG_AUTHORS.find(({slug}) => post.author === slug).name

  return (
    <div>
      <Head>
        <title>{`Kiko Ruiz / ${post.title}`}</title>
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <article className="p-6">
        <header className="pt-12 text-center sm:pt-0">
          <div className="text-sm">
            <time
              className="text-orange-300/60 after:content-['\00a0·\00a0']"
              dateTime={post.createdAt}
            >
              {getPrettyDate(post.createdAt, locale)}
            </time>

            <span className="text-neutral-600/60">
              {t('post.reading-time-message', {count: post.readingTime})}
            </span>
          </div>

          <h1 className="my-3 text-6xl font-black sm:text-8xl">{post.title}</h1>

          <div className="font-extralight text-neutral-300/60">
            {t('post.by', {author})}
          </div>
        </header>

        <Article
          content={post.content}
          className="relative mx-auto mt-12 pt-12 after:absolute after:left-0 after:top-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:via-neutral-600 xl:max-w-5xl"
        />
      </article>
    </div>
  )
}

export async function getStaticPaths({locales}) {
  const posts = await getAllPosts()
  let paths = []

  for (const locale of locales) {
    paths = paths.concat(
      posts.map(post => ({
        params: {
          slug: post.slug
        },
        locale
      }))
    )
  }

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({
  params: {slug},
  locales,
  locale,
  defaultLocale
}) {
  const section = 'blog'
  const posts = await getAllPosts()
  const post = posts.find(post => post.slug === slug)
  const alternates = await Promise.all(
    locales.map(
      await fromLocalesToAlternates({
        defaultLocale,
        locale,
        section,
        category: slug
      })
    )
  )

  return {
    props: {post, alternates, section}
  }
}
