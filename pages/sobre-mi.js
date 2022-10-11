import Head from 'next/head'
import Image from 'next/image'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import {getPlaiceholder} from 'plaiceholder'
import {fromLocalesToAlternates} from '../lib/mappers.js'
import {getDescription} from '../lib/about-me.js'
import {themeScreens} from '../lib/utils.js'
import {PERSONAL_INFO} from '../config/index.js'

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

      <section className="flex flex-col p-6 sm:flex-row sm:p-0">
        <div className="mb-6 w-full px-24 sm:mr-6 sm:w-1/3 sm:px-4 md:px-6 xl:px-12 2xl:px-24">
          <div className="relative mb-6 aspect-square overflow-hidden rounded-full border-8 border-neutral-600/30 sm:mb-6">
            <Image
              src={avatar.src}
              layout="fill"
              sizes={avatar.sizes}
              objectFit="cover"
              alt={t('sections.about-me.name')}
              className="rounded-full"
              placeholder="blur"
              blurDataURL={avatar.base64}
              priority
            />
          </div>
          <dl className="px-4">
            {Object.keys(PERSONAL_INFO).map(key => {
              const value = PERSONAL_INFO[key]

              function description() {
                switch (key) {
                  case 'phone':
                    return (
                      <a
                        href={`tel:${value}`}
                        className="hover:text-orange-200"
                      >
                        {value}
                      </a>
                    )
                  case 'email':
                    return (
                      <a
                        href={`mailto:${value}`}
                        className="hover:text-orange-200"
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
                  )} relative border-b border-neutral-800 bg-[length:1.2rem] bg-[left_0.65rem_center] bg-no-repeat py-6 pl-14 before:absolute before:left-0 before:top-1/2 before:-z-10 before:-mt-5 before:h-10 before:w-10 before:rounded-xl before:bg-gradient-to-b before:from-neutral-800 last:border-0`}
                  key={key}
                >
                  <dt className="text-xs opacity-30">
                    {t(`about-me:personal-info.${key}`)}
                  </dt>
                  <dd className="font-semibold">{description()}</dd>
                </div>
              )
            })}
          </dl>
        </div>

        <article
          dangerouslySetInnerHTML={{__html: description.body}}
          className="prose prose-neutral flex-1 prose-headings:text-neutral-300 prose-p:text-neutral-400 prose-a:text-orange-200 hover:prose-a:text-orange-300 hover:prose-a:no-underline prose-strong:text-neutral-300 dark:prose-invert"
        />
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
  const {base64} = await getPlaiceholder(avatar.src)
  avatar.base64 = base64
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
