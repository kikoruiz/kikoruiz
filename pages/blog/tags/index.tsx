import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import {fromLocalesToAlternates} from 'lib/mappers'
import {Alternate, Tag} from 'types'
import {getTagsData} from 'lib/blog/tags'
import BlogHeader from 'components/blog-header'
import BlogTag from 'components/blog-tag'

export default function BlogTags({tags, alternates}: BlogTagsProps) {
  const {t} = useTranslation()

  return (
    <>
      <Head>
        <title>{`Kiko Ruiz / ${t('tags')}`}</title>
        <meta name="description" content={t('sections.blog.description')} />
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <BlogHeader tags={tags} isTagsIndex />

      <section className="flex justify-center px-6 py-12">
        <div className="inline-flex scale-110 flex-row-reverse">
          {tags.map(tag => (
            <BlogTag key={tag.slug} {...tag} size="large" />
          ))}
        </div>
      </section>
    </>
  )
}

export async function getStaticProps({locale, locales, defaultLocale}) {
  const section = 'blog'
  const subSection = 'tags'
  const tags = await getTagsData({locale})
  const alternates = await Promise.all(
    locales.map(
      await fromLocalesToAlternates({defaultLocale, section, subSection})
    )
  )

  return {
    props: {tags, alternates, section, subSection}
  }
}

interface BlogTagsProps {
  tags: Tag[]
  alternates: Alternate[]
}
