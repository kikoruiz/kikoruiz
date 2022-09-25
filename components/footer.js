export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="flex p-6">
      <p>{`© ${year} Kiko Ruiz`}</p>
    </footer>
  )
}
