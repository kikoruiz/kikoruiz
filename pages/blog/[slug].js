import Head from 'next/head'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import {getAllPosts} from '../../lib/blog/posts.js'
import {getPrettyDate} from '../../lib/blog/date.js'
import {getTagsData} from '../../lib/blog/tags.js'
import {fromLocalesToAlternates} from '../../lib/mappers.js'
import {BLOG} from '../../config/index.js'
import Article from '../../components/article.js'
import BlogTags from '../../components/blog-tags.js'
import {getSectionSeparator} from '../../lib/utils.js'

export default function Post({post, alternates}) {
  const {locale} = useRouter()
  const {t} = useTranslation('blog')
  const author = BLOG.AUTHORS.find(({slug}) => post.author === slug).name

  return (
    <>
      <Head>
        <title>{`Kiko Ruiz / ${post.title}`}</title>
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <article className="mx-auto p-6 xl:max-w-5xl">
        <header className="pt-9 text-center sm:pt-0">
          <div>
            <time
              className="rounded bg-gradient-to-r from-neutral-800/60 p-2 text-orange-300/60"
              dateTime={post.createdAt}
            >
              {getPrettyDate(post.createdAt, locale)}
            </time>

            <span className="text-neutral-600/60 before:content-['\00a0·\00a0']">
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
          className={`mx-auto mt-12 pt-12 ${getSectionSeparator()}`}
        />

        {post.tags && <BlogTags tags={post.tags} isPost />}
      </article>
    </>
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
  const tags = await getTagsData({tags: post.tags.split(', '), locale})
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
    props: {
      post: {...post, tags},
      alternates,
      section
    }
  }
}
