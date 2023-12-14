#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import {globSync} from 'glob'
import {getPlaiceholder} from 'plaiceholder'
import {RawImagePlaceholder} from 'types/gallery'

const dir = path.join(process.cwd())
const imagePlaceholdersFile = path.join(
  process.cwd(),
  'data',
  'image',
  'placeholders.json'
)
const images = globSync('public/**/*.jpg')
const imagePlaceholders: RawImagePlaceholder[] = []

async function saveAllImagePlaceholders() {
  if (fs.existsSync(imagePlaceholdersFile)) fs.unlinkSync(imagePlaceholdersFile)

  for (const image of images) {
    const imageFile = fs.readFileSync(`${dir}/${image}`)
    const imagePlaceholder = await getPlaiceholder(imageFile)

    imagePlaceholders.push({
      image,
      css: imagePlaceholder.css
    })
  }

  fs.writeFileSync(imagePlaceholdersFile, JSON.stringify(imagePlaceholders))
}

saveAllImagePlaceholders()
  .then(() => {
    console.log('Image placeholders have been saved.')
    process.exit(0)
  })
  .catch(error => {
    console.log(error)
    process.exit(1)
  })
