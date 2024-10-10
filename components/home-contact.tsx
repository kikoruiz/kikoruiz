import useTranslation from 'next-translate/useTranslation'
import HomeBlock from './home-block'
import IconEnvelope from 'assets/icons/envelope.svg'
import IconEnvelopeOpen from 'assets/icons/envelope-open.svg'
import LogoWhatsApp from 'assets/logos/social/whatsapp.svg'
import {PERSONAL_INFO, BRANDS} from 'config'
import {getSlug} from 'lib/utils'
import useLayoutContext from 'contexts/Layout'

const altContactInfo = BRANDS.SOCIAL.find(({slug}) => slug === 'whatsapp')

export default function HomeContact() {
  const {layout} = useLayoutContext()
  const headerHeight = layout?.headerHeight || 0
  const {t} = useTranslation('home')
  const links = [
    {
      label: PERSONAL_INFO.email,
      href: `mailto:${PERSONAL_INFO.email}`,
      class:
        'group hover:scale-105 hover:border-orange-300 hover:text-orange-300',
      icon: (
        <>
          <IconEnvelope className="absolute w-6 transition-opacity group-hover:opacity-0 md:w-9 lg:w-12" />
          <IconEnvelopeOpen className="w-6 opacity-0 transition-opacity group-hover:opacity-100 md:w-9 lg:w-12" />
        </>
      )
    },
    {
      label: altContactInfo.name,
      href: altContactInfo.url,
      target: '_blank',
      class: 'hover:scale-105 hover:border-[currentColor] hover:text-[#25d366]',
      icon: <LogoWhatsApp className="w-6 md:w-9 lg:w-12" />
    }
  ]

  return (
    <HomeBlock className="relative px-3 py-12 text-center before:absolute before:bottom-0 before:left-0 before:block before:h-[1px] before:w-full before:bg-gradient-to-r before:from-transparent before:via-orange-300/30 after:absolute after:left-0 after:top-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:via-orange-300/30 md:p-16">
      <span
        id={getSlug(t('contact.name'))}
        aria-hidden="true"
        className="absolute"
        style={{top: `-${headerHeight}px`}}
      />

      <header className="mb-9 md:mb-12">
        <h2 className="bg-gradient-to-t from-orange-300 via-orange-300/80 to-orange-300/40 bg-clip-text text-3xl font-extralight leading-tight text-transparent drop-shadow md:text-5xl md:leading-snug">
          {t('contact.title')}
        </h2>
      </header>

      <div className="inline-flex flex-col justify-center gap-6 text-xl font-bold text-neutral-300/90 md:flex-row md:items-center md:text-3xl lg:gap-9 lg:text-4xl">
        {links.map(({label, href, target, class: className, icon}) => (
          <a
            key={getSlug(label)}
            href={href}
            target={target}
            className={`flex justify-center rounded-full border border-neutral-600 bg-gradient-to-b from-neutral-800/60 px-8 py-5 drop-shadow-lg transition-transform md:p-9 lg:p-12 ${className}`}
            title={label}
          >
            <span className="flex items-center gap-2 lg:gap-4">
              {icon}
              {label}
            </span>
          </a>
        ))}
      </div>
    </HomeBlock>
  )
}

HomeContact.displayName = 'HomeContact'
