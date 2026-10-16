import type {SectionPalette} from 'lib/utils/color'
import {CSSProperties} from 'react'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import {getCapitalizedName, getSlug} from 'lib/utils'
import Image from './image'
import sectionIcons from './section-icons'
import {SectionImage} from 'types'

interface HomeSectionsItemProps extends SectionImage {
  palette?: SectionPalette
  isCollapsed: boolean
}

export default function HomeSectionsItem({
  id,
  src,
  css,
  sizes,
  palette = {
    from: '#333333',
    to: '#171717',
    title: '#fdba74',
    description: '#d4d4d4'
  },
  isCollapsed
}: HomeSectionsItemProps) {
  const {t} = useTranslation()
  const href = `/${getSlug(t(`sections.${id}.name`))}`
  const sectionName = t(`sections.${id}.name`)
  const Icon = sectionIcons[`Icon${getCapitalizedName(id)}`]

  return (
    <Link
      href={href}
      title={sectionName}
      className="group flex flex-1 even:mt-1 md:even:mt-0 overflow-hidden shadow-sm first:rounded-tl-xl [&:nth-child(2)]:rounded-bl-xl [&:nth-child(3)]:rounded-tr-xl last:rounded-br-xl md:first:rounded-l-xl md:[&:nth-child(2)]:rounded-none md:[&:nth-child(3)]:rounded-none md:last:rounded-r-xl"
    >
      <article
        className="relative isolate flex w-full flex-col justify-between p-[1px] font-extralight"
        style={
          {
            '--section-ink': palette.to,
            '--section-title': palette.title,
            '--section-description': palette.description,
            backgroundColor: palette.title,
            WebkitMaskImage:
              'linear-gradient(to top, rgba(0, 0, 0, 1) 100%, transparent 100%)'
          } as CSSProperties
        }
      >
        {/* The gradient is a layer of its own so that the hover can fade it
            out to the orange behind it, which a background image on the card
            could not do. */}
        <span
          aria-hidden
          className="absolute inset-0 -z-10 transition-opacity duration-300 group-hover:opacity-0"
          style={{
            backgroundImage: `linear-gradient(160deg, ${palette.from} 0%, ${palette.to} 100%)`
          }}
        />

        <header className="relative flex flex-col items-center px-0 py-3 md:p-6 lg:items-start xl:p-5">
          <div className="-ml-1.5 flex font-semibold text-[color:var(--section-title)] transition-colors group-hover:text-[color:var(--section-ink)] sm:text-base md:ml-0 md:text-2xl xl:text-3xl">
            <Icon className="mr-1 w-5 md:mr-1.5 md:w-7 xl:mr-2 xl:w-8" />

            {sectionName}
          </div>

          <p className="mt-3 hidden text-sm font-light text-[color:var(--section-description)] transition-colors group-hover:text-[color:var(--section-ink)] lg:flex xl:text-base">
            {t(`sections.${id}.description`)}
          </p>
        </header>

        {/* The image keeps its natural square and the collapse travels a grid
            row, so there is no height to measure that could be taken at the
            wrong moment and stay wrong. */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
            isCollapsed
              ? 'grid-rows-[0fr] opacity-0'
              : 'grid-rows-[1fr] opacity-100'
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <Image
              src={src}
              alt=""
              className="transition-all duration-300 h-auto aspect-square w-full overflow-hidden group-first:rounded-tl-xl group-[&:nth-child(2)]:rounded-bl-xl group-[&:nth-child(3)]:rounded-tr-xl group-last:rounded-br-xl md:group-first:rounded-l-xl md:group-[&:nth-child(2)]:rounded-none md:group-[&:nth-child(3)]:rounded-none md:group-last:rounded-r-xl"
              style={{
                WebkitMaskImage:
                  'linear-gradient(to top, rgba(0, 0, 0, 1) 75%, transparent 100%)'
              }}
              fallbackStyle={css}
              sizes={sizes}
              needsPreload
            />
          </div>
        </div>
      </article>
    </Link>
  )
}

HomeSectionsItem.displayName = 'HomeSectionsItem'
