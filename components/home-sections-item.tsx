import {useEffect, useRef, useState} from 'react'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import {useMediaQuery} from 'react-responsive'
import {getCapitalizedName, getSlug, screens} from 'lib/utils'
import Image from './image'
import sectionIcons from './section-icons'
import {SectionImage} from 'types'
import {ImageAverageColor} from 'types/gallery'

interface HomeSectionsItemProps extends SectionImage {
  averageColor?: ImageAverageColor
  isCollapsed: boolean
}

const {sm, md, lg, xl} = screens

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
  const imageRef = useRef(null)
  const [imageHeight, setImageHeight] = useState('')

  function handleMediaChange() {
    const imageHeight = imageRef.current?.offsetHeight

    if (imageHeight > 0) {
      setImageHeight(imageRef.current?.offsetHeight)
    }
  }

  useMediaQuery({minWidth: sm}, undefined, handleMediaChange)
  useMediaQuery({minWidth: md}, undefined, handleMediaChange)
  useMediaQuery({minWidth: lg}, undefined, handleMediaChange)
  useMediaQuery({minWidth: xl}, undefined, handleMediaChange)

  useEffect(() => {
    setImageHeight(imageRef.current?.offsetHeight)
  }, [imageRef])

  return (
    <Link
      href={href}
      title={sectionName}
      aria-label={sectionName}
      className="group flex flex-1 overflow-hidden drop-shadow-sm first:rounded-tl-xl [&:nth-child(2)]:rounded-bl-xl [&:nth-child(3)]:rounded-tr-xl last:rounded-br-xl md:first:rounded-l-xl md:[&:nth-child(2)]:rounded-none md:[&:nth-child(3)]:rounded-none md:last:rounded-r-xl"
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
          className={`flex flex-col items-center px-0 pt-4 group-hover:text-current md:p-6 lg:items-start xl:p-5 ${
            averageColor.isDark ? 'text-orange-300' : 'text-neutral-300'
          }`}
        >
          <div className="-ml-1.5 flex font-semibold sm:text-base md:ml-0 md:text-2xl xl:text-3xl">
            <Icon className="mr-1 w-5 md:mr-1.5 md:w-7 xl:mr-2 xl:w-8" />
            {sectionName}
          </div>

          <p className="mt-3 hidden text-sm font-light opacity-75 lg:flex xl:text-base">
            {t(`sections.${id}.description`)}
          </p>
        </header>

        <Image
          ref={imageRef}
          src={src}
          alt={sectionName}
          className="transition-all h-auto aspect-square w-full overflow-hidden group-first:rounded-tl-xl group-[&:nth-child(2)]:rounded-bl-xl group-[&:nth-child(3)]:rounded-tr-xl group-last:rounded-br-xl md:group-first:rounded-l-xl md:group-[&:nth-child(2)]:rounded-none md:group-[&:nth-child(3)]:rounded-none md:group-last:rounded-r-xl"
          style={{
            WebkitMaskImage:
              'linear-gradient(to top, rgba(0, 0, 0, 1) 75%, transparent 100%)',
            height: isCollapsed ? 0 : imageHeight,
            opacity: isCollapsed ? 0 : 100
          }}
          fallbackStyle={css}
          sizes={sizes}
          needsPreload
        />
      </article>
    </Link>
  )
}
