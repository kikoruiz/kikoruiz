import Link from 'next/link'
import {Tag} from 'types'

export default function GalleryTags({tags}: GalleryTagsProps) {
  return (
    <section className="columns-2 gap-3 space-y-3 px-3 md:columns-3 xl:columns-4">
      {tags.map(({id, name, href}, index) => {
        const isFirstTag = index === 0

        return (
          <Link
            key={id}
            href={href}
            title={name}
            className={`inline-flex w-full break-inside-avoid-column break-words rounded border border-neutral-800 bg-gradient-to-b from-neutral-800/60 to-neutral-800/30 p-3 font-extrabold text-neutral-300/60 hover:border-orange-300/60 hover:to-transparent hover:text-orange-300/90${
              isFirstTag ? ' mt-3' : ''
            }`}
          >
            <span className="mr-1 font-thin">#</span>
            {name}
          </Link>
        )
      })}
    </section>
  )
}

interface GalleryTagsProps {
  tags: Tag[]
}
