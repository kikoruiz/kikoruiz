import {useRouter} from 'next/router.js'
import useTranslation from 'next-translate/useTranslation'
import SocialLinks from './social-links.js'

export default function Footer({alternates}) {
  const {locales, locale: currentLocale, push} = useRouter()
  const {t} = useTranslation()
  const year = new Date().getFullYear()

  function handleLanguageChange(event) {
    const origin = window.location.origin
    const locale = event.target.value
    const destination = alternates
      .find(alternate => alternate.locale === locale)
      .href.split(origin)[1]

    if (locale !== currentLocale) {
      push(destination, destination, {locale})
    }
  }

  return (
    <footer className="container relative mx-auto mt-auto px-4 pt-24 pb-12 after:absolute after:left-0 after:top-12 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:via-neutral-600 sm:pb-16 sm:pt-32 sm:after:top-16">
      <div className="md:flex md:items-center md:justify-between">
        <div>
          <label htmlFor="languages" className="mb-2 block text-neutral-400">
            {t('languages.selector.label')}
          </label>
          <select
            id="languages"
            className="block w-full text-neutral-900"
            onChange={handleLanguageChange}
            defaultValue={currentLocale}
          >
            {locales.map(locale => (
              <option key={`language-${locale}`} value={locale}>
                {t(`languages.names.${locale}`)}
              </option>
            ))}
          </select>
        </div>

        <SocialLinks />
      </div>

      <div>
        <p className="mb-8 flex self-center md:mb-0">{`Copyright © ${year} Kiko Ruiz`}</p>
      </div>
    </footer>
  )
}
