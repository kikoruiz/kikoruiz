import Head from 'next/head'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import {fromLocalesToAlternates} from 'lib/mappers'
import {Alternate, Tag} from 'types'
import {getTagsData} from 'lib/blog/tags'
import BlogHeader from 'components/blog-header'

export default function BlogTags({tags, alternates}: BlogTagsProps) {
  const {t} = useTranslation()

  return (
    <>
      <Head>
        <title>{`Kiko Ruiz / ${t('tags')}`}</title>
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <BlogHeader tags={tags} isTagsIndex />

      <section className="flex justify-center p-6">
        <div className="inline-flex flex-row-reverse">
          {tags.reverse().map(({id, name, href}) => (
            <Link
              key={id}
              href={href}
              title={name}
              className={`relative -ml-3 mt-3 rotate-12 rounded-r rounded-l-3xl border p-2 pl-6 text-neutral-900 transition-transform duration-300 ease-in-out before:absolute before:left-2 before:top-1/2 before:mt-[-4.5px] before:h-[9px] before:w-[9px] before:rounded-full before:border before:bg-neutral-900 last:ml-0 hover:translate-x-1 hover:rotate-3 lg:ml-9 lg:scale-150 ${tagClassName(
                id
              )}`}
            >
              {name}
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

function tagClassName(tag) {
  switch (tag) {
    case 'photography':
      return 'bg-red-400/60 hover:bg-red-400 border-red-900 before:border-red-900'
    case 'personal':
      return 'bg-blue-400/60 hover:bg-blue-400 border-blue-900 before:border-blue-900'
    default:
      return 'bg-orange-400/60 hover:bg-orange-400 border-orange-900 before:border-orange-900'
  }
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
