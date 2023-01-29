import Head from 'next/head'
import getT from 'next-translate/getT'
import {remove} from 'remove-accents'
import {BLOG} from 'config'
import {fromLocalesToAlternates} from 'lib/mappers'
import {getAllPosts} from 'lib/blog/posts'
import PostsList from 'components/posts-list'
import {BlogPost} from 'types/blog'
import {Alternate} from 'types'

export const config = {
  unstable_excludeFiles: ['public/**/*']
}

export default function Tag({tag, posts, alternates}: TagProps) {
  return (
    <>
      <Head>
        <title>{`Kiko Ruiz / ${tag}`}</title>
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <PostsList tag={tag} posts={posts} />
    </>
  )
}

export async function getStaticPaths({locales}) {
  let paths = []

  for (const locale of locales) {
    const t = await getT(locale, 'blog')

    paths = paths.concat(
      BLOG.TAGS.map(tag => ({
        params: {
          tag: remove(t(`tags.${tag}`))
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
  params: {tag},
  locales,
  locale,
  defaultLocale
}) {
  const section = 'blog'
  const posts = await getAllPosts()
  const t = await getT(locale, 'blog')
  const actualTag = BLOG.TAGS.find(
    currentTag => tag === remove(t(`tags.${currentTag}`))
  )
  const alternates = await Promise.all(
    locales.map(
      await fromLocalesToAlternates({
        defaultLocale,
        locale,
        section,
        tag: actualTag
      })
    )
  )

  return {
    props: {
      section,
      tag: actualTag,
      posts: posts.filter(({tags}) => tags.includes(actualTag)),
      alternates
    }
  }
}

interface TagProps {
  tag: string
  posts: BlogPost[]
  alternates: Alternate[]
}
