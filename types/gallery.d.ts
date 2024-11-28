import {orientation, Tag} from 'types'
import {Tutorial} from './blog'
import {GetPlaiceholderReturn} from 'plaiceholder'
import {Print} from './store'

export interface Subcategory {
  id: string
  tag: string
  emoji?: string
}
export interface RawImagePlaceholder extends ImagePlaceholder {
  image: string
}

export interface Image extends ImagePlaceholder {
  src: string
  orientation?: orientation
  averageColor?: ImageAverageColor
}

export interface ImagePlaceholder {
  css: GetPlaiceholderReturn['css']
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

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface Location {
  city: string
  state: string
  country: string
}

export interface RawPicture {
  aperture: number
  artist: string
  colorSpace: string
  coordinates?: Coordinates
  copyright: string
  createDate: string
  processingDate?: string
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
  description?: string
  id: string
  url: string
  slug: string
  image?: Image
  imageSize: string
  fileSize: string
  aspectRatio?: string
  date: string
  processingDate?: string
  prettyDate: string
  prettyProcessingDate?: string
  model: string
  lens: string
  shotInfo: ShotInfo
  isPano: boolean
  isStarTracked: boolean
  editingSoftware: string
  megapixels: number
  rawTags: string[]
  tags: Tag[]
  subcategory?: string
  coordinates?: Coordinates
  location?: Location
  tutorial?: Tutorial
  print?: Print['url']
}

export interface LatestPictures {
  byCreationDate: Picture[]
  byProcessingDate: Picture[]
}

export interface PictureOnMap {
  slug: string
  coordinates?: Coordinates
  image?: Image
}

export type ImageFallbackStyle = ImagePlaceholder

export interface ShotInfo {
  iso: number
  aperture: number
  shutterSpeed: number | string
  focalLength: number
}
