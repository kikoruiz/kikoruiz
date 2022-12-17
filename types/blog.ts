import {HighlightedImage} from './gallery'

export interface BlogPost {
  title: string
  excerpt: string
  author: string
  tags: BlogTag[]
  content: string
  slug: string
  createdAt: string
  readingTime: number
  highlightedImage: HighlightedImage
  href: string
}

export interface BlogTag {
  id: string
  slug: string
  name: string
  href: string
}
