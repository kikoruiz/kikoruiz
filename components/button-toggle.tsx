import {PropsWithChildren} from 'react'

interface ButtonToggleProps extends PropsWithChildren {
  onClick: () => void
  label: string
  isToggled: boolean
  isDisabled?: boolean
}

export default function ButtonToggle({
  children,
  onClick,
  label,
  isToggled,
  isDisabled = false
}: ButtonToggleProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex appearance-none items-center border border-neutral-700 px-3 py-1.5 text-xs font-light shadow-sm first-of-type:rounded-l-full last-of-type:ml-[-1px] last-of-type:rounded-r-full hover:z-0 ${
        isToggled
          ? 'bg-neutral-800/50 text-neutral-300/40 hover:border-neutral-300/30 hover:text-neutral-300/60'
          : 'bg-neutral-800 text-neutral-300/60 hover:border-orange-300/60 hover:text-orange-300'
      }${isDisabled ? ' pointer-events-none cursor-default' : ''}`}
    >
      {children}
    </button>
  )
}
