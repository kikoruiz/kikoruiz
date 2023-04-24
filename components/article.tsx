import NextImage from 'next/image'
import NextLink from 'next/link'
import ReactMarkdown from 'react-markdown'

export default function Article({content, className}: ArticleProps) {
  const articleClassName = `max-w-full overflow-hidden prose prose-neutral prose-code:text-neutral-300 prose-h1:mb-0 prose-h1:sm:mb-12 prose-h1:text-6xl prose-headings:text-neutral-300 prose-p:text-neutral-400 prose-code:before:content-[''] prose-code:after:content-[''] prose-a:text-orange-200 hover:prose-a:text-orange-300 hover:prose-a:no-underline prose-p:font-light prose-strong:text-neutral-300${
    className ? ` ${className}` : ''
  }`
  const components = {
    p({children, node}) {
      node.children.forEach((attrs, index) => {
        const {type, tagName, properties} = attrs

        if (
          type === 'element' &&
          tagName === 'a' &&
          !properties.href.includes('https')
        ) {
          const {props} = children[index]

          children[index] = (
            <NextLink href={props.href} key={index}>
              {props.children}
            </NextLink>
          )
        }
      })

      if (node.children[0].tagName === 'img') {
        const image = node.children[0]
        const metastring = image.properties.alt
        const alt = metastring?.replace(/ *\{[^)]*\} */g, '')
        const [properties] = metastring?.match(/\{(.*)\}/g) || []
        let caption = alt
        let hasPriority = false
        let isSquare = false
        let isRounded = false
        let onlyInMobile = false
        let alignToLeft = false
        let alignToRight = false
        let isVertical = false

        if (properties) {
          const parsed = JSON.parse(properties)

          if (parsed.caption) caption = parsed.caption
          if (parsed.priority) hasPriority = parsed.priority
          if (parsed.square) isSquare = parsed.square
          if (parsed.rounded) isRounded = parsed.rounded
          if (parsed.mobile) onlyInMobile = parsed.mobile
          if (parsed.align === 'left') alignToLeft = true
          if (parsed.align === 'right') alignToRight = true
          if (parsed.orientation === 'vertical') isVertical = true
        }

        return (
          <figure
            className={`relative mb-12 shadow-lg lg:clear-both ${
              isSquare
                ? 'aspect-square'
                : isVertical
                ? 'aspect-2/3'
                : 'aspect-3/2'
            } ${
              isRounded
                ? 'mx-auto w-2/3 rounded-full border-8 border-neutral-600/30'
                : 'rounded'
            }${onlyInMobile ? ' sm:hidden' : ''}${
              alignToLeft || alignToRight ? ' lg:mt-2 lg:w-1/2' : ''
            }${alignToLeft ? ' lg:float-left lg:mr-6' : ''}${
              alignToRight ? ' lg:float-right lg:ml-6' : ''
            }`}
          >
            <NextImage
              src={image.properties.src}
              alt={alt}
              title={alt}
              priority={hasPriority}
              className={`object-cover ${
                isRounded
                  ? 'mx-auto w-2/3 rounded-full border-8 border-neutral-600/30'
                  : 'rounded'
              }`}
              fill
              sizes="100%"
            />
            {caption && !isSquare && (
              <figcaption
                className="absolute left-0 top-full z-20 m-0 py-1 text-xs font-extralight italic text-neutral-600 drop-shadow-sm"
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
