import {ReactNode, useRef} from 'react'
import {CartProvider} from 'use-shopping-cart'

interface StoreCartProviderProps {
  isActive: boolean
  children: ReactNode
}

export default function StoreCartProvider({
  isActive,
  children
}: StoreCartProviderProps) {
  const everActive = useRef(isActive)
  if (isActive) everActive.current = true

  if (!everActive.current) return <>{children}</>

  return (
    <CartProvider
      cartMode="checkout-session"
      stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string}
      currency="EUR"
      shouldPersist
    >
      {children}
    </CartProvider>
  )
}
