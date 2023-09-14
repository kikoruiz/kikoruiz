#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import {paramCase} from 'change-case'
import removeAccents from 'remove-accents'
import {BlogPostContent} from 'types/blog'
// import {POST_FILE_SEPARATOR} from 'config/blog'

const POST_FILE_SEPARATOR = '_'

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
  const {title, excerpt, author, body, picture, tags} = data

  return {
    slug: paramCase(removeAccents(title)),
    title,
    excerpt,
    author,
    body,
    picture,
    tags
  }
}

function getPosts(locale: string): BlogPostContent[] {
  const localeDirectory = `${postsDirectory}/${locale}`
  const filenames = fs.readdirSync(localeDirectory)

  return filenames
    .filter(filename => !filename.includes('_draft.md'))
    .map(filename => {
      const rawSlug = filename.replace(/\.md$/, '')
      const post = getMarkdownContent(`${localeDirectory}/${rawSlug}.md`)
      const [createdAt] = rawSlug.split(POST_FILE_SEPARATOR)

      return {...post, createdAt}
    })
}

async function saveSearchContent() {
  if (fs.existsSync(searchContentFile)) fs.unlinkSync(searchContentFile)

  const locales = fs.readdirSync(postsDirectory)
  const postsByLocale = locales.reduce(
    (posts, locale) => ({...posts, [locale]: getPosts(locale)}),
    {}
  )

  fs.writeFileSync(searchContentFile, JSON.stringify(postsByLocale))
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
