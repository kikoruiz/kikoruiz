import {useState} from 'react'
import useTranslation from 'next-translate/useTranslation'
import {useCookieConsentContext} from '@use-cookie-consent/react'
import {camelCase} from 'change-case'
import CookiesButton from './cookies-button'
import CookiesCollapsible from './cookies-collapsible'
import {COOKIES_BY_TYPE} from 'config'

const cookiesByType = Object.keys(COOKIES_BY_TYPE)
const defaultConsents = cookiesByType.reduce(
  (consents, consent) => ({...consents, [camelCase(consent)]: true}),
  {}
)

export default function CookiesModal({
  isModalOpen,
  setIsModalOpen
}: CookiesModalProps) {
  const {t} = useTranslation()
  const {acceptCookies, acceptAllCookies, declineAllCookies} =
    useCookieConsentContext()
  const [consents, setConsents] = useState(defaultConsents)

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

      <div className="fixed w-screen h-screen sm:h-auto sm:max-h-[calc(100vh-3rem)] overflow-y-auto text-sm top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 max-w-xl bg-neutral-900 drop-shadow-xl rounded border border-neutral-800 p-12">
        <div className="absolute right-3 top-3 z-20 flex flex-row-reverse gap-3 sm:right-6 sm:top-6">
          <button
            aria-label={t('legal.cookies.modal.close')}
            title={t('legal.cookies.modal.close')}
            className="group relative flex h-11 w-11 rounded-full bg-gradient-to-t from-neutral-800 text-neutral-400 drop-shadow-xl hover:text-neutral-300 focus:outline-none"
            onClick={closeModal}
          >
            <span className="sr-only">{t('legal.cookies.modal.close')}</span>

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

        <header className="font-bold text-3xl mr-12 mt-6">
          {t('legal.cookies.modal.title')}
        </header>

        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-3 my-9">
            {cookiesByType.map(consent => {
              const id = camelCase(consent)

              return (
                <CookiesCollapsible
                  key={id}
                  id={id}
                  consents={consents}
                  setConsents={setConsents}
                />
              )
            })}
          </div>

          <div className="flex flex-col-reverse lg:flex-row-reverse gap-3">
            <CookiesButton
              size="large"
              intent="light"
              onClick={() => {
                acceptAllCookies()
                closeModal()
              }}
              title={t('legal.cookies.modal.actions.accept-all.description')}
            >
              <span className="font-medium">
                {t('legal.cookies.modal.actions.accept-all.name')}
              </span>
            </CookiesButton>

            <CookiesButton
              size="large"
              onClick={() => {
                acceptCookies({...consents})
                closeModal()
              }}
              title={t('legal.cookies.modal.actions.save.description')}
            >
              {t('legal.cookies.modal.actions.save.name')}
            </CookiesButton>

            <CookiesButton
              size="large"
              onClick={() => {
                declineAllCookies()
                closeModal()
              }}
              title={t('legal.cookies.modal.actions.reject-all.description')}
            >
              {t('legal.cookies.modal.actions.reject-all.name')}
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
