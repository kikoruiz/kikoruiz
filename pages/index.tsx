import {useState} from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import {fromLocalesToAlternates} from 'lib/mappers'
import {
  getHeroImage,
  getSectionImages,
  getLatestPictures,
  getLatestContent
} from 'lib/home'
import {getAllPicturesOnMap} from 'lib/gallery/pictures'
import {getGalleryTags} from 'lib/gallery/tags'
import Hero from 'components/hero'
import HomeSections from 'components/home-sections'
import GalleryTags from 'components/gallery-tags'
import HomeLatestContent from 'components/home-latest-content'
import HomeBlock from 'components/home-block'
import HomeModule from 'components/home-module'
import HomeLatestPictures from 'components/home-latest-pictures'
import {Alternate, SectionImage, Tag} from 'types'
import {HighlightedImage, LatestPictures, PictureOnMap} from 'types/gallery'
import {BlogPost} from 'types/blog'
import Logo from 'assets/brand/logo.svg'
import IconGlobe from 'assets/icons/globe-europe-africa.svg'
import IconMapPin from 'assets/icons/map-pin.svg'
import HomeContact from 'components/home-contact'
import {GALLERY_ALBUMS} from 'config/gallery'

const DynamicHomeMap = dynamic(() => import('components/home-map'), {
  ssr: false
})

export default function Home({
  heroImage,
  latestContent,
  latestPictures,
  sectionImages,
  picturesOnMap,
  galleryTags,
  alternates
}: HomeProps) {
  const [showMap, setShowMap] = useState(false)
  const {averageColor} = heroImage
  const {t} = useTranslation()
  const galleryCategories = GALLERY_ALBUMS.map(({id}) =>
    t(`gallery.albums.${id}.name`).toLowerCase()
  )
  const seoDescription = `${t('sections.gallery.description').replace(
    '.',
    ':'
  )} ${galleryCategories.join(', ')}. ${t('sections.blog.description')}`

  return (
    <>
      <Head>
        <title>Kiko Ruiz</title>
        <meta name="description" content={seoDescription} />
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <Hero image={heroImage} />

      <div className="p-3">
        <header className="rounded bg-gradient-to-br from-neutral-900/60 to-neutral-900/30 px-3 pb-6 pt-12 text-white/90 md:px-6">
          <div className="mb-6 flex flex-col items-center break-words xl:mb-9 xl:flex-row xl:justify-center">
            <Logo className="mb-3 w-24 fill-current xl:mb-0 xl:mr-6" />

            <h1 className="break-words text-center text-4xl font-black leading-tight drop-shadow sm:text-5xl sm:leading-normal xl:text-6xl">
              Kiko Ruiz <span className="font-thin">Photography</span>
            </h1>
          </div>

          <HomeSections images={sectionImages} averageColor={averageColor} />
        </header>

        {latestContent.length > 0 && (
          <HomeLatestContent posts={latestContent} />
        )}

        <HomeLatestPictures latestPictures={latestPictures} />

        <HomeBlock>
          <div
            onClick={() => {
              setShowMap(true)
            }}
            className="group relative flex w-full cursor-pointer justify-center overflow-hidden rounded border border-neutral-700/60 bg-gradient-to-t from-neutral-900 to-neutral-900/80 p-6 hover:border-orange-300/60 sm:justify-end lg:p-12"
          >
            <IconGlobe className="absolute -left-8 -top-14 w-64 fill-neutral-600/90 transition-transform group-hover:scale-125 group-hover:fill-orange-300 lg:-top-24 lg:left-0 lg:w-[45%] lg:group-hover:scale-110 xl:-left-12 xl:-top-48 xl:w-[60%]" />
            <button
              aria-label={t('map.button')}
              title={t('map.button')}
              className="z-0 flex appearance-none items-center rounded-full border border-neutral-600/30 bg-neutral-800/90 p-6 py-3 font-semibold text-neutral-300/60 drop-shadow transition-all hover:drop-shadow-lg group-hover:text-orange-300/90"
            >
              <IconMapPin className="-ml-1 mr-1.5 w-6" />
              {t('map.button')}
            </button>
          </div>

          {showMap && (
            <DynamicHomeMap pictures={picturesOnMap} setShowMap={setShowMap} />
          )}
        </HomeBlock>

        <HomeModule title={t('home:gallery-tags')} className="pb-3">
          <GalleryTags tags={galleryTags} />
        </HomeModule>

        <HomeContact />

        <HomeBlock className="flex items-center justify-center px-12 py-16">
          <Logo className="w-fit fill-white/5 xl:w-[60%]" />
        </HomeBlock>
      </div>
    </>
  )
}

export async function getStaticProps({
  locale,
  locales,
  defaultLocale
}: {
  locale: string
  locales: string[]
  defaultLocale: string
}) {
  const heroImage = await getHeroImage()
  const latestPictures = await getLatestPictures({locale})
  const sectionImages = await getSectionImages()
  const latestContent = await getLatestContent()
  const picturesOnMap = await getAllPicturesOnMap({locale})
  const galleryTags = await getGalleryTags({locale})
  const alternates = (await Promise.all(
    locales.map(await fromLocalesToAlternates({defaultLocale}))
  )) as Alternate[]

  return {
    props: {
      heroImage,
      latestContent,
      latestPictures,
      sectionImages,
      picturesOnMap,
      galleryTags,
      alternates
    }
  }
}

interface HomeProps {
  heroImage: HighlightedImage
  latestContent: BlogPost[]
  latestPictures: LatestPictures
  sectionImages: SectionImage[]
  picturesOnMap: PictureOnMap[]
  galleryTags: Tag[]
  alternates: Alternate[]
}
