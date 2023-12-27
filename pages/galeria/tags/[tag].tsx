import Head from 'next/head'
import getT from 'next-translate/getT'
import useTranslation from 'next-translate/useTranslation'
import GalleryPage from 'components/gallery-page'
import {GALLERY_TAGS} from 'config/gallery'
import {fromExifToGallery} from 'lib/gallery/mappers'
import {getGalleryPicturesByTag} from 'lib/gallery/pictures'
import {getAbsoluteUrl, getSlug} from 'lib/utils'
import {fromLocalesToAlternates} from 'lib/mappers'
import {Alternate} from 'types'
import {Picture} from 'types/gallery'

export default function GalleryTag({
  alternates,
  ...pageProps
}: GalleryTagProps) {
  const {t} = useTranslation('gallery')
  const title = `Kiko Ruiz / ${t('common:tags')} / # ${t(
    `tags.${getSlug(pageProps.tag)}`
  ).toLowerCase()}`
  const description = t('common:sections.gallery.description')

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta
          property="og:image"
          content={getAbsoluteUrl(pageProps.pictures[0].image.src)}
        />

        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <GalleryPage {...pageProps} />
    </>
  )
}

export async function getStaticPaths({locales}) {
  let paths = []

  for (const locale of locales) {
    const t = await getT(locale, 'gallery')

    paths = paths.concat(
      GALLERY_TAGS.map(galleryTag => {
        const originalSlug = getSlug(galleryTag)
        const tag = getSlug(t(`tags.${originalSlug}`))

        return {
          params: {tag},
          locale
        }
      })
    )
  }

  return {paths, fallback: false}
}

export async function getStaticProps({
  params: {tag},
  locale,
  locales,
  defaultLocale
}) {
  const section = 'gallery'
  const galleryPictures = await getGalleryPicturesByTag({locale, tag})
  const pictures: Picture[] = await Promise.all(
    galleryPictures.map(fromExifToGallery({locale, tag}))
  )
  const t = await getT(locale, 'gallery')
  const actualTag = GALLERY_TAGS.find(
    galleryTag => getSlug(t(`tags.${getSlug(galleryTag)}`)) === tag
  )
  const alternates: Alternate[] = await Promise.all(
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
      pictures,
      alternates,
      tag: actualTag,
      section
    }
  }
}

interface GalleryTagProps {
  pictures: Picture[]
  tag: string
  alternates: Alternate[]
}
