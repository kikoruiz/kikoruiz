export interface HighlightedImage {
  src: string
  alt: string
  css: ImageFallbackStyle
  sizes: string
}

export interface ImageFallbackStyle {
  backgroundImage: string
  backgroundPosition: string
  backgroundRepeat: string
  backgroundSize: string
}
