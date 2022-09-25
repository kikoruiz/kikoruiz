import SocialLinks from './social-links.js'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="p-6 md:flex md:justify-between">
      <p className="mb-3 flex self-center md:mb-0">{`© ${year} Kiko Ruiz`}</p>
      <SocialLinks />
    </footer>
  )
}
