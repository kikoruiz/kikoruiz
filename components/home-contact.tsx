import useTranslation from 'next-translate/useTranslation'
import HomeBlock from './home-block'
import IconEnvelope from 'assets/icons/envelope.svg'
import IconEnvelopeOpen from 'assets/icons/envelope-open.svg'
import LogoWhatsApp from 'assets/logos/social/whatsapp.svg'
import {PERSONAL_INFO, BRANDS} from 'config'

const altContactInfo = BRANDS.SOCIAL.find(({slug}) => slug === 'whatsapp')

export default function HomeContact() {
  const {t} = useTranslation('home')

  return (
    <HomeBlock className="relative px-3 py-12 before:absolute before:bottom-0 before:left-0 before:block before:h-[1px] before:w-full before:bg-gradient-to-r before:from-transparent before:via-orange-300/30 after:absolute after:left-0 after:top-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:via-orange-300/30 md:p-16 md:text-center">
      <header className="mb-9 md:mb-12">
        <h2 className="bg-gradient-to-t from-orange-300 via-orange-300/80 to-orange-300/40 bg-clip-text text-3xl font-extralight leading-tight text-transparent drop-shadow md:text-5xl md:leading-snug">
          {t('contact')}
        </h2>
      </header>

      <div className="flex flex-col justify-center gap-6 text-xl font-bold text-neutral-300/90 md:flex-row md:items-center md:text-3xl lg:gap-9 lg:text-4xl [&>a]:flex [&>a]:items-center [&>a]:gap-2 [&>a]:rounded-full [&>a]:border [&>a]:border-neutral-600 [&>a]:bg-gradient-to-b [&>a]:from-neutral-800/60 [&>a]:px-8 [&>a]:py-5 [&>a]:drop-shadow-lg [&>a]:transition-transform md:[&>a]:p-9 lg:[&>a]:gap-4 lg:[&>a]:p-12">
        <a
          href={`mailto:${PERSONAL_INFO.email}`}
          className="group hover:scale-105 hover:border-orange-300 hover:text-orange-300"
          title={PERSONAL_INFO.email}
        >
          <IconEnvelope className="absolute w-6 transition-opacity group-hover:opacity-0 md:w-9 lg:w-12" />
          <IconEnvelopeOpen className="w-6 opacity-0 transition-opacity group-hover:opacity-100 md:w-9 lg:w-12" />
          {PERSONAL_INFO.email}
        </a>

        <a
          href={altContactInfo.url}
          target="_blank"
          className="hover:scale-105 hover:border-[currentColor] hover:text-[#25d366]"
          title={altContactInfo.name}
        >
          <LogoWhatsApp className="w-6 md:w-9 lg:w-12" />
          {altContactInfo.name}
        </a>
      </div>
    </HomeBlock>
  )
}
