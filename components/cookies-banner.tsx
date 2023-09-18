import {PropsWithChildren, useEffect, useState} from 'react'
import {useCookieConsentContext} from '@use-cookie-consent/react'
import CookiesModal from './cookies-modal'

const Button = ({
  children,
  title,
  ...props
}: PropsWithChildren<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      title={title}
      className="py-1.5 px-3 rounded font-light bg-gradient-to-b transition-shadow hover:ring hover:ring-orange-300 hover:text-black hover:from-white hover:to-neutral-200 from-neutral-100 to-neutral-300 text-neutral-900"
    >
      {children}
    </button>
  )
}

export default function CookiesBanner() {
  const {consent, acceptAllCookies, declineAllCookies} =
    useCookieConsentContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [needsBanner, setNeedsBanner] = useState(false)

  function openModal() {
    setIsModalOpen(true)
  }

  useEffect(() => {
    const consents = Object.keys(consent)

    setNeedsBanner(consents.length === 1 && consents.includes('necessary'))
  }, [consent, setNeedsBanner])

  return (
    <>
      {needsBanner && (
        <div className="fixed bottom-6 right-6 left-6 sm:left-auto bg-gradient-to-b from-neutral-900 via-neutral-900 to-black drop-shadow-2xl rounded border-2 border-neutral-600 sm:w-1/2 text-sm font-thin p-3 md:p-6 z-20">
          <p className="leading-relaxed">
            ¡Hola! 🍪 Utilizamos <span className="font-bold">cookies</span>{' '}
            propias y de terceros para mejorar tu experiencia en nuestro sitio
            web y ofrecerte contenido personalizado. Puedes aceptar todas las
            cookies o configurarlas según tus preferencias.
          </p>

          <div className="flex flex-col-reverse lg:flex-row-reverse gap-3 mt-6">
            <Button
              onClick={acceptAllCookies}
              title="Acepta el uso de todas las cookies en nuestro sitio web. Esto nos ayuda a mejorar nuestros servicios y ofrecerte una experiencia personalizada."
            >
              <span className="font-medium">Aceptar todas las cookies</span>
            </Button>

            <Button
              onClick={declineAllCookies}
              title="Declina el uso de todas las cookies, aunque esto puede afectar la funcionalidad de nuestro sitio web. Para más información, consulta nuestra Política de cookies."
            >
              Rechazar todas las cookies
            </Button>

            <Button
              onClick={openModal}
              title="Personaliza tu configuración de cookies u obtén más información sobre cómo las utilizamos."
            >
              Configurar cookies
            </Button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <CookiesModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </>
  )
}
