import Head from 'next/head'
import {getAllPosts} from '../../lib/blog/posts'
import {fromLocalesToAlternates} from '../../lib/mappers'
import {getTagsData} from '../../lib/blog/tags'
import PostsList from '../../components/posts-list'

export default function Blog({posts, tags, alternates}) {
  return (
    <>
      <Head>
        <title>Kiko Ruiz / Blog</title>
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <PostsList tags={tags} posts={posts} />
    </>
  )
}

export async function getStaticProps({locales, locale, defaultLocale}) {
  const section = 'blog'
  const posts = await getAllPosts()
  const tags = await getTagsData({locale})
  const alternates = await Promise.all(
    locales.map(await fromLocalesToAlternates({defaultLocale, section}))
  )

  return {
    props: {
      posts,
      tags,
      alternates,
      section
    }
  }
}
