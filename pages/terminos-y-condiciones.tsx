import StaticPage, {StaticPageProps} from 'components/static-page'
import {getContent} from 'lib/content'
import {fromLocalesToAlternates} from 'lib/mappers'

export default function CookiesPolicy(props: StaticPageProps) {
  return <StaticPage {...props} />
}

export async function getStaticProps({locales, locale, defaultLocale}) {
  const category = 'legal'
  const page = 'terms-and-conditions'
  const content = await getContent({locale, page, category})
  const alternates = await Promise.all(
    locales.map(await fromLocalesToAlternates({defaultLocale, page, category}))
  )

  return {
    props: {content, section: page, alternates}
  }
}
