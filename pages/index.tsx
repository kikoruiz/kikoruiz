import {useState} from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import {fromLocalesToAlternates} from 'lib/mappers'
import {getHeroImage, getSectionImages} from 'lib/home'
import {getAllPictures} from 'lib/gallery/pictures'
import Hero from 'components/hero'
import HomeSections from 'components/home-sections'
import {Alternate, SectionImage} from 'types'
import {HighlightedImage, RawPicture} from 'types/gallery'
import Logo from 'assets/brand/logo.svg'
import IconGlobe from 'assets/icons/globe-europe-africa.svg'
import IconMapPin from 'assets/icons/map-pin.svg'

const DynamicMap = dynamic(() => import('components/map'), {
  ssr: false
})

export default function Home({
  heroImage,
  sectionImages,
  pictures,
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
        <header className="mb-6 flex flex-col items-center break-words rounded bg-gradient-to-br from-neutral-900/60 to-neutral-900/30 py-12 px-6 text-white/80 xl:flex-row xl:justify-center">
          <Logo className="mb-3 w-24 fill-current xl:mb-0 xl:mr-6" />
          <h1 className="break-words text-center text-4xl font-black leading-[1.125] drop-shadow sm:text-5xl xl:text-6xl">
            Kiko Ruiz <span className="font-thin">Photography</span>
          </h1>
        </header>

        <HomeSections images={sectionImages} averageColor={averageColor} />

        <section className="mt-6">
          <div
            className="group relative flex w-full cursor-pointer justify-center overflow-hidden rounded border border-neutral-700/60 bg-gradient-to-t from-neutral-900 to-neutral-900/80 p-6 hover:border-orange-300 sm:justify-end lg:p-12"
            onClick={() => {
              setShowMap(true)
            }}
          >
            <IconGlobe className="absolute -top-14 -left-8 w-64 fill-neutral-600/90 group-hover:fill-orange-300 lg:-top-24 lg:left-0 lg:w-[45%] xl:-top-48 xl:-left-12 xl:w-[60%]" />
            <button
              aria-label=""
              className="z-0 flex appearance-none items-center rounded-full border border-neutral-700 bg-neutral-800/90 p-6 py-3 font-semibold text-neutral-300/60 shadow-sm drop-shadow group-hover:border-orange-300/60"
            >
              <IconMapPin className="-ml-1 mr-1.5 w-6" />
              {t('map.button')}
            </button>
          </div>

          {showMap && (
            <DynamicMap pictures={pictures} setShowMap={setShowMap} />
          )}
        </section>

        <section className="mt-16 flex items-center justify-center p-12">
          <Logo className="w-fit fill-white/5 xl:w-[60%]" />
        </section>
      </div>
    </>
  )
}

export async function getStaticProps({locales, defaultLocale}) {
  const heroImage = await getHeroImage()
  const sectionImages = await getSectionImages()
  const pictures = await getAllPictures()
  const picturesWithCoordinates = pictures.filter(
    ({coordinates}) => coordinates
  )
  const alternates = (await Promise.all(
    locales.map(await fromLocalesToAlternates({defaultLocale}))
  )) as Alternate[]

  return {
    props: {
      heroImage,
      sectionImages,
      pictures: picturesWithCoordinates,
      alternates
    }
  }
}

interface HomeProps {
  heroImage: HighlightedImage
  sectionImages: SectionImage[]
  pictures: RawPicture[]
  alternates: Alternate[]
}
