import {useState} from 'react'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import {useShoppingCart} from 'use-shopping-cart'
import ShoppingCartItem from './shopping-cart-item'
import Button from './button'
import {REQUEST_STATUS_OPTIONS} from 'config'
import IconShoppingCart from 'assets/icons/shopping-cart.svg'
import IconArrowLeft from 'assets/icons/arrow-left.svg'
import IconArrowRight from 'assets/icons/arrow-right.svg'
import IconArrowPath from 'assets/icons/arrow-path.svg'
import {fetcher} from 'lib/utils'
import {trackEvent} from 'lib/tracking'

export default function ShoppingCartModal() {
  const {t} = useTranslation('store')
  const {locale} = useRouter()
  const {
    shouldDisplayCart,
    cartCount,
    cartDetails,
    handleCloseCart,
    totalPrice,
    currency
  } = useShoppingCart()
  const [status, setStatus] = useState(REQUEST_STATUS_OPTIONS.IDLE)
  const cartItems = Object.values(cartDetails ?? {})
  const isCartEmpty = cartCount === 0 && !cartItems.length
  const isCheckoutLoading = status === REQUEST_STATUS_OPTIONS.PENDING

  async function handleCheckoutClick() {
    try {
      setStatus(REQUEST_STATUS_OPTIONS.PENDING)

      const session = await fetcher.post(
        `/api/store/checkout/create-session?locale=${locale}`,
        {
          body: JSON.stringify(cartDetails)
        }
      )

      if (session?.url) {
        trackEvent({
          action: 'begin_checkout',
          value: totalPrice,
          currency: currency.toUpperCase(),
          items: Object.keys(cartDetails).map(id => {
            const item = cartDetails[id]
            const {id: productId} = item.product_data as {id: string}

            return {
              id: productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity
            }
          })
        })
        window.location.replace(session.url)
      }
    } catch (error) {
      setStatus(REQUEST_STATUS_OPTIONS.REJECTED)
      console.error(error)
    }
  }

  return (
    <div
      className={`fixed inset-0 z-20 h-screen w-screen overflow-hidden ${shouldDisplayCart ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <button
        aria-hidden="true"
        tabIndex={-1}
        className={`absolute inset-0 z-0 h-full w-full bg-neutral-900/60 backdrop-blur transition-opacity ${shouldDisplayCart ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => {
          handleCloseCart()
        }}
      ></button>

      <div
        className={`absolute top-0 right-0 w-full sm:w-2/3 md:w-1/2 xl:w-1/3 h-full overflow-hidden drop-shadow-lg transition-transform duration-500 ease-in-out ${shouldDisplayCart ? '' : 'translate-x-full'}`}
      >
        <div className="flex flex-col items-center justify-between gap-9 h-full overflow-y-auto p-6 bg-gradient-to-t from-neutral-900 to-neutral-800">
          <header className="relative flex items-center gap-3 w-full">
            <button
              aria-label={t('back-to-store')}
              title={t('back-to-store')}
              className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-t from-neutral-600/30 text-neutral-400 hover:text-orange-200 focus:outline-none"
              onClick={() => {
                handleCloseCart()
              }}
            >
              <span className="sr-only">{t('back-to-store')}</span>

              <IconArrowLeft className="w-5" />
            </button>

            <div className="flex justify-center w-full py-3 px-14">
              <span className="flex justify-center items-center gap-3 bg-gradient-to-t from-orange-400/90 to-orange-200 bg-clip-text text-3xl font-black leading-tight text-transparent drop-shadow">
                <IconShoppingCart className="size-7 text-neutral-300/30" />

                {t('shopping-cart.title')}
              </span>
            </div>
          </header>

          <div
            className={`flex flex-col justify-center items-center w-full ${isCartEmpty ? '' : 'relative after:absolute after:left-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:top-[-1px] after:via-neutral-300/30'}`}
          >
            {isCartEmpty ? (
              <span className="text-xl font-thin">
                {t('shopping-cart.empty')}
              </span>
            ) : (
              <>
                {cartItems.map(cartItem => (
                  <ShoppingCartItem
                    key={cartItem.id}
                    {...cartItem}
                    isCheckoutLoading={isCheckoutLoading}
                  />
                ))}
              </>
            )}
          </div>

          <footer className="flex flex-col justify-center items-center gap-9 p-6 w-full">
            {isCartEmpty ? (
              <Button
                isRounded
                title={t('back-to-store')}
                className="inline-flex items-center w-fit"
                onClick={() => {
                  handleCloseCart()
                }}
              >
                <IconArrowLeft className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                {t('back-to-store')}
              </Button>
            ) : (
              <>
                <div className="font-light text-neutral-300/30">
                  {t('shopping-cart.notice-before-checkout')}
                </div>

                <div className="flex w-full justify-between items-center gap-3">
                  <div className="text-3xl font-thin text-orange-300">
                    {t('shopping-cart.subtotal')}:{' '}
                    <span className="font-black">
                      {t('price', {count: totalPrice})}
                    </span>
                  </div>

                  <Button
                    title="Checkout"
                    intent="light"
                    size="large"
                    className="flex items-center gap-1.5"
                    onClick={handleCheckoutClick}
                    disabled={isCheckoutLoading}
                  >
                    Checkout
                    {isCheckoutLoading ? (
                      <IconArrowPath className="size-5 animate-spin" />
                    ) : (
                      <IconArrowRight className="size-5" />
                    )}
                  </Button>
                </div>
              </>
            )}
          </footer>
        </div>
      </div>
    </div>
  )
}

ShoppingCartModal.displayName = 'ShoppingCartModal'
