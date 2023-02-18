import {Tag} from 'types'

export interface Subcategory {
  id: string
  tag: string
}

export interface Image {
  src: string
  orientation?: 'horizontal' | 'vertical'
  css: ImageFallbackStyle
  averageColor?: ImageAverageColor
}

export interface HighlightedImage extends Image {
  alt?: string
  sizes: string
}

export interface ImageAverageColor {
  hex: string
  isDark: boolean
  isLight: boolean
}

export interface RawPicture {
  aperture: number
  artist: string
  colorSpace: string
  compression: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  createDate: string
  description?: string
  fileName: string
  fileSize: string
  fileType: string
  fileTypeExtension: string
  firmware: string
  focalLength: string
  hyperfocalDistance: string
  imageSize: string
  iso: number
  keywords: string[]
  lens: string
  make: string
  maxApertureValue: number
  megapixels: number
  meteringMode: string
  mimeType: string
  model: string
  offsetTime: string
  profileDescription: string
  rating: number
  rawFileName: string
  resolution: {
    x: number
    y: number
  }
  resolutionUnit: string
  shutterSpeed: string
  software: string
  title: string
  whiteBalance: string
}

export interface Picture {
  name: string
  id: string
  url: string
  slug: string
  image: Image
  imageSize: string
  fileSize: string
  date: string
  prettyDate: string
  model: string
  lens: string
  shotInfo: ShotInfo
  isPano: boolean
  editingSoftware: string
  megapixels: number
  rawTags: string[]
  tags: Tag[]
}

export interface ImageFallbackStyle {
  backgroundImage: string
  backgroundPosition: string
  backgroundRepeat: string
  backgroundSize: string
}

export interface ShotInfo {
  iso: number
  aperture: number
  shutterSpeed: number | string
  focalLength: number
}
