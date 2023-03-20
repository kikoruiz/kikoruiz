import {useState} from 'react'
import Head from 'next/head'
// import Link from 'next/link'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import {fromLocalesToAlternates} from 'lib/mappers'
import {
  getHeroImage,
  getSectionImages,
  // getLastPicture,
  getLatestContent
} from 'lib/home'
import {getAllPicturesOnMap} from 'lib/gallery/pictures'
import Hero from 'components/hero'
import HomeSections from 'components/home-sections'
import {Alternate, SectionImage, Tag} from 'types'
import {HighlightedImage, PictureOnMap} from 'types/gallery'
import Logo from 'assets/brand/logo.svg'
import IconGlobe from 'assets/icons/globe-europe-africa.svg'
import IconMapPin from 'assets/icons/map-pin.svg'
import GalleryTags from 'components/gallery-tags'
import {getGalleryTags} from 'lib/gallery/tags'
// import {getSlug} from 'lib/utils'
import HomeLatestContent from 'components/home-latest-content'
import HomeBlock from 'components/home-block'
import {BlogPost} from 'types/blog'
import HomeModule from 'components/home-module'

const DynamicHomeMap = dynamic(() => import('components/home-map'), {
  ssr: false
})

export default function Home({
  heroImage,
  latestContent,
  // lastPicture,
  sectionImages,
  pictures,
  galleryTags,
  alternates
}: HomeProps) {
  const [showMap, setShowMap] = useState(false)
  const {averageColor} = heroImage
  const {t} = useTranslation()

  return (
    <>
      <Head>
        <title>Kiko Ruiz</title>
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <Hero image={heroImage} />

      <div className="p-3">
        <header className="rounded bg-gradient-to-br from-neutral-900/60 to-neutral-900/30 px-3 pt-12 pb-6 text-white/90 md:px-6">
          <div className="mb-6 flex flex-col items-center break-words xl:mb-9 xl:flex-row xl:justify-center">
            <Logo className="mb-3 w-24 fill-current xl:mb-0 xl:mr-6" />

            <h1 className="break-words text-center text-4xl font-black leading-normal drop-shadow sm:text-5xl sm:leading-normal xl:text-6xl">
              Kiko Ruiz <span className="font-thin">Photography</span>
            </h1>
          </div>

          <HomeSections images={sectionImages} averageColor={averageColor} />
        </header>

        <HomeLatestContent posts={latestContent} />

        <HomeBlock>
          <div
            className="group relative flex w-full cursor-pointer justify-center overflow-hidden rounded border border-neutral-700/60 bg-gradient-to-t from-neutral-900 to-neutral-900/80 p-6 hover:border-orange-300 sm:justify-end lg:p-12"
            onClick={() => {
              setShowMap(true)
            }}
          >
            <IconGlobe className="absolute -top-14 -left-8 w-64 fill-neutral-600/90 group-hover:fill-orange-300 lg:-top-24 lg:left-0 lg:w-[45%] xl:-top-48 xl:-left-12 xl:w-[60%]" />
            <button
              aria-label={t('map.button')}
              className="z-0 flex appearance-none items-center rounded-full border border-neutral-700 bg-neutral-800/90 p-6 py-3 font-semibold text-neutral-300/60 shadow-sm drop-shadow group-hover:border-orange-300/60"
            >
              <IconMapPin className="-ml-1 mr-1.5 w-6" />
              {t('map.button')}
            </button>
          </div>

          {showMap && (
            <DynamicHomeMap pictures={pictures} setShowMap={setShowMap} />
          )}
        </HomeBlock>

        <HomeModule title={t('home:gallery-tags')}>
          <GalleryTags tags={galleryTags} />
        </HomeModule>

        <HomeBlock className="flex items-center justify-center p-12 pt-16">
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
  // const lastPicture = await getLastPicture({locale})
  const sectionImages = await getSectionImages()
  const latestContent = await getLatestContent()
  const pictures = await getAllPicturesOnMap({locale})
  const galleryTags = await getGalleryTags({locale})
  const alternates = (await Promise.all(
    locales.map(await fromLocalesToAlternates({defaultLocale}))
  )) as Alternate[]

  return {
    props: {
      heroImage,
      latestContent,
      // lastPicture,
      sectionImages,
      pictures,
      galleryTags,
      alternates
    }
  }
}

interface HomeProps {
  heroImage: HighlightedImage
  latestContent: BlogPost[]
  // lastPicture: Picture
  sectionImages: SectionImage[]
  pictures: PictureOnMap[]
  galleryTags: Tag[]
  alternates: Alternate[]
}
