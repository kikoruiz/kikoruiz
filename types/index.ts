export interface BreadcrumbItem {
  id: string
  name: string
  href?: string
  categories?: object[]
  localePrefix?: string
}

export interface Alternate {
  locale: string
  href: string
}
