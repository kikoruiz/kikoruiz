#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import {globSync} from 'glob'
import {getAverageColor} from 'fast-average-color-node'

const root = process.cwd()
const averageColorsFile = path.join(
  root,
  'data',
  'image',
  'average-colors.json'
)
const pictures = globSync('public/pictures/*.jpg').sort()

// The page that uses these revalidates while it is live, where `public` is not
// in the function, so the colours are worked out here and kept as data. The
// smallest derivative is plenty to average a picture.
async function saveAverageColors() {
  const averageColors: Record<
    string,
    {hex: string; isDark: boolean; isLight: boolean}
  > = {}

  for (const picture of pictures) {
    const name = path.basename(picture, path.extname(picture))
    const optimized = path.join(
      root,
      'public',
      'pictures',
      'optimized',
      `${name}-640w.webp`
    )
    const {hex, isDark, isLight} = await getAverageColor(optimized)

    averageColors[`/pictures/${name}.jpg`] = {hex, isDark, isLight}
  }

  fs.writeFileSync(averageColorsFile, JSON.stringify(averageColors))
}

saveAverageColors()
  .then(() => {
    console.log(`\n✅ ${pictures.length} average colours have been saved.\n`)
    process.exit(0)
  })
  .catch(error => {
    console.log(error)
    process.exit(1)
  })
