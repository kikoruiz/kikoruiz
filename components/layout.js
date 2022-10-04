import Header from '../components/header.js'
import Footer from '../components/footer.js'

export default function Layout({section, children}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header section={section} />
      <main className="container mx-auto sm:pt-12">{children}</main>
      <Footer />
    </div>
  )
}
