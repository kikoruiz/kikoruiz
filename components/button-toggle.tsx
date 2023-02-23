export default function ButtonToggle({
  children,
  onClick,
  label,
  isToggled
}: ButtonToggleProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex appearance-none items-center border border-neutral-700 py-1.5 px-3 text-xs font-light shadow-sm first:rounded-l-full last:ml-[-1px] last:rounded-r-full hover:z-0 ${
        isToggled
          ? 'bg-neutral-800/50 text-neutral-300/40 hover:border-neutral-300/30 hover:text-neutral-300/60'
          : 'bg-neutral-800 text-neutral-300/60 hover:border-orange-300/60 hover:text-orange-300'
      }`}
    >
      {children}
    </button>
  )
}

interface ButtonToggleProps {
  children: JSX.Element
  onClick: () => void
  label: string
  isToggled: boolean
}
