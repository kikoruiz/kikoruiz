import StaticPage, {StaticPageProps} from 'components/static-page'
import {getContent} from 'lib/content'
import {fromLocalesToAlternates} from 'lib/mappers'

export default function Legal(props: StaticPageProps) {
  return <StaticPage {...props} />
}

export async function getStaticProps({locales, locale, defaultLocale}) {
  const category = 'legal'
  // The index is not one of the legal pages, so its title cannot come from
  // their locale keys and sits in the content's own front matter instead.
  const content = await getContent({locale, page: category})
  const alternates = await Promise.all(
    locales.map(await fromLocalesToAlternates({defaultLocale, category}))
  )

  return {
    props: {content, section: category, alternates}
  }
}
