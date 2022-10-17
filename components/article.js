import Image from 'next/image'
import ReactMarkdown from 'react-markdown'

export default function Article({content, className}) {
  const articleClassName = `max-w-full prose prose-neutral prose-h1:text-6xl prose-headings:text-neutral-300 prose-p:text-neutral-400 prose-a:text-orange-200 hover:prose-a:text-orange-300 hover:prose-a:no-underline prose-p:font-light prose-strong:text-neutral-300 dark:prose-invert${
    className ? ` ${className}` : ''
  }`
  const components = {
    p({children, node}) {
      if (node.children[0].tagName === 'img') {
        const image = node.children[0]
        const metastring = image.properties.alt
        const alt = metastring?.replace(/ *\{[^)]*\} */g, '')
        const isPriority = Boolean(
          metastring?.toLowerCase().match('{priority}')
        )
        const hasCaption = metastring?.toLowerCase().includes('{caption:')
        const caption = metastring?.match(/{caption: (.*?)}/)?.pop()

        return (
          <figure className="relative aspect-3/2 shadow-lg">
            <Image
              src={image.properties.src}
              objectFit="cover"
              layout="fill"
              alt={alt}
              priority={isPriority}
              className="rounded"
            />
            {hasCaption && (
              <figcaption aria-label={caption}>{caption}</figcaption>
            )}
          </figure>
        )
      }

      return <p>{children}</p>
    }
  }

  return (
    <article className={articleClassName}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </article>
  )
}
