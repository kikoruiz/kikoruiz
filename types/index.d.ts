import {BlogPost} from './blog'
import {HighlightedImage} from './gallery'

export interface BreadcrumbItem {
  categories?: object[]
  href?: string
  id: string
  localePrefix?: string
  name: string
}

export interface Alternate {
  href: string
  locale: string
}

export interface SectionData {
  post?: BlogPost
  section?: string
  subSection?: string
  tag?: string
  hasHero?: boolean
}

export interface SectionImage extends HighlightedImage {
  id: string
}

export interface Tag {
  href: string
  id: string
  name: string
  slug: string
}

export interface SearchItem {
  title: string
  slug: string
  // Blog
  excerpt?: string
  tags?: string
  // Gallery
  keywords?: string[]
  fileName?: string
  album?: string
}

export interface ThemeScreens {
  '2xl': string
  lg: string
  md: string
  sm: string
  xl: string
}

export interface Screens {
  '2xl': number
  lg: number
  md: number
  sm: number
  xl: number
}
