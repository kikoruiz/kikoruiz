import Head from 'next/head'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'
import {getPlaiceholder} from 'plaiceholder'
import {fromLocalesToAlternates} from '../lib/mappers.js'
import {getDescription} from '../lib/about-me.js'
import {themeScreens} from '../lib/utils.js'

export default function AboutMe({avatar, description, alternates}) {
  const {t} = useTranslation()

  return (
    <>
      <Head>
        <title>Kiko Ruiz</title>
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <section className="flex flex-col p-6 sm:flex-row sm:p-0">
        <div className="w-full px-24 sm:mr-6 sm:w-1/3 sm:px-0 md:px-6 xl:px-12 2xl:px-24">
          <div className="relative mb-6 aspect-square overflow-hidden rounded-full border-8 border-neutral-600/30 sm:mb-0">
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
