import {ReactNode, useState} from 'react'
import {CartProvider} from 'use-shopping-cart'

interface StoreCartProviderProps {
  isActive: boolean
  children: ReactNode
}

export default function StoreCartProvider({
  isActive,
  children
}: StoreCartProviderProps) {
  // A ref mutated in the render body leaks a stray write whenever React
  // discards a render without committing it, which state does not: it only
  // ever flips once, true to begin with or set here, and stays that way.
  const [everActive, setEverActive] = useState(isActive)
  if (isActive && !everActive) setEverActive(true)

  if (!everActive) return <>{children}</>

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
