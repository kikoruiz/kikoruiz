import {useState} from 'react'
import useTranslation from 'next-translate/useTranslation'
import {useShoppingCart} from 'use-shopping-cart'
import Image from 'components/image'
import Button from 'components/button'
import Logo from 'assets/brand/photo-logo.svg'
import IconArrowTopRightOnSquare from 'assets/icons/arrow-top-right-on-square.svg'
import {getSlug, themeScreens} from 'lib/utils'
import {
  DEFAULT_UNIT_OF_MEASUREMENT,
  PRINT_PAPERS,
  PRINT_SIZES
} from 'config/store'
import {Print} from 'types/store'
import Link from 'next/link'
import {useRouter} from 'next/router'
import useLayoutContext from 'contexts/Layout'
import inventory from 'data/store/products.json'

export default function PrintCard({
  id,
  name,
  picture,
  price,
  image,
  aspectRatio,
  paper,
  size
}: Print) {
  const {locale, asPath} = useRouter()
  const [, hash] = asPath.split('#')
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const {t} = useTranslation('store')
  const {sm, lg} = themeScreens
  const {css, src, orientation} = image
  const paperData = PRINT_PAPERS.find(
    ({brand, type}) => paper === `${getSlug(brand)}-${getSlug(type)}`
  )
  const paperName = `${paperData.brand} ${paperData.type}`
  const isVertical = orientation === 'vertical'
  const {layout} = useLayoutContext()
  const headerHeight = layout?.headerHeight || 0
  const slug = getSlug(name)
  const isActive = slug === hash
  const {addItem, handleCartHover} = useShoppingCart()
  const {price_id: priceId} = inventory.find(product => product.id === id)

  return (
    <div
      key={id}
      className={`relative group h-fit p-3 bg-gradient-to-b from-neutral-800 via-neutral-800 to-bg-neutral-900 hover:bg-neutral-800 rounded-md${isActive ? ' ring-1 ring-inset ring-orange-300/60' : ''}`}
    >
      <span
        id={slug}
        aria-hidden="true"
        className="absolute"
        style={{top: `calc(-${headerHeight}px - 1.5em)`}}
      />
      <div className="relative bg-gradient-to-bl from-neutral-600 via-neutral-200 to-neutral-400 p-[10%] drop-shadow-md group-hover:from-neutral-100 group-hover:to-neutral-100 group-hover:drop-shadow-xl before:absolute before:z-10 before:content-[''] before:top-0 before:right-0 before:border-solid before:border-b-[.75em] before:border-r-[.75em] before:border-y-neutral-300/60 before:border-x-neutral-800 before:transition-[border-width] before:duration-300 group-hover:before:border-y-neutral-300/90 group-hover:before:border-x-neutral-800 group-hover:before:border-b-[1.5em] group-hover:before:border-r-[1.5em]">
        <Image
          src={src}
          alt={name}
          aspectRatio={aspectRatio}
          sizes={`(min-width: ${lg}) 33vw, (min-width: ${sm}) 50vw, 100vw`}
          fallbackStyle={css}
          onLoad={() => {
            setIsImageLoaded(true)
          }}
        />

        {isImageLoaded && (
          <Logo
            className={`absolute left-[calc(10%+1em)] fill-white/80 ${isVertical ? 'w-9 bottom-[calc(10%)]' : 'w-6 bottom-[calc(20%)]'}`}
          />
        )}
      </div>

      <div className="flex items-start justify-between mt-3 py-1.5 pl-1.5">
        <div className="flex flex-col gap-1.5">
          <header className="font-thin text-2xl">
            <Link href={picture} className="hover:text-neutral-100">
              {name}
            </Link>
          </header>

          <dl className="text-sm my-3">
            <dt className="font-light text-neutral-300/30">{t('size')}</dt>
            <dd className="font-medium text-neutral-300/60">
              {size}{' '}
              <span className="font-thin">
                ({PRINT_SIZES[size][DEFAULT_UNIT_OF_MEASUREMENT]}{' '}
                {DEFAULT_UNIT_OF_MEASUREMENT})
              </span>
            </dd>
            <dt className="font-light text-neutral-300/30">{t('paper')}</dt>
            <dd className="font-medium text-neutral-300/60">
              <Link
                href={paperData.url[locale]}
                target="_blank"
                className="flex items-center w-max underline hover:no-underline hover:text-neutral-300"
              >
                {paperName}
                <IconArrowTopRightOnSquare className="inline size-3 ml-1.5" />
              </Link>
            </dd>
          </dl>

          <span className="rounded-full font-black text-3xl text-orange-300 drop-shadow">
            {t('price', {count: price})}
          </span>
        </div>

        <Button
          intent="accent"
          isRounded
          title={t('add-to-cart')}
          onClick={() => {
            addItem(
              {
                id: priceId,
                name,
                price,
                image: src,
                currency: 'EUR',
                product_data: {
                  metadata: {pictureId: id, paper, size}
                }
              },
              {
                count: 1,
                product_metadata: {
                  image: {aspectRatio, css}
                }
              }
            )
            handleCartHover()
          }}
        >
          {t('add-to-cart')}
        </Button>
      </div>
    </div>
  )
}
