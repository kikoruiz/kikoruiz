import fs from 'node:fs'
import path from 'node:path'
import {exiftool} from 'exiftool-vendored'
import {GALLERY_ALBUMS} from '../../config/gallery.js'

const picturesDirectory = path.join(process.cwd(), 'public', 'pictures')
const filenames = fs
  .readdirSync(picturesDirectory)
  .filter(filename => filename.includes('jpg'))
  .map(filename => `${picturesDirectory}/${filename}`)

export async function getGalleryPictures({slug}) {
  let pictures = []
  const {tag} = GALLERY_ALBUMS.find(album => slug === album.slug)

  for (const filename of filenames) {
    const tags = await exiftool.read(filename)

    if (tags.Keywords.includes(tag)) {
      pictures.push({
        aperture: tags.Aperture,
        artist: tags.Artist,
        colorSpace: tags.ColorSpace,
        compression: tags.Compression,
        copyright: tags.Copyright,
        copyright: tags.CopyrightNotice,
        createDate: tags.CreateDate.toString(),
        ...(tags.Description && {description: tags.Description}),
        fileName: tags.FileName,
        fileSize: tags.FileSize,
        fileType: tags.FileType,
        fileTypeExtension: tags.FileTypeExtension,
        firmware: tags.Firmware,
        focalLength: tags.FocalLength,
        hyperfocalDistance: tags.HyperfocalDistance,
        imageSize: tags.ImageSize,
        iso: tags.ISO,
        keywords: tags.Keywords,
        label: tags.Label,
        lens: tags.Lens,
        lensId: tags.LensID,
        lensModel: tags.LensModel,
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
        resolutionUnit: tags.ResolutionUnit,
        shutterSpeed: tags.ShutterSpeed,
        software: tags.Software,
        title: tags.Title,
        whiteBalance: tags.WhiteBalance,
        xResolution: tags.XResolution,
        yResolution: tags.YResolution
      })
    }
  }

  return pictures
}
