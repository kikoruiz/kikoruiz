import Head from 'next/head'
import {useRouter} from 'next/router'
import {getAllPosts, getPostBySlug} from '../../lib/blog/posts.js'
import {getPrettyDate} from '../../lib/blog/date.js'
import {fromLocalesToAlternates} from '../../lib/mappers.js'

export default function Post({post, alternates}) {
  const {locale} = useRouter()

  return (
    <div>
      <Head>
        <title>Kiko Ruiz</title>
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hreflang={locale} href={href} />
        ))}
      </Head>

      <h1>{post.title}</h1>

      <time dateTime={post.createdAt}>
        {getPrettyDate(post.createdAt, locale)}
      </time>

      <div dangerouslySetInnerHTML={{__html: post.body}} />
    </div>
  )
}

export async function getStaticPaths({locales}) {
  let paths = []
  const posts = getAllPosts()

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
  const post = getPostBySlug(slug)
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
