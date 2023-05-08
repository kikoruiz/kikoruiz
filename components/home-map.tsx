import useTranslation from 'next-translate/useTranslation'
import {PictureOnMap} from 'types/gallery'
import Map from './map'

export default function HomeMap({pictures, setShowMap}: HomeMapProps) {
  const {t} = useTranslation()

  function handleMapClose() {
    setShowMap(false)
  }

  return (
    <div className="fixed inset-0 z-20 h-screen w-screen">
      <button
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 z-0 h-full w-full touch-auto bg-neutral-900/60 backdrop-blur transition-opacity"
        onClick={handleMapClose}
      ></button>

      <div className="container absolute inset-0 mx-auto overflow-hidden drop-shadow-xl sm:top-[6rem] sm:max-h-[calc(100%-12rem)] sm:rounded-lg">
        <button
          aria-label={t('map.close')}
          title={t('map.close')}
          className="group absolute right-3 top-3 z-[500] flex h-11 w-11 rounded-full border-2 border-neutral-900/40 bg-gradient-to-t from-neutral-100 to-neutral-200 text-neutral-900/80 hover:to-neutral-300 hover:text-neutral-900 focus:outline-none sm:right-4 sm:top-4"
          onClick={handleMapClose}
        >
          <span className="sr-only">{t('map.close')}</span>
          <div className="absolute left-1/2 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 transform">
            <span
              aria-hidden="true"
              className="absolute flex h-0.5 w-5 rotate-45 transform bg-current group-hover:bg-current"
            ></span>
            <span
              aria-hidden="true"
              className="absolute flex h-0.5 w-5 -rotate-45 transform bg-current group-hover:bg-current"
            ></span>
          </div>
        </button>

        <Map pictures={pictures} isInteractive />
      </div>
    </div>
  )
}

interface HomeMapProps {
  pictures: PictureOnMap[]
  setShowMap: (showMap: boolean) => void
}
