import StaticPage, {StaticPageProps} from 'components/static-page'
import LegalHolder from 'components/legal-holder'
import {getContent} from 'lib/content'
import {fromLocalesToAlternates} from 'lib/mappers'

export default function LegalNotice(props: StaticPageProps) {
  return (
    <StaticPage {...props} noindex>
      <LegalHolder />
    </StaticPage>
  )
}

export async function getStaticProps({locales, locale, defaultLocale}) {
  const category = 'legal'
  const page = 'legal-notice'
  const content = await getContent({locale, page, category})
  const alternates = await Promise.all(
    locales.map(await fromLocalesToAlternates({defaultLocale, page, category}))
  )

  return {
    props: {content, section: page, alternates}
  }
}
