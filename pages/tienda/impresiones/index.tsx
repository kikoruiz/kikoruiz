import useTranslation from 'next-translate/useTranslation'
import {Alternate} from 'types'
import {fromLocalesToAlternates} from 'lib/mappers'
import {getPrints} from 'lib/store/prints'
import {Print} from 'types/store'
import StorePage from 'components/store-page'
import PrintCard from 'components/print-card'

interface PrintsPageProps {
  alternates: Alternate[]
  prints: Print[]
}

export default function PrintsPage({alternates, prints}: PrintsPageProps) {
  const {t} = useTranslation()

  return (
    <StorePage
      title={t('store.categories.prints.name')}
      description={t('sections.store.description')}
      alternates={alternates}
    >
      <section className="px-6">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 xl:gap-9 space-y-6 xl:space-y-9">
          {prints.map(print => (
            <PrintCard key={print.id} {...print} />
          ))}
        </div>
      </section>
    </StorePage>
  )
}

export async function getStaticProps({locale, locales, defaultLocale}) {
  const section = 'store'
  const subSection = 'prints'
  const alternates = await Promise.all(
    locales.map(
      await fromLocalesToAlternates({
        defaultLocale,
        section,
        subSection
      })
    )
  )
  const prints = await getPrints({locale})

  return {
    props: {section, subSection, alternates, prints}
  }
}
