import useTranslation from 'next-translate/useTranslation'
import {useCookieConsentContext} from '@use-cookie-consent/react'
import CookiesButton from './cookies-button'
import {COOKIES_BY_TYPE} from 'config'
import {getSlug} from 'lib/utils'

function Switch({label}: {label: string}) {
  const id = getSlug(label)

  return (
    <div>
      <label for={id} className="text-white text-[15px] leading-none pr-[15px]">
        {label}
      </label>

      <button
        type="button"
        role="switch"
        id={id}
        aria-checked="false"
        data-state="unchecked"
        value="on"
        className="w-[42px] h-[25px] bg-blackA9 rounded-full relative shadow-[0_2px_10px] shadow-blackA7 focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black outline-none cursor-default"
      >
        <span
          data-state="unchecked"
          class="block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-blackA7 transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]"
        />
      </button>
    </div>
  )
}

export default function CookiesModal({
  isModalOpen,
  setIsModalOpen
}: CookiesModalProps) {
  const {t} = useTranslation()
  const {acceptAllCookies, declineAllCookies} = useCookieConsentContext()

  function closeModal() {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <>
      <button
        aria-hidden="true"
        tabIndex={-1}
        className="fixed z-20 inset-0 h-screen w-screen bg-neutral-900/60 backdrop-blur transition-opacity opacity-1 touch-none cursor-pointer"
        onClick={closeModal}
      />

      <div className="fixed text-sm top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 max-w-xl bg-neutral-900 drop-shadow-xl rounded border border-neutral-800 p-12">
        <div className="absolute right-3 top-3 z-20 flex flex-row-reverse gap-3 sm:right-6 sm:top-6">
          <button
            aria-label={t('cookies.modal.close')}
            title={t('cookies.modal.close')}
            className="group relative flex h-11 w-11 rounded-full bg-gradient-to-t from-neutral-800 text-neutral-400 drop-shadow-xl hover:text-neutral-300 focus:outline-none"
            onClick={closeModal}
          >
            <span className="sr-only">{t('cookies.modal.close')}</span>

            <div className="absolute left-1/2 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 transform">
              <span
                aria-hidden="true"
                className="absolute flex h-0.5 w-5 rotate-45 transform bg-current group-hover:bg-current"
              />

              <span
                aria-hidden="true"
                className="absolute flex h-0.5 w-5 -rotate-45 transform bg-current group-hover:bg-current"
              />
            </div>
          </button>
        </div>

        <header className="font-bold text-xl mr-12 mt-6 pb-3">
          Configuración de cookies
        </header>

        <div className="border-t border-neutral-300/60">
          <div>
            {Object.keys(COOKIES_BY_TYPE).map(consent => {
              const id = getSlug(consent)

              return (
                <div key={id}>
                  <Switch label={id} />
                </div>
              )
            })}
          </div>

          <div className="flex flex-col-reverse lg:flex-row-reverse gap-3 mt-6">
            <CookiesButton
              onClick={acceptAllCookies}
              title="Acepta el uso de todas las cookies en nuestro sitio web. Esto nos ayuda a mejorar nuestros servicios y ofrecerte una experiencia personalizada."
            >
              <span className="font-medium">Aceptar todas las cookies</span>
            </CookiesButton>

            <CookiesButton
              onClick={declineAllCookies}
              title="Declina el uso de todas las cookies, aunque esto puede afectar la funcionalidad de nuestro sitio web."
            >
              Rechazar todas las cookies
            </CookiesButton>
          </div>
        </div>
      </div>
    </>
  )
}

interface CookiesModalProps {
  isModalOpen: boolean
  setIsModalOpen: (isModalOpen: boolean) => void
}
