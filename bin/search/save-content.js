#!/usr/bin/env node
const fs = require('node:fs')
const path = require('node:path')
const matter = require('gray-matter')
const {paramCase} = require('change-case')
const removeAccents = require('remove-accents')

const postsDirectory = path.join(process.cwd(), 'data', 'posts')
const searchContentFile = path.join(
  process.cwd(),
  'data',
  'search',
  'content.json'
)

function getMarkdownContent(filename) {
  const file = fs.readFileSync(filename, 'utf8')
  const {content, data} = matter(file)

  return {
    ...data,
    content
  }
}

async function saveSearchContent() {
  if (fs.existsSync(searchContentFile)) fs.unlinkSync(searchContentFile)

  const filenames = fs.readdirSync(postsDirectory)
  const posts = filenames
    .filter(filename => !filename.includes('_draft.md'))
    .map(filename => {
      const rawSlug = filename.replace(/\.md$/, '')
      const post = getMarkdownContent(`${postsDirectory}/${rawSlug}.md`)
      const {excerpt, title, tags} = post

      return {excerpt, title, tags, slug: paramCase(removeAccents(title))}
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
