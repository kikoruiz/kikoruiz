#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import {paramCase} from 'change-case'
import removeAccents from 'remove-accents'
import {BlogPostContent} from 'types/blog'

const postsDirectory = path.join(process.cwd(), 'data', 'posts')
const searchContentFile = path.join(
  process.cwd(),
  'data',
  'search',
  'content.json'
)

function getMarkdownContent(filename: string): BlogPostContent {
  const file = fs.readFileSync(filename, 'utf8')
  const {data} = matter(file)
  const {title, excerpt, author, content, picture, tags} = data

  return {
    slug: paramCase(removeAccents(title)),
    title,
    excerpt,
    author,
    content,
    picture,
    tags
  }
}

async function saveSearchContent() {
  if (fs.existsSync(searchContentFile)) fs.unlinkSync(searchContentFile)

  const filenames = fs.readdirSync(postsDirectory)
  const posts: BlogPostContent[] = filenames
    .filter(filename => !filename.includes('_draft.md'))
    .map(filename => {
      const rawSlug = filename.replace(/\.md$/, '')
      const post = getMarkdownContent(`${postsDirectory}/${rawSlug}.md`)

      return post
    })

  fs.writeFileSync(searchContentFile, JSON.stringify(posts))
}

saveSearchContent()
  .then(() => {
    console.log('Search content has been saved.')
    process.exit(0)
  })
  .catch(error => {
    console.log(error)
    process.exit(1)
  })
