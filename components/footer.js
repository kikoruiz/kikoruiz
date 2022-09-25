import SocialLinks from './social-links.js'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="px-6 py-12 md:flex md:justify-between">
      <p className="mb-12 flex self-center md:mb-0">{`© ${year} Kiko Ruiz`}</p>
      <SocialLinks />
    </footer>
  )
}
