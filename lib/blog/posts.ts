import fs from 'node:fs'
import path from 'node:path'
import {getPlaiceholder} from 'plaiceholder'
import {getMarkdownContent} from '../content'
import {themeScreens} from '../utils'

const DEFAULT_WORDS_PER_MINUTE = 225
const POST_FILE_EXTENSION = '.md'
const POST_FILE_SEPARATOR = '_'

const postsDirectory = path.join(process.cwd(), 'data', 'posts')

function getPostBySlug(slug: string) {
  return getMarkdownContent(`${postsDirectory}/${slug}${POST_FILE_EXTENSION}`)
}

export async function getAllPosts() {
  let filenames = fs.readdirSync(postsDirectory)
  filenames = filenames.reverse()

  return Promise.all(
    filenames.map(async filename => {
      const rawSlug = filename.replace(/\.md$/, '')
      const post = getPostBySlug(rawSlug)
      const [createdAt, slug] = rawSlug.split(POST_FILE_SEPARATOR)
      const readingTime = getReadingTime(post.content)
      const image = post.content.match(/!\[(.*)\]\((.*.jpg)\)/)
      let highlightedImage
      const {sm} = themeScreens

      if (image) {
        const [, alt, src] = image
        const {css} = await getPlaiceholder(src)
        highlightedImage = {
          src,
          alt,
          css,
          sizes: `(min-width: ${sm}) 50vw, 100vw`
        }
      }

      return {
        ...post,
        slug,
        createdAt,
        readingTime,
        ...(highlightedImage && {highlightedImage}),
        href: `/blog/${slug}`
      }
    })
  )
}

export function getPostSlugByPictureSlug(slug: string): string {
  const postFilePath = fs
    .readdirSync(postsDirectory)
    .find(file => file.includes(slug))

  if (!postFilePath) return

  const [postFileName] = postFilePath.split(POST_FILE_EXTENSION)
  const [, postSlug] = postFileName.split(POST_FILE_SEPARATOR)

  return postSlug
}

export function getReadingTime(content: string) {
  const words = content.trim().split(/\s+/).length
  const time = Math.ceil(words / DEFAULT_WORDS_PER_MINUTE)

  return time
}
