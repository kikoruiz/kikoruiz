export interface Subcategory {
  id: string
  tag: string
}

export interface Image {
  src: string
  orientation?: 'horizontal' | 'vertical'
  css: ImageFallbackStyle
  // averageColor:
}

export interface HighlightedImage extends Image {
  alt: string
  sizes: string
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
  tags: string[]
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
