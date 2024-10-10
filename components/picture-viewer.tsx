import {useEffect, useState, ReactNode, LegacyRef, forwardRef} from 'react'
import useTranslation from 'next-translate/useTranslation'
import {Picture} from 'types/gallery'
import PictureDetail from './picture-detail'
import IconArrowLeft from 'assets/icons/arrow-left.svg'
import IconArrowRight from 'assets/icons/arrow-right.svg'
import IconArrowsPointingIn from 'assets/icons/arrows-pointing-in.svg'
import IconArrowsPointingOut from 'assets/icons/arrows-pointing-out.svg'

interface PictureViewerProps {
  pictures: Picture[]
  index?: number
  rootClassName?: string
  containerClassName?: string
  detailClassName?: string
  translationsPrefix?: string
  onExit?: () => void
  onClose: () => void
  needsPrevious?: boolean
  onPrevious?: () => void
  needsNext?: boolean
  onNext?: () => void
  paginationInfo?: ReactNode
  trackEvent: (action: string, name?: string) => void
}

function PictureViewer(
  {
    pictures = [],
    index = 0,
    rootClassName,
    containerClassName,
    detailClassName,
    translationsPrefix = 'carousel',
    onExit,
    onClose,
    needsPrevious = false,
    onPrevious,
    needsNext = false,
    onNext,
    paginationInfo,
    trackEvent
  }: PictureViewerProps,
  ref?: LegacyRef<HTMLDivElement>
) {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const needsPagination = Boolean(pictures.length > 1)
  const {t} = useTranslation('gallery')
  const fullScreenButtonText = isFullScreen
    ? t(`${translationsPrefix}.exit-full-screen`)
    : t(`${translationsPrefix}.enter-full-screen`)

  function toggleFullScreen() {
    if (isFullScreen) {
      trackEvent('exit_full_screen')
    } else {
      trackEvent('enter_full_screen')
    }
    setIsFullScreen(!isFullScreen)
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }

      switch (event.keyCode) {
        // Arrow left key.
        case 37:
          event.preventDefault()
          onPrevious()
          break
        // Arrow right key.
        case 39:
          event.preventDefault()
          onNext()
          break
        // Key "f".
        case 70:
          event.preventDefault()
          toggleFullScreen()
          break
        default:
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  return (
    <div className="fixed inset-0 z-20 h-screen w-screen">
      <div className="absolute right-3 top-3 z-20 flex flex-row-reverse gap-3 sm:right-6 sm:top-6">
        <button
          aria-label={t(`${translationsPrefix}.close`)}
          title={t(`${translationsPrefix}.close`)}
          className="group relative flex h-11 w-11 rounded-full bg-gradient-to-t from-neutral-800 text-neutral-400 drop-shadow-xl hover:text-neutral-300 focus:outline-none"
          onClick={onClose}
        >
          <span className="sr-only">{t(`${translationsPrefix}.close`)}</span>

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

        <button
          aria-label={fullScreenButtonText}
          title={fullScreenButtonText}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-t from-neutral-800 text-neutral-400 drop-shadow-xl hover:text-neutral-300 focus:outline-none"
          onClick={toggleFullScreen}
        >
          <span className="sr-only">{fullScreenButtonText}</span>
          {isFullScreen ? (
            <IconArrowsPointingIn className="w-[55%]" />
          ) : (
            <IconArrowsPointingOut className="w-[55%]" />
          )}
        </button>
      </div>

      {needsPagination && (
        <div className="pointer-events-none absolute left-6 top-6 z-10 flex gap-3 rounded-full bg-gradient-to-t from-neutral-800 px-3 text-xs font-extralight text-neutral-400 drop-shadow-xl">
          <span className="py-1.5">
            {index + 1} <span className="opacity-60">/ {pictures.length}</span>
          </span>

          {paginationInfo}
        </div>
      )}

      {(needsPrevious || needsNext) && (
        <nav className="hidden sm:block">
          {needsPrevious && (
            <button
              aria-label={t('carousel.navigation.previous')}
              title={t('carousel.navigation.previous')}
              className="absolute -left-14 top-2/4 z-20 -mt-14 flex h-28 w-28 items-center justify-end rounded-full bg-gradient-to-l from-neutral-800/60 pr-3.5 text-neutral-400 hover:from-neutral-800/30 hover:text-neutral-300 focus:outline-none"
              onClick={onPrevious}
            >
              <IconArrowLeft className="w-9" />
            </button>
          )}

          {needsNext && (
            <button
              aria-label={t('carousel.navigation.next')}
              title={t('carousel.navigation.next')}
              className="absolute -right-14 top-2/4 z-20 -mt-14 flex h-28 w-28 items-center justify-start rounded-full bg-gradient-to-r from-neutral-800/60 pl-3.5 text-neutral-400 hover:from-neutral-800/30 hover:text-neutral-300 focus:outline-none"
              onClick={onNext}
            >
              <IconArrowRight className="w-9" />
            </button>
          )}
        </nav>
      )}

      <div
        ref={ref}
        className={`${
          rootClassName ? `${rootClassName} ` : ''
        }h-full w-full overflow-hidden bg-neutral-900`}
      >
        <div
          className={`${
            containerClassName ? `${containerClassName} ` : ''
          }flex h-full w-full items-center`}
        >
          {pictures.map(item => (
            <PictureDetail
              key={item.slug}
              picture={item}
              isFullScreen={isFullScreen}
              onExit={onExit}
              trackEvent={trackEvent}
              wrapperClassName={detailClassName}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
export default forwardRef(PictureViewer)

PictureViewer.displayName = 'PictureViewer'
