import {Fragment} from 'react'
import useTranslation from 'next-translate/useTranslation'
import EyeIcon from '../assets/icons/eye.svg'
import EyeSlashIcon from '../assets/icons/eye-slash.svg'
import {ShotInfo as ShotInfoInterface} from 'types/gallery'

export default function ShotInfo({
  shotInfo,
  isPano,
  isOpen,
  handleToggle
}: ShotInfoProps) {
  const {t} = useTranslation('gallery')
  const buttonText = isOpen
    ? t('carousel.hide-shot-info')
    : t('carousel.show-shot-info')
  const ShowShotInfoIcon = isOpen ? EyeSlashIcon : EyeIcon
  const shotInfoList = [
    {
      id: 'shutter-speed',
      content: <>{shotInfo.shutterSpeed}s</>
    },
    {
      id: 'aperture',
      content: (
        <>
          <span className="italic">f</span>/{shotInfo.aperture}
        </>
      )
    },
    {
      id: 'iso',
      content: <>{shotInfo.iso}</>
    },
    {
      id: 'focal-length',
      content: (
        <>
          {shotInfo.focalLength} mm{isPano && ' (pano)'}
        </>
      )
    }
  ]

  return (
    <div className="mt-3">
      {isOpen && (
        <dl className="relative inline-grid auto-rows-max grid-cols-2 pt-3 text-sm font-thin text-neutral-300/60 after:absolute after:left-0 after:top-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:via-orange-300/30">
          {shotInfoList.map(({id, content}) => (
            <Fragment key={id}>
              <dt className="mr-2 text-right font-bold text-orange-300/60">
                {t(`gallery:sorting.options.shot-info.${id}`)}
              </dt>
              <dd>{content}</dd>
            </Fragment>
          ))}
        </dl>
      )}
      <button
        onClick={handleToggle}
        aria-label={buttonText}
        className={`flex appearance-none items-center rounded-full border border-neutral-700 bg-neutral-800 py-1.5 px-3 text-xs font-light text-neutral-300/60 shadow-sm hover:border-orange-300/60${
          isOpen ? ' mt-3' : ''
        }`}
      >
        {buttonText}
        <ShowShotInfoIcon className="ml-1.5 w-3" />
      </button>
    </div>
  )
}

interface ShotInfoProps {
  shotInfo: ShotInfoInterface
  isPano: boolean
  isOpen: boolean
  handleToggle: () => void
}
