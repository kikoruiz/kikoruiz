import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import Image from 'components/image'
import {getAspectRatio} from 'lib/utils'
import {Picture} from 'types/gallery'

export function HomeLastPicture({id, url, name, image, imageSize}: Picture) {
  const {t} = useTranslation('home')

  return (
    <section className="relative mt-6">
      <header className="absolute -top-6 -left-3 z-[1] flex -rotate-12 items-center justify-center rounded-full bg-gradient-to-t from-orange-300 to-orange-200 p-5 text-center drop-shadow md:-top-9 md:-left-6 md:p-7 xl:-left-12">
        <h2 className="bg-gradient-to-t from-neutral-700 to-neutral-800/90 bg-clip-text text-xl font-extralight leading-snug text-transparent drop-shadow-sm md:text-3xl">
          {t('last-picture')}
        </h2>
      </header>

      <Link
        key={id}
        href={url}
        title={name}
        aria-label={name}
        className="flex flex-col overflow-hidden rounded border-4 border-orange-300/90 bg-neutral-800 drop-shadow"
      >
        <Image
          src={image.src}
          alt={name}
          aspectRatio={getAspectRatio(imageSize)}
          className="w-full overflow-hidden"
          fallbackStyle={image.css}
          sizes="100vw"
        />
      </Link>
    </section>
  )
}
