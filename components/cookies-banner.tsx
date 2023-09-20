import {useEffect, useState} from 'react'
import useTranslation from 'next-translate/useTranslation'
import {useCookieConsentContext} from '@use-cookie-consent/react'
import CookiesModal from './cookies-modal'
import CookiesButton from './cookies-button'
import Article from './article'

export default function CookiesBanner() {
  const {t} = useTranslation()
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
        <div className="fixed bottom-6 right-6 left-6 sm:left-auto bg-gradient-to-b from-neutral-800 to-neutral-900 drop-shadow-2xl rounded border-2 border-neutral-600 sm:w-1/2 p-3 md:p-6 z-20">
          <Article
            content={t('legal.cookies.banner.description')}
            className="prose-p:text-sm prose-p:font-thin prose-p:text-neutral-300 prose-p:leading-relaxed"
          />

          <div className="flex flex-col-reverse lg:flex-row-reverse gap-3 mt-6">
            <CookiesButton
              intent="light"
              onClick={acceptAllCookies}
              title={t('legal.cookies.modal.actions.accept-all.description')}
            >
              <span className="font-medium">
                {t('legal.cookies.modal.actions.accept-all.name')}
              </span>
            </CookiesButton>

            <CookiesButton
              onClick={openModal}
              title={t('legal.cookies.modal.actions.open-modal.description')}
            >
              {t('legal.cookies.modal.actions.open-modal.name')}
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
