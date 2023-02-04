import Head from 'next/head'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import {Alternate, HeroImages} from 'types'
import {fromLocalesToAlternates} from 'lib/mappers'
import {getHeroImages} from 'lib/home'
import {getSlug} from 'lib/utils'
import Hero from 'components/hero'
import {SECTIONS} from 'config'
import useHeroContext from 'contexts/hero'
// import Logo from 'assets/brand/logo.svg'

export default function Home({heroImages, alternates}: HomeProps) {
  const {t} = useTranslation()
  const {hero} = useHeroContext()
  const {averageColor} = hero

  return (
    <>
      <Head>
        <title>Kiko Ruiz</title>
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <Hero images={heroImages} />

      <div className="p-3">
        <header className="mb-3 break-words rounded bg-gradient-to-b from-neutral-900/60 px-6 py-12 text-center">
          <h1 className="text-white/90 drop-shadow">
            <span className="break-words text-5xl font-black leading-[1.125]">
              Expresividad, visión y creación
            </span>
            <span className="block text-2xl font-thin">
              a través de la luz y el color
            </span>
          </h1>
        </header>

        <section className="rounded bg-neutral-900/80 p-1">
          <header
            className={`px-1 py-2 text-sm font-extralight ${
              averageColor.isDark ? 'text-orange-300/60' : 'text-neutral-300/60'
            }`}
          >
            Conoce las diferentes secciones...
          </header>

          <div className="flex justify-center gap-1">
            {SECTIONS.map(({id}) => {
              const href = `/${getSlug(t(`sections.${id}.name`))}`
              const sectionName = t(`sections.${id}.name`)

              return (
                <Link
                  key={id}
                  href={href}
                  title={sectionName}
                  aria-label={sectionName}
                  className={`group flex-1 bg-white/30 p-3 text-center text-xl font-extralight drop-shadow-sm first:rounded-l-sm last:rounded-r-sm ${
                    averageColor.isDark
                      ? 'hover:!bg-orange-300'
                      : 'hover:!bg-neutral-300'
                  }`}
                  style={{
                    backgroundColor: averageColor.hex,
                    color: averageColor.hex
                  }}
                >
                  <span
                    className={`group-hover:text-current ${
                      averageColor.isDark
                        ? 'text-orange-300'
                        : 'text-neutral-300'
                    }`}
                  >
                    {sectionName}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        {/* <section className="mt-12 flex items-center justify-center p-12">
          <Logo className="w-fit fill-white/5" />
        </section> */}
      </div>
    </>
  )
}

export async function getStaticProps({locales, defaultLocale}) {
  const heroImages = await getHeroImages()
  const alternates = (await Promise.all(
    locales.map(await fromLocalesToAlternates({defaultLocale}))
  )) as Alternate[]

  return {
    props: {heroImages, alternates}
  }
}

interface HomeProps {
  alternates: Alternate[]
  heroImages: HeroImages
}
