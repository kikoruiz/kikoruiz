import {ButtonHTMLAttributes, PropsWithChildren} from 'react'

type NavigationButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
>

export default function NavigationButton({
  children,
  title,
  className,
  onClick = () => {},
  onBlur = () => {}
}: NavigationButtonProps) {
  return (
    <button
      aria-label={title}
      title={title}
      className={`flex h-11 w-11 rounded-full bg-gradient-to-t text-neutral-400 focus:outline-none${className ? ` ${className}` : ''}`}
      onClick={onClick}
      onBlur={onBlur}
    >
      <span className="sr-only">{title}</span>
      <div className="w-5">{children}</div>
    </button>
  )
}
