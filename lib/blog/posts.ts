import fs from 'node:fs'
import path from 'node:path'
import {getPlaiceholder} from 'plaiceholder'
import {getMarkdownContent} from '../content'
import {themeScreens} from '../utils'

const DEFAULT_WORDS_PER_MINUTE = 225

const postsDirectory = path.join(process.cwd(), 'data', 'posts')

function getPostBySlug(slug: string) {
  return getMarkdownContent(`${postsDirectory}/${slug}.md`)
}

export async function getAllPosts() {
  const filenames = fs.readdirSync(postsDirectory)

  return Promise.all(
    filenames.map(async filename => {
      const rawSlug = filename.replace(/\.md$/, '')
      const post = getPostBySlug(rawSlug)
      const [createdAt, slug] = rawSlug.split('_')
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

export function getReadingTime(content: string) {
  const words = content.trim().split(/\s+/).length
  const time = Math.ceil(words / DEFAULT_WORDS_PER_MINUTE)

  return time
}
