#!/usr/bin/env node
const fs = require('node:fs')
const path = require('node:path')
const {exiftool} = require('exiftool-vendored')

const picturesDir = path.join(process.cwd(), 'public', 'pictures')
const picturesMetadataFile = path.join(
  process.cwd(),
  'data',
  'pictures',
  'metadata.json'
)

const files = fs
  .readdirSync(picturesDir)
  .filter(filename => filename.includes('jpg'))
  .map(filename => `${picturesDir}/${filename}`)

async function saveAllPicturesMetadata() {
  if (fs.existsSync(picturesMetadataFile)) fs.unlinkSync(picturesMetadataFile)

  let pictures = []

  for (const file of files) {
    const tags = await exiftool.read(file)
    const fileName = tags.FileName

    if (pictures.find(picture => picture.fileName === fileName)) {
      continue
    }

    pictures.push({
      aperture: tags.Aperture,
      artist: tags.Artist,
      colorSpace: tags.ColorSpace,
      compression: tags.Compression,
      ...(tags.GPSLatitude &&
        tags.GPSLongitude && {
          coordinates: {
            latitude: tags.GPSLatitude,
            longitude: tags.GPSLongitude
          }
        }),
      copyright: tags.CopyrightNotice,
      createDate: tags.CreateDate.toString(),
      ...(tags.Description && {description: tags.Description}),
      fileName,
      fileSize: tags.FileSize,
      fileType: tags.FileType,
      fileTypeExtension: tags.FileTypeExtension,
      firmware: tags.Firmware,
      focalLength: tags.FocalLength,
      hyperfocalDistance: tags.HyperfocalDistance,
      imageSize: tags.ImageSize,
      iso: tags.ISO,
      keywords: tags.Keywords,
      lens: tags.LensID,
      make: tags.Make,
      maxApertureValue: tags.MaxApertureValue,
      megapixels: tags.Megapixels,
      meteringMode: tags.MeteringMode,
      mimeType: tags.MIMEType,
      model: tags.Model,
      offsetTime: tags.OffsetTime,
      profileDescription: tags.ProfileDescription,
      rating: tags.Rating,
      rawFileName: tags.RawFileName,
      resolution: {
        x: tags.XResolution,
        y: tags.YResolution
      },
      resolutionUnit: tags.ResolutionUnit,
      shutterSpeed: tags.ShutterSpeed,
      software: tags.Software,
      title: tags.Title,
      whiteBalance: tags.WhiteBalance
    })
  }

  fs.writeFileSync(picturesMetadataFile, JSON.stringify(pictures))
}

saveAllPicturesMetadata()
  .then(() => {
    console.log('Pictures metadata has been saved.')
    process.exit(0)
  })
  .catch(error => {
    console.log(error)
    process.exit(1)
  })
