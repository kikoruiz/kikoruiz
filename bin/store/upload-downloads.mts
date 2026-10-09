#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import {HeadObjectCommand, PutObjectCommand} from '@aws-sdk/client-s3'
import sharp from 'sharp'
import {DOWNLOAD_MIN_RATING, DOWNLOAD_VARIANTS} from 'config/store'
import {getDownloadKey, getR2Client, R2_BUCKET} from 'lib/store/r2'
import {RawPicture} from 'types/gallery'

// The file on sale should be visibly better than the webp the gallery serves
// for free, so the resize keeps far more quality than the web derivatives.
const QUALITY = 92

const client = getR2Client()
const picturesDir = path.join(process.cwd(), 'public', 'pictures')
const picturesFile = path.join(
  process.cwd(),
  'data',
  'pictures',
  'metadata.json'
)
// Tiers that share a resolution share the file, so this is what actually has to
// be stored.
const SIZES = [
  ...new Set(DOWNLOAD_VARIANTS.map(({longestSide}) => longestSide))
]

function getOptions() {
  const flags = new Map(
    process.argv
      .slice(2)
      .filter(argument => argument.startsWith('--'))
      .map(argument => {
        const [key, value] = argument.slice(2).split('=')

        return [key, value ?? '']
      })
  )

  return {
    isDryRun: flags.has('dry-run'),
    isForced: flags.has('force'),
    minRating: Number(flags.get('min-rating')) || DOWNLOAD_MIN_RATING,
    limit: Number(flags.get('limit')) || undefined,
    only: flags.get('only') || undefined
  }
}

async function exists(key: string) {
  try {
    await client.send(new HeadObjectCommand({Bucket: R2_BUCKET, Key: key}))

    return true
  } catch {
    return false
  }
}

async function getFile({
  fileName,
  longestSide
}: {
  fileName: string
  longestSide: number | null
}) {
  const filePath = path.join(picturesDir, fileName)

  if (!longestSide) return fs.readFileSync(filePath)

  return sharp(filePath)
    .resize(longestSide, longestSide, {fit: 'inside', withoutEnlargement: true})
    .jpeg({quality: QUALITY})
    .toBuffer()
}

async function uploadDownloads() {
  const {isDryRun, isForced, minRating, limit, only} = getOptions()
  const allPictures = JSON.parse(
    fs.readFileSync(picturesFile, 'utf8')
  ) as RawPicture[]
  const pictures = only
    ? allPictures.filter(({fileName}) => fileName.startsWith(only))
    : allPictures
        .filter(({rating}) => rating >= minRating)
        .slice(0, limit ?? Infinity)

  console.log(
    `\n📦 ${pictures.length} pictures · ${SIZES.length} files each · bucket "${R2_BUCKET}"${
      isDryRun ? ' · dry run' : ''
    }\n`
  )

  let uploaded = 0
  let skipped = 0
  let bytes = 0

  for (const {fileName} of pictures) {
    const pictureId = fileName.split('.')[0]

    for (const longestSide of SIZES) {
      const key = getDownloadKey({pictureId, longestSide})

      if (!isForced && (await exists(key))) {
        skipped++

        continue
      }

      if (isDryRun) {
        console.log(`   ✨ ${key}`)
        uploaded++

        continue
      }

      const body = await getFile({fileName, longestSide})
      bytes += body.length

      await client.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: key,
          Body: body,
          ContentType: 'image/jpeg'
        })
      )
      uploaded++
      console.log(`   ✅ ${key} · ${(body.length / 1048576).toFixed(1)} MB`)
    }
  }

  console.log(
    `\n   ✨ ${uploaded} ${isDryRun ? 'to upload' : 'uploaded'} · ♻️ ${skipped} already there${
      bytes > 0 ? ` · ${(bytes / 1048576).toFixed(0)} MB sent` : ''
    }\n`
  )

  if (isDryRun) console.log('🧪 Dry run, so nothing has been uploaded.\n')
}

uploadDownloads()
  .then(() => process.exit(0))
  .catch(error => {
    console.log(error)
    process.exit(1)
  })
