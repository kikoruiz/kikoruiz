import {useMenuContext} from '../context/menu.js'
import Header from '../components/header.js'
import Footer from '../components/footer.js'

export default function Layout({children, album}) {
  const {isMenuOpen} = useMenuContext()

  return (
    <div
      className={`flex min-h-screen flex-col${isMenuOpen ? ' touch-none' : ''}`}
    >
      <Header album={album} />
      <main
        className={`container mx-auto${
          isMenuOpen ? ' pointer-events-none' : ''
        }`}
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}
