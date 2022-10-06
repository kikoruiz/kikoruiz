import Header from '../components/header.js'
import Footer from '../components/footer.js'

export default function Layout({children, alternates, ...sectionData}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header {...sectionData} />
      <main className="container mx-auto sm:pt-12">{children}</main>
      <Footer alternates={alternates} />
    </div>
  )
}
