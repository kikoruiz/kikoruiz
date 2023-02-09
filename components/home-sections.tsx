import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import {getSlug} from 'lib/utils'
import Image from './image'
import {SectionImage} from 'types'
import {ImageAverageColor} from 'types/gallery'
import IconFingerPrint from 'assets/icons/finger-print.svg'
import IconPhoto from 'assets/icons/photo.svg'
import IconDocumentText from 'assets/icons/document-text.svg'

const icons = {
  'about-me': IconFingerPrint,
  gallery: IconPhoto,
  blog: IconDocumentText
}

export default function HomeSections({
  images,
  averageColor
}: HomeSectionsProps) {
  const {t} = useTranslation()

  return (
    <section className="rounded bg-neutral-900/60 p-1">
      <div className="flex justify-center gap-1">
        {images.map(({id, src, css, sizes}) => {
          const href = `/${getSlug(t(`sections.${id}.name`))}`
          const sectionName = t(`sections.${id}.name`)
          const Icon = icons[id]

          return (
            <Link
              key={id}
              href={href}
              title={sectionName}
              aria-label={sectionName}
              className="group flex flex-1 overflow-hidden drop-shadow-sm first:rounded-l-sm last:rounded-r-sm"
            >
              <article
                className={`flex w-full flex-col justify-between bg-white/30 p-[1px] font-extralight ${
                  averageColor.isDark
                    ? 'hover:!bg-orange-300'
                    : 'hover:!bg-neutral-300'
                }`}
                style={{
                  backgroundColor: averageColor.hex,
                  color: averageColor.hex
                }}
              >
                <header
                  className={`flex flex-col items-center px-0 pt-3 pb-1.5 group-hover:text-current sm:p-3 md:items-start md:py-4 xl:py-5 ${
                    averageColor.isDark ? 'text-orange-300' : 'text-neutral-300'
                  }`}
                >
                  <div className="flex md:text-2xl xl:text-3xl">
                    <Icon className="mr-1.5 w-5 md:w-6 xl:w-8" />
                    {sectionName}
                  </div>
                  <p className="mt-3 hidden text-sm font-light opacity-75 lg:flex xl:text-base">
                    {t(`sections.${id}.description`)}
                  </p>
                </header>
                <Image
                  src={src}
                  alt={sectionName}
                  className="aspect-square w-full overflow-hidden group-first:rounded-bl-sm group-last:rounded-br-sm"
                  style={{
                    WebkitMaskImage:
                      'linear-gradient(to top, rgba(0, 0, 0, 1) 60%, transparent 100%)'
                  }}
                  fallbackStyle={css}
                  sizes={sizes}
                  needsPreload
                />
              </article>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

interface HomeSectionsProps {
  images: SectionImage[]
  averageColor: ImageAverageColor
}
