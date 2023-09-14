import fs from 'node:fs'
import path from 'node:path'
import {getPlaiceholder} from 'plaiceholder'
import {getMarkdownContent} from '../content'
import {themeScreens} from '../utils'
import {
  DEFAULT_WORDS_PER_MINUTE,
  POST_FILE_EXTENSION,
  POST_FILE_SEPARATOR,
  POST_FILE_DRAFT_PLACEHOLDER
} from 'config/blog'
import {BlogPost, BlogPostContent} from 'types/blog'

const postsDirectory = path.join(process.cwd(), 'data', 'posts')

function getPostBySlug(slug: string, {locale}: {locale: string}) {
  return getMarkdownContent(
    `${postsDirectory}/${locale}/${slug}${POST_FILE_EXTENSION}`
  ) as BlogPostContent
}

export async function getAllPosts(locale: string): Promise<BlogPost[]> {
  let filenames = fs.readdirSync(`${postsDirectory}/${locale}`)
  filenames = filenames.reverse()
  filenames = filenames.filter(
    filename =>
      !filename.includes(
        `${POST_FILE_SEPARATOR}${POST_FILE_DRAFT_PLACEHOLDER}${POST_FILE_EXTENSION}`
      )
  )

  return Promise.all(
    filenames.map(async filename => {
      const rawSlug = filename.replace(/\.md$/, '')
      const post = getPostBySlug(rawSlug, {locale})
      const [createdAt, slug] = rawSlug.split(POST_FILE_SEPARATOR)
      const readingTime = getReadingTime(post.body)
      const matchedImages = post.body.match(/!\[(.*)\]\((.*.jpg)\)/g)
      let bodyImages = []
      if (matchedImages) {
        bodyImages = await Promise.all(
          matchedImages.map(async matchedImage => {
            const [, alt, src] = matchedImage.match(/!\[(.*)\]\((.*.jpg)\)/)
            const {css} = await getPlaiceholder(src)

            return {src, alt: alt.replace(/ *\{[^)]*\} */g, ''), css}
          })
        )
      }

      const hasStaticImage = post.picture && post.excerpt
      const {sm} = themeScreens
      const highlightedImage = {
        sizes: `(min-width: ${sm}) 50vw, 100vw`,
        ...(hasStaticImage
          ? {src: post.picture, alt: post.excerpt}
          : bodyImages[0])
      }
      if (hasStaticImage) {
        const plaiceholder = await getPlaiceholder(post.picture)

        highlightedImage.css = plaiceholder.css
      }

      return {
        ...post,
        slug,
        createdAt,
        readingTime,
        ...(highlightedImage && {highlightedImage}),
        href: `/blog/${slug}`,
        isDraft: filename.includes(
          `${POST_FILE_SEPARATOR}${POST_FILE_DRAFT_PLACEHOLDER}${POST_FILE_EXTENSION}`
        ),
        bodyImages: bodyImages.map(({src, css}) => ({src, css}))
      }
    })
  )
}

export function getPostSlugByPictureSlug(
  slug: string,
  {locale}: {locale: string}
): string {
  const postFilePath = fs
    .readdirSync(`${postsDirectory}/${locale}`)
    .find(file => file.includes(slug))

  if (!postFilePath) return

  const [postFileName] = postFilePath.split(POST_FILE_EXTENSION)
  const [, postSlug, draftSlug] = postFileName.split(POST_FILE_SEPARATOR)

  if (draftSlug === POST_FILE_DRAFT_PLACEHOLDER) return

  return postSlug
}

export function getReadingTime(body: string) {
  const words = body.trim().split(/\s+/).length
  const time = Math.ceil(words / DEFAULT_WORDS_PER_MINUTE)

  return time
}
