import {useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import {useShoppingCart} from 'use-shopping-cart'
import useLayoutContext from 'contexts/Layout'
import Image from 'components/image'
import Button from 'components/button'
import Logo from 'assets/brand/photo-logo.svg'
import {DEFAULT_CURRENCY} from 'config/store'
import {themeScreens} from 'lib/utils'
import {trackEvent} from 'lib/tracking'
import {Download, DownloadVariant} from 'types/store'

interface DownloadCardProps extends Download {
  variant: DownloadVariant
}

// The file on sale is a resize of the original, so the pixels advertised come
// from the picture itself instead of a number written down by hand.
function getResolution({
  imageSize,
  longestSide
}: {
  imageSize: string
  longestSide: number | null
}) {
  const [width, height] = imageSize.split('x').map(Number)

  if (!longestSide) return `${width} x ${height}`

  const ratio = longestSide / Math.max(width, height)

  return `${Math.round(width * ratio)} x ${Math.round(height * ratio)}`
}

export default function DownloadCard({
  id,
  name,
  slug,
  picture,
  image,
  aspectRatio,
  imageSize,
  variant
}: DownloadCardProps) {
  const {asPath} = useRouter()
  const [, hash] = asPath.split('#')
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const {t} = useTranslation('store')
  const {sm, lg} = themeScreens
  const {css, src} = image
  const {layout} = useLayoutContext()
  const headerHeight = layout?.headerHeight || 0
  const isActive = slug === hash
  const {addItem, handleCartHover} = useShoppingCart()
  const {id: variantId, tier, licence, longestSide, price, priceId} = variant
  const currency = DEFAULT_CURRENCY.toUpperCase()
  const resolution = getResolution({imageSize, longestSide})
  const productName = `${name} · ${t(`downloads.tiers.${tier}`)}`
  const addToCartText = t('add-to-cart')
  const isSoldOut = !priceId

  return (
    <div
      key={variantId}
      className={`relative group h-fit break-inside-avoid-column p-3 bg-gradient-to-b from-neutral-800 via-neutral-800 to-bg-neutral-900 hover:bg-neutral-800 rounded-md${isActive ? ' ring-1 ring-inset ring-orange-300/60' : ''}`}
    >
      <span
        id={slug}
        aria-hidden="true"
        className="absolute"
        style={{top: `calc(-${headerHeight}px - 1em)`}}
      />

      <div className="relative drop-shadow-md group-hover:drop-shadow-xl">
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
          <Logo className="absolute bottom-3 left-3 w-6 fill-white/80" />
        )}
      </div>

      <div className="flex items-start justify-between mt-3 py-1.5 pl-1.5">
        <div className="flex flex-col gap-1.5">
          <header className="font-thin text-2xl">
            <Link
              href={picture}
              className="hover:text-neutral-100"
              title={t('store:card.go-to-picture', {name})}
            >
              {name}
            </Link>
          </header>

          <dl className="text-sm my-3">
            <dt className="font-light text-neutral-300/30">
              {t('downloads.resolution')}
            </dt>
            <dd className="font-medium text-neutral-300/60">
              {resolution} <span className="font-thin">(px)</span>
            </dd>
            <dt className="font-light text-neutral-300/30">
              {t('downloads.licence')}
            </dt>
            <dd className="font-medium text-neutral-300/60">
              {t(`downloads.licences.${licence}`)}
            </dd>
          </dl>

          <span className="rounded-full font-black text-3xl text-orange-300 drop-shadow">
            {t('price', {count: price})}
          </span>
        </div>

        <Button
          intent="accent"
          isRounded
          disabled={isSoldOut}
          title={isSoldOut ? t('downloads.coming-soon') : addToCartText}
          onClick={() => {
            addItem(
              {
                id: priceId,
                name: productName,
                price,
                image: src,
                currency,
                product_data: {
                  metadata: {pictureId: id, tier, licence}
                }
              },
              {
                count: 1,
                product_metadata: {
                  id: variantId,
                  image: {aspectRatio, css}
                }
              }
            )
            handleCartHover()
            trackEvent({
              action: 'add_to_cart',
              value: price,
              currency,
              items: [{id: variantId, name: productName, price, quantity: 1}]
            })
          }}
        >
          {isSoldOut ? t('downloads.coming-soon') : addToCartText}
        </Button>
      </div>
    </div>
  )
}

DownloadCard.displayName = 'DownloadCard'
