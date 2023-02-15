import Link from 'next/link'
import {Tag} from 'types'

export default function GalleryTags({tags}: GalleryTagsProps) {
  return (
    <section className="columns-2 gap-3 p-3 md:columns-3 xl:columns-4">
      {tags.map(({id, name, href}) => (
        <Link
          key={id}
          href={href}
          className="mt-3 block break-words rounded border border-neutral-800 bg-gradient-to-b from-neutral-800/60 to-neutral-800/30 p-3 font-extrabold text-neutral-300/60 first-of-type:mt-0 hover:border-orange-300/60 hover:to-transparent hover:text-orange-300/60"
        >
          <span className="font-thin"># </span>
          {name}
        </Link>
      ))}
    </section>
  )
}

interface GalleryTagsProps {
  tags: Tag[]
}
