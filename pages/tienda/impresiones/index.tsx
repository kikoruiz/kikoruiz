import useTranslation from 'next-translate/useTranslation'
import {Alternate} from 'types'
import {fromLocalesToAlternates} from 'lib/mappers'
import {getPrints} from 'lib/store/prints'
import {themeScreens} from 'lib/utils'
import {Print} from 'types/store'
import Image from 'components/image'
import Button from 'components/button'
import Logo from 'assets/brand/photo-logo.svg'
import StorePage from 'components/store-page'

interface PrintsPageProps {
  alternates: Alternate[]
  prints: Print[]
}

export default function PrintsPage({alternates, prints}: PrintsPageProps) {
  const {sm, lg} = themeScreens
  const {t} = useTranslation()

  return (
    <StorePage
      title={t('store.categories.prints.name')}
      description={t('sections.store.description')}
      alternates={alternates}
    >
      <section className="px-6">
        <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3 xl:gap-12 xl:space-y-12">
          {prints.map(({id, name, url, price, image, aspectRatio}) => {
            const {css, src} = image

            return (
              <div
                key={id}
                className="group p-3 bg-white/5 hover:bg-white/10 rounded-md break-inside-avoid-column"
              >
                <div className="relative bg-gradient-to-bl from-neutral-600 via-neutral-200 to-neutral-400 p-[10%] drop-shadow-md group-hover:from-neutral-100 group-hover:to-neutral-100 group-hover:drop-shadow-xl">
                  <Image
                    src={src}
                    url={url}
                    alt={name}
                    aspectRatio={aspectRatio}
                    sizes={`(min-width: ${lg}) 33vw, (min-width: ${sm}) 50vw, 100vw`}
                    fallbackStyle={css}
                  />

                  <Logo className="absolute left-[calc(10%+1em)] bottom-[calc(10%)] w-9 fill-white/80" />
                </div>

                <div className="flex items-center justify-between mt-3 py-1.5 pl-1.5">
                  <span className="font-black text-xl group-hover:text-neutral-100 drop-shadow">
                    {t('store:price', {count: price})}
                  </span>

                  <Button
                    intent="accent"
                    className="snipcart-add-item"
                    data-item-id={id}
                    data-item-name={name}
                    data-item-price={price}
                    data-item-url={url}
                    data-item-image={src}
                  >
                    Add to cart
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </StorePage>
  )
}

export async function getStaticProps({locale, locales, defaultLocale}) {
  const section = 'store'
  const subSection = 'prints'
  const alternates = await Promise.all(
    locales.map(
      await fromLocalesToAlternates({
        defaultLocale,
        section,
        subSection
      })
    )
  )
  const prints = await getPrints({locale})

  return {
    props: {section, subSection, alternates, prints}
  }
}
