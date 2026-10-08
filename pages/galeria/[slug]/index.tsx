import Head from 'next/head'
import getT from 'next-translate/getT'
import useTranslation from 'next-translate/useTranslation'
import GalleryPage from 'components/gallery-page'
import {getGalleryAlbums} from 'lib/gallery/albums'
import {getAlbumPageProps} from 'lib/gallery/album-page'
import {getSlug} from 'lib/utils'
import {SITE_NAME} from 'config'
import {Picture, Subcategory} from 'types/gallery'
import {Alternate} from 'types'

interface GallerySlugProps {
  pictures: Picture[]
  category?: string
  subcategories?: Subcategory[]
  basePath: string
  alternates: Alternate[]
}

export default function GallerySlug({
  alternates,
  ...pageProps
}: GallerySlugProps) {
  const {t} = useTranslation()

  return (
    <>
      <Head>
        <title>{`${SITE_NAME} / ${t(
          `gallery.albums.${pageProps.category}.name`
        )}`}</title>
        <meta name="description" content={t('sections.gallery.description')} />

        <meta property="og:type" content="website" />

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
  const albums = await getGalleryAlbums()

  for (const locale of locales) {
    const t = await getT(locale, 'common')

    paths = paths.concat(
      albums.map(({id}) => {
        const slug = getSlug(t(`gallery.albums.${id}.name`))

        return {
          params: {slug},
          locale
        }
      })
    )
  }

  return {paths, fallback: false}
}

export async function getStaticProps({
  params: {slug},
  locale,
  locales,
  defaultLocale
}) {
  return {
    props: await getAlbumPageProps({slug, locale, locales, defaultLocale})
  }
}
