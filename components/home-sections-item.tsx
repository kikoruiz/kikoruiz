import {getReadableTextClassName} from 'lib/utils/color'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import {getCapitalizedName, getSlug} from 'lib/utils'
import Image from './image'
import sectionIcons from './section-icons'
import {SectionImage} from 'types'
import {ImageAverageColor} from 'types/gallery'

interface HomeSectionsItemProps extends SectionImage {
  averageColor?: ImageAverageColor
  isCollapsed: boolean
}

export default function HomeSectionsItem({
  id,
  src,
  css,
  sizes,
  averageColor = {
    hex: '#262626',
    isDark: true,
    isLight: false
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
        className={`flex w-full flex-col justify-between bg-white/30 p-[1px] font-extralight transition-colors ${
          averageColor.isDark ? 'hover:!bg-orange-300' : 'hover:!bg-neutral-300'
        }`}
        style={{
          backgroundColor: averageColor.hex,
          color: averageColor.hex,
          WebkitMaskImage:
            'linear-gradient(to top, rgba(0, 0, 0, 1) 100%, transparent 100%)'
        }}
      >
        <header
          className={`flex flex-col items-center px-0 py-3 group-hover:text-current md:p-6 lg:items-start xl:p-5 ${getReadableTextClassName(
            averageColor.hex
          )}`}
        >
          <div className="-ml-1.5 flex font-semibold sm:text-base md:ml-0 md:text-2xl xl:text-3xl">
            <Icon className="mr-1 w-5 md:mr-1.5 md:w-7 xl:mr-2 xl:w-8" />

            {sectionName}
          </div>

          <p className="mt-3 hidden text-sm font-light lg:flex xl:text-base">
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
