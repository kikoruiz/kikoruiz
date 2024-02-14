import {useState} from 'react'
import useTranslation from 'next-translate/useTranslation'
import Image from 'components/image'
import Button from 'components/button'
import Logo from 'assets/brand/photo-logo.svg'
import {getSlug, themeScreens} from 'lib/utils'
import {
  DEFAULT_UNIT_OF_MEASUREMENT,
  PRINT_PAPERS,
  PRINT_SIZES
} from 'config/store'
import {Print} from 'types/store'
import Link from 'next/link'
import {useRouter} from 'next/router'

export default function PrintCard({
  id,
  name,
  url,
  price,
  image,
  aspectRatio,
  paper,
  size
}: Print) {
  const {locale} = useRouter()
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const {t} = useTranslation('store')
  const {sm, lg} = themeScreens
  const {css, src, orientation} = image
  const paperData = PRINT_PAPERS.find(
    ({brand, type}) => paper === `${getSlug(brand)}-${getSlug(type)}`
  )
  const paperName = `${paperData.brand} ${paperData.type}`
  const isVertical = orientation === 'vertical'
  const sizeLabel = `${size} (${PRINT_SIZES[size][DEFAULT_UNIT_OF_MEASUREMENT]} ${DEFAULT_UNIT_OF_MEASUREMENT})`

  return (
    <div
      key={id}
      className="group p-3 bg-gradient-to-b from-neutral-800 via-neutral-800 to-bg-neutral-900 hover:bg-neutral-800 rounded-md break-inside-avoid-column"
    >
      <div className="relative bg-gradient-to-bl from-neutral-600 via-neutral-200 to-neutral-400 p-[10%] drop-shadow-md group-hover:from-neutral-100 group-hover:to-neutral-100 group-hover:drop-shadow-xl before:absolute before:z-10 before:content-[''] before:top-0 before:right-0 before:border-solid before:border-b-[.75em] before:border-r-[.75em] before:border-y-neutral-300/60 before:border-x-neutral-800 before:transition-[border-width] before:duration-300 group-hover:before:border-y-neutral-300/90 group-hover:before:border-x-neutral-800 group-hover:before:border-b-[1.5em] group-hover:before:border-r-[1.5em]">
        <Image
          src={src}
          url={url}
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
          <header className="font-thin text-2xl">{name}</header>

          <dl className="text-sm my-3">
            <dt className="font-light text-neutral-300/40">{t('size')}</dt>
            <dd className="font-medium">{sizeLabel}</dd>

            <dt className="font-light text-neutral-300/40">{t('paper')}</dt>
            <dd className="font-medium">
              <Link href={paperData.url[locale]} target="_blank">
                {paperName}
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
          className="snipcart-add-item"
          title={t('add-to-cart')}
          data-item-id={id}
          data-item-name={name}
          data-item-price={price}
          data-item-url={url}
          data-item-image={src}
        >
          {t('add-to-cart')}
        </Button>
      </div>
    </div>
  )
}
