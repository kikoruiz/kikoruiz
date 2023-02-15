import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import {fromLocalesToAlternates} from 'lib/mappers'
import {Alternate, Tag} from 'types'
import GalleryHeader from 'components/gallery-header'
import GalleryTags from 'components/gallery-tags'
import {getGalleryTags} from 'lib/gallery/tags'

export default function GalleryTagsIndex({
  tags,
  alternates
}: GalleryTagsIndexProps) {
  const {t} = useTranslation()

  return (
    <>
      <Head>
        <title>{`Kiko Ruiz / ${t('tags')}`}</title>
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <GalleryHeader isTagsIndex />

      <GalleryTags tags={tags} />
    </>
  )
}

export async function getStaticProps({locale, locales, defaultLocale}) {
  const section = 'gallery'
  const subSection = 'tags'
  const tags = await getGalleryTags({locale})
  const alternates = await Promise.all(
    locales.map(
      await fromLocalesToAlternates({defaultLocale, section, subSection})
    )
  )

  return {
    props: {tags, alternates, section, subSection}
  }
}

interface GalleryTagsIndexProps {
  tags: Tag[]
  alternates: Alternate[]
}
