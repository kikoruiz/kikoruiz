import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import {SOCIAL_IMAGE_WIDTH} from 'lib/utils'

const WIDTHS = [640, 1080, 1920]
const QUALITY = 80
const CONCURRENCY = 4
// Crawlers are the only consumers of this one, and several of them still choke
// on webp, so the social derivative stays a plain jpeg.
const SOCIAL_QUALITY = 85

const picturesDir = path.join(process.cwd(), 'public', 'pictures')
const outputDir = path.join(picturesDir, 'optimized')

async function optimizeImage(file: string) {
  const name = path.basename(file, path.extname(file))
  const inputPath = path.join(picturesDir, file)

  const results = await Promise.all([
    ...WIDTHS.map(async width => {
      const outputPath = path.join(outputDir, `${name}-${width}w.webp`)
      if (fs.existsSync(outputPath)) return false

      await sharp(inputPath)
        .resize(width, undefined, {withoutEnlargement: true})
        .webp({quality: QUALITY})
        .toFile(outputPath)

      return true
    }),
    (async () => {
      const outputPath = path.join(outputDir, `${name}-og.jpg`)
      if (fs.existsSync(outputPath)) return false

      await sharp(inputPath)
        .resize(SOCIAL_IMAGE_WIDTH, undefined, {withoutEnlargement: true})
        .jpeg({quality: SOCIAL_QUALITY})
        .toFile(outputPath)

      return true
    })()
  ])

  if (results.some(Boolean)) console.log(`  ✓ ${name}`)
}

async function optimize() {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, {recursive: true})

  const files = fs
    .readdirSync(picturesDir)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))

  console.log(`\nOptimizing ${files.length} pictures (${WIDTHS.join(', ')}px webp)...\n`)

  let processed = 0
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY)
    await Promise.all(batch.map(optimizeImage))
    processed += batch.length
    if (processed % 20 === 0) console.log(`  ${processed}/${files.length}`)
  }

  console.log(`\n✅ Pictures optimization complete.\n`)
}

optimize()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
