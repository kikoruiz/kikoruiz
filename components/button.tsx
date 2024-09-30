import {ButtonHTMLAttributes, PropsWithChildren} from 'react'
import {cva} from 'class-variance-authority'
import type {VariantProps} from 'class-variance-authority'

const buttonStyles = cva(
  'font-light bg-gradient-to-b transition-shadow drop-shadow-md',
  {
    variants: {
      intent: {
        light:
          'from-neutral-100 to-neutral-300 text-neutral-900 hover:ring-2 hover:ring-orange-300 hover:text-black hover:from-white hover:to-neutral-200',
        dark: 'from-neutral-800 to-neutral-900 text-neutral-300 hover:ring-1 hover:ring-orange-300/90 hover:text-white hover:to-black/30',
        accent:
          'from-orange-200 to-orange-400 text-orange-800 hover:ring-2 hover:ring-orange-200 hover:text-orange-900 hover:from-orange-300 hover:to-orange-500'
      },
      size: {
        small: 'py-1.5 px-3 text-xs',
        medium: 'py-1.5 px-3 text-sm',
        large: 'py-3 px-6 text-base leading-snug'
      },
      isRounded: {
        true: 'rounded-full'
      },
      isDisabled: {
        true: 'opacity-60 hover:ring-0 hover:ring-transparent hover:cursor-not-allowed'
      }
    },
    compoundVariants: [
      {
        size: 'small',
        isRounded: false,
        class: 'rounded-sm'
      },
      {
        size: 'medium',
        isRounded: false,
        class: 'rounded-md'
      },
      {
        size: 'large',
        isRounded: false,
        class: 'rounded-lg'
      }
    ]
  }
)

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonStyles>
>

export default function Button({
  children,
  title,
  size = 'medium',
  intent = 'dark',
  isRounded = false,
  disabled: isDisabled = false,
  className,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      title={title}
      className={buttonStyles({
        size,
        intent,
        isRounded,
        isDisabled,
        className
      })}
      onClick={!isDisabled ? onClick : () => {}}
    >
      {children}
    </button>
  )
}
