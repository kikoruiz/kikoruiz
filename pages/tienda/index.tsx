import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import getT from 'next-translate/getT'
import {Alternate} from 'types'
import {fromLocalesToAlternates} from 'lib/mappers'
import {getSlug, themeScreens} from 'lib/utils'
import {getImagePlaceholder} from 'lib/utils/image'
import PictureCard from 'components/picture-card'
import {SECTIONS} from 'config'
import {Image} from 'types/gallery'

type StoreCategory = {
  id: string
  href: string
  title: string
  image: Image
}

interface StoreProps {
  alternates: Alternate[]
  categories: StoreCategory[]
}

export default function Store({alternates, categories}: StoreProps) {
  const {sm, lg} = themeScreens
  const {t} = useTranslation()
  const title = t('sections.store.name')

  return (
    <>
      <Head>
        <title>{`Kiko Ruiz / ${t('sections.store.name')}`}</title>
        <meta name="description" content={t('sections.store.description')} />
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <header className="mt-9 px-6 text-center sm:-mt-3 mb-9 sm:mb-12">
        <div className="flex flex-col items-center justify-center gap-y-3 sm:flex-row">
          <h1
            className="bg-gradient-to-t to-neutral-900 bg-clip-text text-6xl font-black leading-tight text-transparent drop-shadow sm:text-8xl sm:leading-tight from-orange-300"
            title={title}
          >
            {title}
          </h1>
        </div>

        <div className="relative after:absolute after:left-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent pb-6 after:bottom-[-1px] after:via-orange-300/60">
          <p className="mt-3 font-light text-neutral-300/60">
            {t('sections.store.description')}
          </p>
        </div>
      </header>

      <section className="px-3">
        <div className="columns-1 gap-3 space-y-3 pb-3 sm:columns-2 lg:columns-3 xl:gap-4 xl:space-y-4 xl:pb-4">
          {categories.map(({id, href, title, image}) => (
            <PictureCard
              key={id}
              aspectRatio="1:1"
              title={title}
              url={href}
              image={image}
              sizes={`(min-width: ${lg}) 33vw, (min-width: ${sm}) 50vw, 100vw`}
              needsPreload
              isAlbum
            />
          ))}
        </div>
      </section>
    </>
  )
}

export async function getStaticProps({locale, locales, defaultLocale}) {
  const section = 'store'
  const alternates = await Promise.all(
    locales.map(await fromLocalesToAlternates({defaultLocale, section}))
  )
  const t = await getT(locale, 'common')
  const store = SECTIONS.find(({id}) => id === section)
  const categories = await Promise.all(
    store.categories.map(async ({id}): Promise<StoreCategory> => {
      const slug = getSlug(t(`${store.localePrefix}${id}.name`))
      const src = `/store/${id}.jpg`
      const {css} = await getImagePlaceholder(src)

      return {
        id,
        href: `/${getSlug(t(`sections.${section}.name`))}/${slug}`,
        title: t(`${store.localePrefix}${id}.name`),
        image: {src, css}
      }
    })
  )

  return {
    props: {section, alternates, categories}
  }
}
