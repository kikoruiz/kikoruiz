import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import {getAllPosts} from 'lib/blog/posts'
import {fromLocalesToAlternates} from 'lib/mappers'
import {getTagsData} from 'lib/blog/tags'
import BlogList from 'components/blog-list'
import {BlogPost} from 'types/blog'
import {Alternate, Tag} from 'types'

export default function Blog({posts, tags, alternates}: BlogProps) {
  const {t} = useTranslation()

  return (
    <>
      <Head>
        <title>{`Kiko Ruiz / ${t('sections.blog.name')}`}</title>
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <BlogList tags={tags} posts={posts} />
    </>
  )
}

export async function getStaticProps({
  locales,
  locale,
  defaultLocale
}: {
  locales: string[]
  locale: string
  defaultLocale: string
}) {
  const section = 'blog'
  const subSection = 'tags'
  const posts = await getAllPosts()
  const tags = await getTagsData({locale, subSection})
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

interface BlogProps {
  posts: BlogPost[]
  tags: Tag[]
  alternates: Alternate[]
}
