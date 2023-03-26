import Head from 'next/head'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import {getAllPosts} from 'lib/blog/posts'
import {getPrettyDate} from 'lib/blog/date'
import {getTagsData} from 'lib/blog/tags'
import {fromLocalesToAlternates} from 'lib/mappers'
import {BLOG} from 'config'
import Article from 'components/article'
import BlogTags from 'components/blog-tags'
import {BlogPost} from 'types/blog'
import {Alternate} from 'types'
import PostTitle from 'components/post-title'
import {getSlug} from 'lib/utils'

export default function Post({post, alternates}: PostProps) {
  const {locale} = useRouter()
  const {t} = useTranslation('blog')
  const author = BLOG.AUTHORS.find(({slug}) => post.author === slug).name

  function createAuthorMarkup() {
    return {
      __html: t('post.by', {
        author: `<a href="/${getSlug(
          t('common:sections.about-me.name')
        )}" title="${author}" class="underline hover:no-underline hover:text-neutral-300/90">${author}</a>`
      })
    }
  }

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
              className="rounded bg-gradient-to-br from-neutral-800/60 p-2 font-light text-orange-300/60"
              dateTime={post.createdAt}
            >
              {getPrettyDate(post.createdAt, locale)}
            </time>

            <span className="text-neutral-600/60 before:content-['\00a0·\00a0']">
              {t('common:blog.post.reading-time-message', {
                count: post.readingTime
              })}
            </span>
          </div>

          <h1 className="my-6 text-6xl font-black sm:text-8xl">
            <PostTitle title={post.title} />
          </h1>

          <div
            className="font-thin text-neutral-300/60"
            dangerouslySetInnerHTML={createAuthorMarkup()}
          />
        </header>

        <Article
          content={post.content}
          className="relative mx-auto mt-12 pt-12 after:absolute after:left-0 after:top-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:via-neutral-600"
        />

        {post.tags && <BlogTags tags={post.blogTags} isPost />}
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
  const blogTags = await getTagsData({tags: post.tags.split(', '), locale})
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
      post: {...post, blogTags},
      alternates,
      section
    }
  }
}

interface PostProps {
  post: BlogPost
  alternates: Alternate[]
}
