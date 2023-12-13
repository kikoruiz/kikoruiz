import path from 'node:path'
import fs from 'node:fs'
import {getPlaiceholder} from 'plaiceholder'
import {ImagePlaceholder} from 'types/gallery'

const publicDir = path.join(process.cwd(), 'public')

export async function getImagePlaceholder(
  src: string
): Promise<ImagePlaceholder> {
  const imageFile = fs.readFileSync(`${publicDir}${src}`)
  const imagePlaceholder = await getPlaiceholder(imageFile)

  return {css: imagePlaceholder.css}
}
