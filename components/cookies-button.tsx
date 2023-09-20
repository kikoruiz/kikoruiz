import {ButtonHTMLAttributes, PropsWithChildren} from 'react'
import {cva} from 'class-variance-authority'
import type {VariantProps} from 'class-variance-authority'

const cookiesButtonStyles = cva(
  'rounded font-light bg-gradient-to-b transition-shadow drop-shadow-md',
  {
    variants: {
      intent: {
        light:
          'from-neutral-100 to-neutral-300 text-neutral-900 hover:ring-2 hover:ring-orange-300 hover:text-black hover:from-white hover:to-neutral-200',
        dark: 'from-neutral-800 to-neutral-900 text-neutral-300 hover:ring-1 hover:ring-orange-300/90 hover:text-white hover:to-black/30 hover:drop-shadow-xl'
      },
      size: {
        medium: 'py-1.5 px-3 text-sm',
        large: 'py-3 px-6 text-base leading-snug'
      }
    }
  }
)

type CookiesButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof cookiesButtonStyles>
>

export default function CookiesButton({
  children,
  title,
  size = 'medium',
  intent = 'dark',
  ...props
}: CookiesButtonProps) {
  return (
    <button
      {...props}
      title={title}
      className={cookiesButtonStyles({size, intent})}
    >
      {children}
    </button>
  )
}
