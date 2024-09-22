import {useState} from 'react'
import useTranslation from 'next-translate/useTranslation'
import Logo from 'assets/brand/logo.svg'
import HomeSections from 'components/home-sections'
import {SectionImage} from 'types'
import {HighlightedImage} from 'types/gallery'

interface HomeHeaderProps {
  sectionImages: SectionImage[]
  averageColor: HighlightedImage['averageColor']
}

export default function HomeHeader({
  sectionImages,
  averageColor
}: HomeHeaderProps) {
  const {t} = useTranslation('home')
  const [collapseSections, setCollapseSections] = useState(false)

  return (
    <header className="relative rounded bg-gradient-to-br from-neutral-900/60 to-neutral-900/30 px-3 pb-6 pt-12 text-white/90 md:px-6">
      <div className="flex flex-col xl:flex-row xl:justify-center items-center mb-6 xl:mb-9 break-words">
        <Logo className="mb-3 w-24 fill-current xl:mb-0 xl:mr-6" />

        <h1 className="break-words text-center text-4xl font-black leading-tight drop-shadow sm:text-5xl sm:leading-normal xl:text-6xl">
          Kiko Ruiz <span className="font-thin">{t('title-addon')}</span>
        </h1>
      </div>

      <HomeSections
        images={sectionImages}
        averageColor={averageColor}
        isCollapsed={collapseSections}
      />

      <button
        aria-label={t(
          collapseSections ? 'sections.uncollapse' : 'sections.collapse'
        )}
        title={t(
          collapseSections ? 'sections.uncollapse' : 'sections.collapse'
        )}
        className="group absolute top-3 right-3 scale-75 opacity-75 flex h-11 w-11 rounded-full bg-gradient-to-t from-neutral-800 text-neutral-400 drop-shadow-xl hover:text-neutral-300 focus:outline-none"
        onClick={() => {
          setCollapseSections(!collapseSections)
        }}
      >
        <span className="sr-only">
          {t(collapseSections ? 'sections.uncollapse' : 'sections.collapse')}
        </span>

        <div className="absolute left-1/2 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 transform">
          <span
            aria-hidden="true"
            className={`absolute flex h-0.5 w-5 transform bg-current group-hover:bg-current transition-all duration-300 ${collapseSections ? '-translate-y-1/2' : '-translate-y-1/2 -rotate-90 opacity-0'}`}
          ></span>

          <span
            aria-hidden="true"
            className={`absolute flex h-0.5 w-5 transform bg-current group-hover:bg-current transition-all duration-300 ${collapseSections ? '-translate-y-1/2 rotate-90' : '-translate-y-1/2 rotate-0'}`}
          ></span>
        </div>
      </button>
    </header>
  )
}
