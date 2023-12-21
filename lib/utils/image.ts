import path from 'node:path'
import fs from 'node:fs'
import {ImagePlaceholder, RawImagePlaceholder} from 'types/gallery'

const imagePlaceholdersFile = path.join(
  process.cwd(),
  'data',
  'image',
  'placeholders.json'
)

export async function getImagePlaceholder(
  src: string
): Promise<ImagePlaceholder> {
  const data = fs.readFileSync(imagePlaceholdersFile, 'utf8')
  const imagePlaceholders = JSON.parse(data) as RawImagePlaceholder[]
  const imagePlaceholder = imagePlaceholders.find(
    ({image}) => image === `public${src}`
  )

  return {css: imagePlaceholder.css}
}
