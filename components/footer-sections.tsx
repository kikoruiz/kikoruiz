import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import {getSlug} from 'lib/utils'
import {SECTIONS} from 'config'

export default function FooterSections() {
  const {t} = useTranslation()

  return (
    <>
      {SECTIONS.map(section => {
        const sectionName = t(`sections.${section.id}.name`)
        const sectionHref = `/${getSlug(sectionName)}`

        return (
          <div key={section.id}>
            <header className="font-bold mb-1.5">
              <Link
                href={sectionHref}
                title={sectionName}
                className="text-neutral-100 hover:text-neutral-300 transition-colors"
              >
                {sectionName}
              </Link>
            </header>

            {section.categories && (
              <ul>
                {section.categories.map(category => {
                  const categoryName = t(
                    `${section.localePrefix}${category.id}.name`
                  )
                  const categoryHref = `${sectionHref}/${getSlug(categoryName)}`

                  return (
                    <li key={category.id} className="font-light">
                      <Link
                        href={categoryHref}
                        title={categoryName}
                        className="text-neutral-300/60 hover:text-neutral-300 transition-colors"
                      >
                        {categoryName}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )
      })}
    </>
  )
}

FooterSections.displayName = 'FooterSections'
