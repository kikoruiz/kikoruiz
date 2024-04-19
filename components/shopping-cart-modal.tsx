import useTranslation from 'next-translate/useTranslation'
import {useShoppingCart} from 'use-shopping-cart'
import ShoppingCartItem from './shopping-cart-item'
import Button from './button'
import IconArrowLeft from 'assets/icons/arrow-left.svg'
import IconArrowRight from 'assets/icons/arrow-right.svg'

function ShoppingCartModal() {
  const {t} = useTranslation('store')
  const {
    shouldDisplayCart,
    cartCount,
    cartDetails,
    handleCloseCart,
    totalPrice
  } = useShoppingCart()
  const cartItems = Object.values(cartDetails ?? {})
  const isCartEmpty = cartCount === 0 && !cartItems.length
  console.log({shouldDisplayCart})

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
        <div className="flex flex-col items-center justify-between gap-6 h-full overflow-y-auto p-9 bg-gradient-to-t from-neutral-900 to-neutral-800">
          <header className="relative px-11 flex items-center justify-center gap-3 w-full">
            <button
              aria-label="Back to store"
              title="Back to store"
              className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-t from-neutral-600/30 text-neutral-400 hover:text-orange-200 focus:outline-none"
              onClick={() => {
                handleCloseCart()
              }}
            >
              <span className="sr-only">Back to store</span>
              <div className="w-5">
                <IconArrowLeft />
              </div>
            </button>

            <span className="bg-gradient-to-t from-orange-400/90 to-orange-200 bg-clip-text text-3xl font-black leading-tight text-transparent drop-shadow">
              Shopping cart
            </span>
          </header>

          <div
            className={`flex flex-col justify-center items-center w-full ${isCartEmpty ? '' : 'relative after:absolute after:left-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:top-[-1px] after:via-neutral-300/30'}`}
          >
            {isCartEmpty ? (
              'Your cart is empty.'
            ) : (
              <>
                {cartItems.map(cartItem => (
                  <ShoppingCartItem key={cartItem.id} {...cartItem} />
                ))}
              </>
            )}
          </div>

          <footer className="flex flex-col justify-center items-center gap-9 p-6 w-full">
            {isCartEmpty ? (
              <Button
                isRounded
                title="Back to store"
                className="inline-flex items-center w-fit"
                onClick={() => {
                  handleCloseCart()
                }}
              >
                <IconArrowLeft className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                Back to store
              </Button>
            ) : (
              <>
                <div className="mt-3 font-light text-neutral-300/30">
                  Shipping and taxes will be calculated at checkout.
                </div>

                <div className="flex w-full justify-between items-center">
                  <div className="text-3xl font-thin text-orange-300">
                    Subtotal:{' '}
                    <span className="font-black">
                      {t('price', {count: totalPrice})}
                    </span>
                  </div>

                  <Button
                    title="Checkout"
                    intent="light"
                    size="large"
                    className="flex items-center gap-1.5"
                  >
                    Checkout
                    <IconArrowRight className="size-5" />
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

export default ShoppingCartModal
