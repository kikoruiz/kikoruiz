import Head from 'next/head'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {getAllPosts} from '../../lib/blog/posts.js'
import {getPrettyDate} from '../../lib/blog/date.js'
import {fromLocalesToAlternates} from '../../lib/mappers.js'

export default function Posts({posts, alternates}) {
  const {locale} = useRouter()

  return (
    <>
      <Head>
        <title>Kiko Ruiz</title>
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <div className="p-12">
        <h1>Posts</h1>
        {posts.map(post => (
          <article key={post.slug}>
            <h2>
              <Link href={post.permalink}>
                <a>{post.title}</a>
              </Link>
            </h2>

            <time dateTime={post.createdAt}>
              {getPrettyDate(post.createdAt, locale)}
            </time>

            <p>{post.excerpt}</p>

            <Link href={post.permalink}>
              <a>Read more</a>
            </Link>
          </article>
        ))}
      </div>
    </>
  )
}

export async function getStaticProps({locales, defaultLocale}) {
  const section = 'blog'
  const posts = getAllPosts()
  const alternates = await Promise.all(
    locales.map(await fromLocalesToAlternates({defaultLocale, section}))
  )

  return {
    props: {
      posts,
      alternates,
      section
    }
  }
}
