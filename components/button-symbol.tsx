import {ButtonHTMLAttributes, PropsWithChildren} from 'react'

type ButtonSymbolProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
>

export default function ButtonSymbol({
  title,
  children,
  disabled: isDisabled,
  onClick
}: ButtonSymbolProps) {
  return (
    <button
      title={title}
      className={`text-sm size-6 rounded-full bg-gradient-to-b from-neutral-600 text-neutral-300/60 transition-colors ${isDisabled ? 'cursor-not-allowed' : 'hover:text-neutral-100 hover:from-neutral-600/80'}`}
      onClick={!isDisabled ? onClick : () => {}}
    >
      <span aria-hidden className="sr-only">
        {title}
      </span>

      {children}
    </button>
  )
}
