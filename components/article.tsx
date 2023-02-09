import NextImage from 'next/image'
import ReactMarkdown from 'react-markdown'

export default function Article({content, className}: ArticleProps) {
  const articleClassName = `max-w-full prose prose-neutral prose-h1:text-6xl prose-headings:text-neutral-300 prose-p:text-neutral-400 prose-a:text-orange-200 hover:prose-a:text-orange-300 hover:prose-a:no-underline prose-p:font-light prose-strong:text-neutral-300${
    className ? ` ${className}` : ''
  }`
  const components = {
    p({children, node}) {
      if (node.children[0].tagName === 'img') {
        const image = node.children[0]
        const metastring = image.properties.alt
        const alt = metastring?.replace(/ *\{[^)]*\} */g, '')
        const caption = metastring?.match(/{caption: (.*?)}/)?.pop()
        const hasPriority = Boolean(
          metastring?.toLowerCase().match('{priority}')
        )

        return (
          <figure className="relative aspect-3/2 shadow-lg">
            <NextImage
              src={image.properties.src}
              alt={alt}
              priority={hasPriority}
              className="rounded object-cover"
              fill
              sizes="100vw"
            />
            {caption && <figcaption aria-label={caption}>{caption}</figcaption>}
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

interface ArticleProps {
  content: string
  className: string
}
