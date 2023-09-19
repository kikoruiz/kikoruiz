import {PropsWithChildren} from 'react'

export default function CookiesButton({
  children,
  title,
  ...props
}: PropsWithChildren<HTMLButtonElement>) {
  return (
    <button
      {...props}
      title={title}
      className="py-1.5 px-3 rounded font-light bg-gradient-to-b transition-shadow hover:ring hover:ring-orange-300 hover:text-black hover:from-white hover:to-neutral-200 from-neutral-100 to-neutral-300 text-neutral-900"
    >
      {children}
    </button>
  )
}
