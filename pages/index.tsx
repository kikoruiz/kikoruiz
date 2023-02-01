import Head from 'next/head'
import {Alternate, device, HeroImages} from 'types'
import Hero from 'components/hero'
import {fromLocalesToAlternates} from 'lib/mappers'
import {getHeroImages} from 'lib/home'
import {userAgentFromString} from 'next/server'

export default function Home({heroImages, alternates, device}: HomeProps) {
  return (
    <>
      <Head>
        <title>Kiko Ruiz</title>
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <Hero images={heroImages} device={device} />

      <section className="mt-48 px-3">
        <header className="mb-12 break-words text-center">
          <h1 className="text-5xl font-black">Passion for photography</h1>
        </header>

        <article className="prose text-center text-neutral-300/60">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            posuere ipsum ac quam molestie interdum. Donec scelerisque non
            mauris ut viverra. Pellentesque id vehicula mauris. Mauris ultrices
            pellentesque purus, at ullamcorper lacus viverra consequat. Ut ac
            libero dolor. Sed turpis sem, pharetra non malesuada sed, hendrerit
            sit amet dui. Vivamus vel tristique augue. Fusce sed ipsum id justo
            lobortis maximus.
          </p>
          <p>
            Donec commodo ante ut dui consequat, in dictum elit fringilla. Cras
            eget porta dolor, non mattis sem. In eget arcu eget metus molestie
            facilisis id in eros. Donec sed scelerisque augue. Nam dignissim
            risus vitae imperdiet suscipit. Quisque quis sapien fermentum,
            blandit nibh rhoncus, congue dui. Nullam porttitor magna et nisl
            congue, eu venenatis tellus pulvinar. Nullam in nunc ut eros
            vestibulum tempor. Mauris ac pulvinar erat. Nam sem leo, commodo in
            bibendum sed, ultrices eget dolor. Nulla porttitor eros et mi
            malesuada facilisis. Vestibulum vulputate fringilla ante id
            placerat. Pellentesque eu libero maximus, cursus ipsum sit amet,
            varius velit. Orci varius natoque penatibus et magnis dis parturient
            montes, nascetur ridiculus mus.
          </p>
        </article>
      </section>
    </>
  )
}

export async function getServerSideProps({locales, defaultLocale, req}) {
  const heroImages = await getHeroImages()
  const alternates = (await Promise.all(
    locales.map(await fromLocalesToAlternates({defaultLocale}))
  )) as Alternate[]
  const userAgent = userAgentFromString(req?.headers['user-agent'])
  let device: device

  switch (userAgent.device.type) {
    case 'mobile':
    case 'tablet':
      device = userAgent.device.type
      break
    default:
      device = 'desktop'
      break
  }

  return {
    props: {heroImages, alternates, device}
  }
}

interface HomeProps {
  alternates: Alternate[]
  heroImages: HeroImages
  device: device
}
