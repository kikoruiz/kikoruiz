import useTranslation from 'next-translate/useTranslation'
import {useShoppingCart} from 'use-shopping-cart'
import {CartEntry} from 'use-shopping-cart/core'
import {GetPlaiceholderReturn} from 'plaiceholder'
import Image from './image'
import ButtonSymbol from './button-symbol'
import IconTrash from 'assets/icons/trash.svg'
import {DEFAULT_UNIT_OF_MEASUREMENT, PRINT_SIZES} from 'config/store'
import papers from 'data/store/papers.json'
import {themeScreens} from 'lib/utils'

interface ShoppingCartItemProps extends CartEntry {
  isCheckoutLoading?: boolean
}
interface ProductDataInterface {
  image: {
    aspectRatio: string
    css: GetPlaiceholderReturn['css']
  }
  metadata: {
    type: string
    paper: string
    size: string
    isBorderless: boolean
  }
}

export default function ShoppingCartItem({
  id,
  name,
  image: src,
  quantity,
  value,
  product_data: productData,
  isCheckoutLoading = false
}: ShoppingCartItemProps) {
  const {t} = useTranslation('store')
  const {sm} = themeScreens
  const {decrementItem, incrementItem, removeItem} = useShoppingCart()
  const {
    image,
    metadata: {size, paper, isBorderless}
  } = productData as ProductDataInterface
  const paperData = papers[paper]
  const paperName = `${paperData.brand} ${paperData.type}`

  return (
    <div className="relative flex flex-row items-start gap-3 md:gap-6 w-full py-6 sm:p-6 after:absolute after:left-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:bottom-[-1px] after:via-neutral-300/30 hover:bg-neutral-600/10 hover:rounded transition-colors">
      <div
        className={`relative w-1/3 bg-gradient-to-bl from-neutral-600 via-neutral-200 to-neutral-400 drop-shadow-md${isBorderless ? '' : ' p-5'}`}
      >
        <Image
          src={src}
          alt={name}
          aspectRatio={image.aspectRatio}
          sizes={`(min-width: ${sm}) 50vw, 100vw`}
          fallbackStyle={image.css}
        />
      </div>

      <div className="flex flex-col justify-between grow text-lg h-full">
        <div className="flex justify-between items-baseline gap-3">
          <div>
            <header className="font-extralight -translate-y-0.5">{name}</header>

            <dl className="text-xs my-3 opacity-90">
              <dt className="font-light text-neutral-300/30">{t('size')}</dt>
              <dd className="font-medium text-neutral-300/60">
                {size}
                {isBorderless &&
                  ` ${t('store:filters.borderless').toLowerCase()}`}{' '}
                <span className="font-thin">
                  ({PRINT_SIZES[size][DEFAULT_UNIT_OF_MEASUREMENT]}{' '}
                  {DEFAULT_UNIT_OF_MEASUREMENT})
                </span>
              </dd>
              <dt className="mt-1.5 font-light text-neutral-300/30">
                {t('paper')}
              </dt>
              <dd className="font-medium text-neutral-300/60">{paperName}</dd>
            </dl>
          </div>

          <button
            title="Remove item"
            className={`p-1.5 border border-red-600/30 rounded-full scale-90 ${isCheckoutLoading ? 'opacity-60 cursor-not-allowed' : 'group hover:border-red-600/60'}`}
            onClick={() => {
              if (!isCheckoutLoading) removeItem(id)
            }}
            disabled={isCheckoutLoading}
          >
            <IconTrash className="size-4 text-red-600/60 group-hover:text-red-600/90" />
          </button>
        </div>

        <div className="flex items-end justify-between">
          <span className="font-black text-xl text-orange-300 leading-none">
            {t('price', {count: value})}
          </span>

          <div
            className={`flex items-center gap-1.5 rounded-full border border-neutral-600 p-1${isCheckoutLoading ? ' opacity-60' : ''}`}
          >
            <ButtonSymbol
              title="Decrease quantity"
              onClick={() => {
                decrementItem(id)
              }}
              disabled={isCheckoutLoading}
            >
              -
            </ButtonSymbol>

            <span className="text-xs">{quantity}</span>

            <ButtonSymbol
              title="Increase quantity"
              onClick={() => {
                incrementItem(id)
              }}
              disabled={isCheckoutLoading}
            >
              +
            </ButtonSymbol>
          </div>
        </div>
      </div>
    </div>
  )
}
