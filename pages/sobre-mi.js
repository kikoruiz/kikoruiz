import Head from 'next/head'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import {getPlaiceholder} from 'plaiceholder'
import {fromLocalesToAlternates} from '../lib/mappers.js'
import {getDescription} from '../lib/about-me.js'
import {themeScreens} from '../lib/utils.js'
import {PERSONAL_INFO} from '../config/index.js'
import Article from '../components/article.js'
import Image from '../components/image.tsx'

export default function AboutMe({avatar, description, alternates}) {
  const {locale} = useRouter()
  const {t} = useTranslation()

  return (
    <>
      <Head>
        <title>{`Kiko Ruiz / ${t('sections.about-me.name')}`}</title>
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <section className="flex flex-col p-6 sm:flex-row sm:py-0">
        <div className="mb-12 w-full sm:mr-6 sm:w-1/3">
          <Image
            src={avatar.src}
            alt={t('sections.about-me.name')}
            className="mx-12 mb-6 aspect-square rounded-full border-8 border-neutral-600/30 sm:mx-4 sm:mb-6 md:mx-6 xl:mx-14"
            sizes={avatar.sizes}
            fallbackStyle={avatar.css}
            isFullRounded
          />

          <dl className="rounded-lg bg-gradient-to-tl from-neutral-800/60 px-6 sm:px-3">
            {Object.keys(PERSONAL_INFO).map(key => {
              const value = PERSONAL_INFO[key]

              function description() {
                switch (key) {
                  case 'phone':
                    return (
                      <a
                        href={`tel:${value}`}
                        className="hover:text-orange-200"
                        title={value}
                      >
                        {value}
                      </a>
                    )
                  case 'email':
                    return (
                      <a
                        href={`mailto:${value}`}
                        className="hover:text-orange-200"
                        title={value}
                      >
                        {value}
                      </a>
                    )
                  case 'location':
                    return (
                      <a
                        href={`https://www.google.es/maps/place/${encodeURIComponent(
                          value
                        )}`}
                        className="hover:text-orange-200"
                        title={value}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                      >
                        {value}
                      </a>
                    )
                  case 'birthday':
                    const date = new Date(value)
                    const birthday = new Intl.DateTimeFormat(locale, {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }).format(date)

                    return birthday
                  default:
                    return value
                }
              }

              return (
                <div
                  className={`${personalInfoBackground(
                    key
                  )} relative border-b border-neutral-800 bg-[length:1.2rem] bg-[left_0.65rem_center] bg-no-repeat py-6 pl-14 before:absolute before:left-0 before:top-1/2 before:-z-10 before:-mt-5 before:h-10 before:w-10 before:rounded-xl before:bg-gradient-to-bl before:from-neutral-700 last:border-0`}
                  key={key}
                >
                  <dt className="text-xs opacity-30">
                    {t(`about-me:personal-info.${key}`)}
                  </dt>
                  <dd className="overflow-hidden text-ellipsis font-semibold">
                    {description()}
                  </dd>
                </div>
              )
            })}
          </dl>
        </div>

        <Article content={description.content} className="flex-1" />
      </section>
    </>
  )
}

export async function getStaticProps({locales, locale, defaultLocale}) {
  const {sm} = themeScreens
  const avatar = {
    src: '/avatar.jpg',
    sizes: `(min-width: ${sm}) 33vw, 100vw`
  }
  const {css} = await getPlaiceholder(avatar.src)
  avatar.css = css
  const section = 'about-me'
  const alternates = await Promise.all(
    locales.map(await fromLocalesToAlternates({defaultLocale, section}))
  )
  const description = getDescription({locale})

  return {
    props: {avatar, description, section, alternates}
  }
}

function personalInfoBackground(key) {
  switch (key) {
    case 'phone':
      return 'bg-personal-info-phone'
    case 'email':
      return 'bg-personal-info-email'
    case 'location':
      return 'bg-personal-info-location'
    case 'birthday':
      return 'bg-personal-info-birthday'
  }
}
