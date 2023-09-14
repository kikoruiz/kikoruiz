import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import SocialLinks from './social-links'
import IconLanguage from 'assets/icons/language.svg'
import {Alternate} from 'types'
import FooterLinks from './footer-links'

export default function Footer({alternates}: FooterProps) {
  const {locales, locale: currentLocale, push} = useRouter()
  const {t} = useTranslation()
  const year = new Date().getFullYear()

  function handleLanguageChange(event) {
    const origin = window.location.origin
    const locale = event.target.value as string
    const destination = alternates
      .find(alternate => alternate.locale === locale)
      .href.split(origin)[1]

    if (locale !== currentLocale) {
      push(destination, destination, {locale})
    }
  }

  return (
    <footer className="container relative mx-auto mt-12 px-6 pb-12 pt-16 after:absolute after:left-0 after:top-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:via-neutral-600 sm:mt-0 sm:pb-16 sm:pt-32 sm:after:top-16">
      <div className="flex gap-12 flex-col lg:flex-row items-start justify-between">
        <div className="flex items-center text-sm md:mb-0">
          <label
            htmlFor="languages"
            aria-label={t('languages.selector.label')}
            title={t('languages.selector.label')}
            className="mr-2 inline-flex items-center text-neutral-500"
          >
            <IconLanguage className="w-6" />
            <span aria-hidden className="hidden">
              {t('languages.selector.label')}
            </span>
          </label>
          <select
            id="languages"
            className="block appearance-none rounded-md border border-neutral-700 bg-neutral-800 bg-select bg-[length:0.75rem] bg-[right_0.5rem_center] bg-no-repeat py-1.5 pl-3 pr-7 shadow-sm focus:border-orange-300/60 focus:outline-none focus:ring-orange-300/60"
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

        <FooterLinks />

        <SocialLinks />
      </div>

      <div className="mt-12">
        <p className="flex self-center">{`Copyright © ${year} Kiko Ruiz`}</p>
      </div>
    </footer>
  )
}

interface FooterProps {
  alternates: Alternate[]
}
