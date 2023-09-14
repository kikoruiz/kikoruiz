import {ReactNode} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import {getPlaiceholder} from 'plaiceholder'
import {fromLocalesToAlternates} from 'lib/mappers'
import {themeScreens} from 'lib/utils'
import {PERSONAL_INFO} from 'config'
import Article from 'components/article'
import Image from 'components/image'
import {Alternate, StaticContent} from 'types'
import {Image as ImageInterface, ImageFallbackStyle} from 'types/gallery'
import {getContent} from 'lib/content'

export default function AboutMe({
  avatar,
  description,
  alternates
}: AboutMeProps) {
  const {locale} = useRouter()
  const {t} = useTranslation()
  const bodyImage = avatar as ImageInterface

  return (
    <>
      <Head>
        <title>{`Kiko Ruiz / ${t('sections.about-me.name')}`}</title>
        <meta name="description" content={t('sections.about-me.description')} />
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <section className="flex flex-col-reverse p-6 sm:flex-row sm:py-0">
        <div className="mt-16 w-full sm:mb-12 sm:mr-6 sm:mt-0 sm:w-1/3 lg:mr-12">
          <Image
            src={avatar.src}
            alt={t('sections.about-me.name')}
            className="mx-12 mb-6 hidden aspect-square overflow-hidden rounded-full border-8 border-neutral-600/30 sm:mx-4 sm:block md:mx-6 xl:mx-14"
            sizes={avatar.sizes}
            fallbackStyle={avatar.css}
            isFullRounded
          />

          <dl className="rounded-lg bg-gradient-to-tl from-neutral-800/60 px-6 sm:px-3">
            {Object.keys(PERSONAL_INFO).map(key => {
              const value = PERSONAL_INFO[key]

              function description(): ReactNode {
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

        <Article
          content={description.body}
          contentImages={[bodyImage]}
          className="mt-9 flex-1 sm:mt-0"
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
  } as Avatar
  const {css} = await getPlaiceholder(avatar.src)
  avatar.css = css
  const section = 'about-me'
  const description = await getContent({locale, page: section})
  const alternates = await Promise.all(
    locales.map(await fromLocalesToAlternates({defaultLocale, section}))
  )

  return {
    props: {avatar, description, section, alternates}
  }
}

function personalInfoBackground(key: string) {
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

type Avatar = {
  src: string
  sizes: string
  css?: ImageFallbackStyle
}

interface AboutMeProps {
  avatar: Avatar
  description: StaticContent
  alternates: Alternate[]
}
