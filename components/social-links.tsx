import {BRANDS} from 'config'
import logos from './social-logos'

export default function SocialLinks() {
  return (
    <ul className="flex flex-wrap">
      {BRANDS.SOCIAL.map(({name, slug, url}) => {
        const Logo = logos[`Logo${name}`]

        return (
          <li key={slug} className="mr-2 mb-2 flex last-of-type:mr-0 md:mb-0">
            <a
              title={name}
              className="group flex h-fit rounded-full bg-gradient-to-t from-neutral-800 to-neutral-800 p-3 transition hover:from-neutral-800"
              href={url}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <Logo
                className={`h-6 w-6 fill-neutral-300 transition-colors ${hoverClassName(
                  slug
                )}`}
              />
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function hoverClassName(slug: string) {
  switch (slug) {
    case '500px':
      return 'group-hover:fill-[#ffffff]'
    case 'facebook':
      return 'group-hover:fill-[#1877f2]'
    case 'github':
      return 'group-hover:fill-[#ffffff]'
    case 'instagram':
      return 'group-hover:fill-[#ff0069]'
    case 'linkedin':
      return 'group-hover:fill-[#0082be]'
    case 'nextjs':
      return 'group-hover:fill-[#ffffff]'
    case 'tailwindcss':
      return 'group-hover:fill-[#38bdf8]'
    case 'twitter':
      return 'group-hover:fill-[#1d9bf0]'
    case 'vercel':
      return 'group-hover:fill-[#ffffff]'
    case 'vero':
      return 'group-hover:fill-[#00cccc]'
    case 'whatsapp':
      return 'group-hover:fill-[#25d366]'
    case 'youtube':
      return 'group-hover:fill-[#ff0000]'
    default:
      return 'group-hover:fill-[#ffffff]'
  }
}
