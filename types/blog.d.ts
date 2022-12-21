import {HighlightedImage} from './gallery'

export interface BlogPost {
  author: string
  content: string
  createdAt: string
  excerpt: string
  highlightedImage: HighlightedImage
  href: string
  readingTime: number
  slug: string
  tags: BlogTag[]
  title: string
}

export interface BlogTag {
  href: string
  id: string
  name: string
  slug: string
}
