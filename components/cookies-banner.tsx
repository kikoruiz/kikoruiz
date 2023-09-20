import {useEffect, useState} from 'react'
import {useCookieConsentContext} from '@use-cookie-consent/react'
import CookiesModal from './cookies-modal'
import CookiesButton from './cookies-button'
import Link from 'next/link'

export default function CookiesBanner() {
  const {consent, acceptAllCookies} = useCookieConsentContext()
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
        <div className="fixed bottom-6 right-6 left-6 sm:left-auto bg-gradient-to-b from-neutral-800 to-neutral-900 drop-shadow-2xl rounded border-2 border-neutral-600 sm:w-1/2 text-sm font-thin p-3 md:p-6 z-20">
          <p className="leading-relaxed">
            ¡Hola! 🍪 Utilizamos <span className="font-bold">cookies</span>{' '}
            propias y de terceros para mejorar tu experiencia en nuestro sitio
            web y ofrecerte contenido personalizado. Puedes aceptar todas las
            cookies o configurarlas según tus preferencias. Para más
            información, consulta nuestra{' '}
            <Link href={'/politica-de-cookies'}>Política de cookies</Link>.
          </p>

          <div className="flex flex-col-reverse lg:flex-row-reverse gap-3 mt-6">
            <CookiesButton
              intent="light"
              onClick={acceptAllCookies}
              title="Acepta el uso de todas las cookies en nuestro sitio web. Esto nos ayuda a mejorar nuestros servicios y ofrecerte una experiencia personalizada."
            >
              <span className="font-medium">Aceptar todas las cookies</span>
            </CookiesButton>

            <CookiesButton
              onClick={openModal}
              title="Personaliza tu configuración de cookies u obtén más información sobre cómo las utilizamos."
            >
              Configurar cookies
            </CookiesButton>
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
