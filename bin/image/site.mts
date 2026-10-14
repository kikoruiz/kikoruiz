#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

// The images of the site that are not pictures of the gallery (the avatar, the
// store and the blog covers) get the same pre-made widths, in `public/optimized`
// under the same path they have in `public`, which is where the image loader
// looks for them.
const WIDTHS = [640, 1080, 1920]
const QUALITY = 80
const publicDir = path.join(process.cwd(), 'public')
const outputDir = path.join(publicDir, 'optimized')
const sources = ['avatar.jpg', 'store', 'blog']

function getFiles(entry: string): string[] {
  const fullPath = path.join(publicDir, entry)
  if (fs.statSync(fullPath).isFile()) return [entry]

  return fs
    .readdirSync(fullPath)
    .flatMap(child => getFiles(path.join(entry, child)))
}

async function optimizeImage(file: string) {
  const base = file.replace(/\.[^.]+$/, '')
  const results = await Promise.all(
    WIDTHS.map(async width => {
      const outputPath = path.join(outputDir, `${base}-${width}w.webp`)
      if (fs.existsSync(outputPath)) return false

      fs.mkdirSync(path.dirname(outputPath), {recursive: true})
      await sharp(path.join(publicDir, file))
        .resize(width, undefined, {withoutEnlargement: true})
        .webp({quality: QUALITY})
        .toFile(outputPath)

      return true
    })
  )

  if (results.some(Boolean)) console.log(`  ✓ ${file}`)
}

async function optimize() {
  const files = sources
    .flatMap(getFiles)
    .filter(file => /\.(jpe?g|png)$/i.test(file))

  console.log(`\nOptimizing ${files.length} site images...\n`)

  for (const file of files) await optimizeImage(file)

  console.log('\n✅ Site images optimization complete.\n')
}

optimize().catch(error => {
  console.error('\n❌ Error:', error)
  process.exit(1)
})
