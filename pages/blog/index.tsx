import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import {getAllPosts} from 'lib/blog/posts'
import {fromLocalesToAlternates} from 'lib/mappers'
import {getTagsData} from 'lib/blog/tags'
import {getAbsoluteUrl} from 'lib/utils'
import BlogList from 'components/blog-list'
import {BlogPost} from 'types/blog'
import {Alternate, Tag} from 'types'
import {SECTIONS} from 'config'

export default function Blog({posts, tags, alternates, section}: BlogProps) {
  const {t} = useTranslation()
  const title = `Kiko Ruiz / ${t('sections.blog.name')}`
  const description = t('sections.blog.description')

  return (
    <>
      <Head>
        <title>{}</title>
        <meta name="description" content={description} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta
          property="og:image"
          content={getAbsoluteUrl(
            SECTIONS.find(({id}) => id === section).highlightedPicture
          )}
        />

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
  const posts = await getAllPosts(locale)
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
  section: string
}
