export interface Image {
  src: string
  orientation?: 'horizontal' | 'vertical'
  css: ImageFallbackStyle
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
  date: string
  prettyDate: string
  shotInfo: ShotInfo
  isPano: boolean
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
