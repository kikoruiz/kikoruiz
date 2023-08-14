import {Fragment} from 'react'
import useTranslation from 'next-translate/useTranslation'
import {ShotInfo as ShotInfoInterface} from 'types/gallery'

export default function PictureInfo({
  shotInfo,
  isPano,
  isStarTracked,
  model,
  lens,
  aspectRatio,
  editingSoftware,
  isOpen,
  processingDate,
  prettyProcessingDate
}: PictureInfoProps) {
  const {t} = useTranslation('gallery')
  const shotInfoList = [
    {
      id: 'model',
      content: <>{model}</>
    },
    {
      id: 'lens',
      content: <>{lens}</>
    },
    {
      id: 'shutter-speed',
      content: (
        <>
          {shotInfo.shutterSpeed}s
          {isStarTracked && ` (${t('carousel.picture-info.star-tracked')})`}
        </>
      )
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
    },
    {id: 'aspect-ratio', content: <>{aspectRatio}</>},
    {id: 'editing-software', content: <>{editingSoftware}</>},
    {
      id: 'processing-date',
      content: (
        <>
          <time dateTime={processingDate}>{prettyProcessingDate}</time>
        </>
      )
    }
  ]

  return (
    isOpen && (
      <dl className="relative inline-grid auto-rows-max grid-cols-2 py-4 text-xs font-extralight text-neutral-300/60 after:absolute after:left-0 after:top-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:via-orange-300/30 sm:grid-cols-4 sm:text-sm sm:font-thin">
        {shotInfoList.map(({id, content}) => {
          const baseClassName = 'py-0.5'

          return (
            <Fragment key={id}>
              <dt
                className={`mr-2 text-right font-bold text-orange-300/60 ${baseClassName}`}
              >
                {t(`gallery:carousel.picture-info.${id}`)}
              </dt>
              <dd
                className={`inline-flex items-end sm:col-span-3 ${baseClassName}`}
              >
                {content}
              </dd>
            </Fragment>
          )
        })}
      </dl>
    )
  )
}

interface PictureInfoProps {
  shotInfo: ShotInfoInterface
  isPano: boolean
  isStarTracked: boolean
  model: string
  lens: string
  aspectRatio: string
  editingSoftware: string
  megapixels?: number
  fileSize?: string
  imageSize?: string
  isOpen: boolean
  processingDate: string
  prettyProcessingDate: string
}
