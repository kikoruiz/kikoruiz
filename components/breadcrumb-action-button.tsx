import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  FC,
  PropsWithChildren,
  SVGProps
} from 'react'

interface BreadcrumbActionButtonProps
  extends PropsWithChildren<
    Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'className'> &
      Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>
  > {
  icon: FC<SVGProps<SVGSVGElement>>
  title: string
  bagdeContent?: string | number
}

export default function BreadcrumbActionButton({
  icon: Icon,
  title,
  bagdeContent,
  children,
  onClick,
  href,
  className
}: BreadcrumbActionButtonProps) {
  const sharedClassName = `group flex items-center p-2 rounded-full bg-neutral-900/60 leading-none drop-shadow ring-1 ring-neutral-700/90 hover:ring-orange-300 transition-shadow${className ? ` ${className}` : ''}`
  const content = (
    <>
      <div className="relative">
        <Icon className="w-4 fill-orange-300" />

        <span className="empty:hidden absolute -top-[75%] -right-[75%] rounded-full drop-shadow-lg bg-gradient-to-tl from-neutral-600 to-neutral-800 px-1.5 py-1 leading-none font-light text-[.5em] text-neutral-300/60 group-hover:text-orange-300">
          {bagdeContent}
        </span>
      </div>

      <span className="empty:hidden text-[.75em] font-light text-neutral-300/60">
        {children ?? title}
      </span>
    </>
  )

  // A real `<a>` lets the browser handle this on its own, right click, cmd
  // click and all, instead of a click handler faking navigation with
  // `window.location.href`.
  return href ? (
    <a className={sharedClassName} title={title} href={href}>
      {content}
    </a>
  ) : (
    <button className={sharedClassName} title={title} onClick={onClick}>
      {content}
    </button>
  )
}

BreadcrumbActionButton.displayName = 'BreadcrumbActionButton'
