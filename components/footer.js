import SocialLinks from './social-links.js'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="container relative mx-auto mt-auto px-6 pt-24 pb-12 after:absolute after:left-0 after:top-12 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:via-neutral-600 sm:pb-16 sm:pt-32 sm:after:top-16 md:flex md:justify-between">
      <p className="mb-8 flex self-center md:mb-0">{`© ${year} Kiko Ruiz`}</p>
      <SocialLinks />
    </footer>
  )
}
