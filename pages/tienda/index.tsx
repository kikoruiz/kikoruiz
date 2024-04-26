import useTranslation from 'next-translate/useTranslation'
import getT from 'next-translate/getT'
import {Alternate} from 'types'
import {fromLocalesToAlternates} from 'lib/mappers'
import {getSlug, themeScreens} from 'lib/utils'
import {getImagePlaceholder} from 'lib/utils/image'
import StorePage from 'components/store-page'
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

  return (
    <StorePage
      title={t('sections.store.name')}
      description={t('sections.store.description')}
      alternates={alternates}
      isIndex
    >
      <section className="px-3">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 xl:gap-4 space-y-3 xl:space-y-4">
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
    </StorePage>
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
