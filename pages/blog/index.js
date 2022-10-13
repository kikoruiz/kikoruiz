import Head from 'next/head'
import {getAllPosts} from '../../lib/blog/posts.js'
import {fromLocalesToAlternates} from '../../lib/mappers.js'
import PostCard from '../../components/post-card.js'

export default function Posts({posts, alternates}) {
  return (
    <>
      <Head>
        <title>Kiko Ruiz / Blog</title>
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <section className="grid p-4 sm:grid-cols-2 sm:gap-2">
        {posts.map(post => (
          <PostCard key={post.slug} {...post} />
        ))}
      </section>
    </>
  )
}

export async function getStaticProps({locales, defaultLocale}) {
  const section = 'blog'
  const posts = await getAllPosts()
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
