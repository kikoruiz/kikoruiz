import NextImage from 'next/image'
import ReactMarkdown from 'react-markdown'

export default function Article({content, className}: ArticleProps) {
  const articleClassName = `max-w-full prose prose-neutral prose-h1:mb-0 prose-h1:sm:mb-12 prose-h1:text-6xl prose-headings:text-neutral-300 prose-p:text-neutral-400 prose-a:text-orange-200 hover:prose-a:text-orange-300 hover:prose-a:no-underline prose-p:font-light prose-strong:text-neutral-300${
    className ? ` ${className}` : ''
  }`
  const components = {
    p({children, node}) {
      if (
        node.children[0].type === 'text' &&
        node.children[0].value.match(
          /<a[\s]+([^>]+)>((?:.(?!\<\/a\>))*.)<\/a>/g
        )
      ) {
        console.log(node.children[0])
        // const metastring = image.properties.alt
        // const alt = metastring?.replace(/ *\{[^)]*\} */g, '')
        // const [properties] = metastring?.match(/\{(.*)\}/g) || []

        return <b>ESTO ES UN LINK</b>
      }

      if (node.children[0].tagName === 'img') {
        const image = node.children[0]
        const metastring = image.properties.alt
        const alt = metastring?.replace(/ *\{[^)]*\} */g, '')
        const [properties] = metastring?.match(/\{(.*)\}/g) || []
        let caption = ''
        let hasPriority = false
        let isSquare = false
        let isRounded = false
        let onlyInMobile = false

        if (properties) {
          const parsed = JSON.parse(properties)

          if (parsed.caption) caption = parsed.caption
          if (parsed.priority) hasPriority = parsed.priority
          if (parsed.square) isSquare = parsed.square
          if (parsed.rounded) isRounded = parsed.rounded
          if (parsed.mobile) onlyInMobile = parsed.mobile
        }

        return (
          <figure
            className={`relative overflow-hidden shadow-lg ${
              isSquare ? 'aspect-square' : 'aspect-3/2'
            } ${
              isRounded
                ? 'mx-auto w-2/3 rounded-full border-8 border-neutral-600/30'
                : 'rounded'
            }${onlyInMobile ? ' sm:hidden' : ''}`}
          >
            <NextImage
              src={image.properties.src}
              alt={alt}
              priority={hasPriority}
              className="object-cover"
              fill
              sizes="100%"
            />
            {caption && (
              <figcaption
                className="absolute bottom-0 px-3 py-1.5 text-xs shadow-sm"
                aria-label={caption}
              >
                {caption}
              </figcaption>
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

interface ArticleProps {
  content: string
  className: string
}
