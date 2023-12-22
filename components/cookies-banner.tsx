import {useEffect, useState} from 'react'
import useTranslation from 'next-translate/useTranslation'
import {useCookieConsentContext} from '@use-cookie-consent/react'
import CookiesModal from './cookies-modal'
import CookiesButton from './cookies-button'
import Article from './article'
import {COOKIES_BY_TYPE} from 'config'
import {camelCase} from 'change-case'

export default function CookiesBanner() {
  const {t} = useTranslation()
  const {consent, acceptAllCookies, declineAllCookies, cookies} =
    useCookieConsentContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [needsBanner, setNeedsBanner] = useState(false)

  function openModal() {
    setIsModalOpen(true)
  }

  useEffect(() => {
    const consents = Object.keys(consent)

    function cleanCookies() {
      const cookiesByType = Object.keys(COOKIES_BY_TYPE)
      const cookieTypes = cookiesByType.filter(type => type !== 'NECESSARY')
      const allCookies = Object.keys(cookies.getAll())
      let cookiesToClean = []

      cookieTypes.forEach(type => {
        const cookieType = camelCase(type)
        const hasToBeCleaned = !consent[cookieType]

        if (hasToBeCleaned) {
          COOKIES_BY_TYPE[type].forEach(({prefix}) => {
            cookiesToClean = [
              ...cookiesToClean,
              ...allCookies.filter(key => key.includes(prefix))
            ]
          })
        }
      })

      const options =
        window.location.hostname === 'localhost' ? {} : {domain: '.kikoruiz.es'}

      cookiesToClean.forEach(key => {
        cookies.remove(key, options)
      })
    }

    cleanCookies()
    setNeedsBanner(consents.length === 1 && consents.includes('necessary'))
  }, [consent, cookies, setNeedsBanner])

  return (
    <>
      {needsBanner && (
        <div className="fixed bottom-3 right-3 left-3 md:bottom-6 md:right-6 md:left-auto bg-gradient-to-b from-neutral-800 to-neutral-900 drop-shadow-2xl rounded border-2 border-neutral-600 md:w-1/2 p-3 md:p-6 z-20">
          <Article
            content={t('legal.cookies.banner.description')}
            className="prose-p:text-sm prose-p:font-extralight prose-p:text-neutral-300 prose-p:leading-relaxed"
          />

          <div className="flex flex-col-reverse lg:flex-row-reverse gap-3 mt-6">
            <CookiesButton
              onClick={acceptAllCookies}
              title={t('legal.cookies.modal.actions.accept-all.description')}
            >
              {t('legal.cookies.modal.actions.accept-all.name')}
            </CookiesButton>

            <CookiesButton
              onClick={declineAllCookies}
              title={t('legal.cookies.modal.actions.reject-all.description')}
            >
              {t('legal.cookies.modal.actions.reject-all.name')}
            </CookiesButton>

            <CookiesButton
              intent="light"
              onClick={openModal}
              title={t('legal.cookies.modal.actions.open-modal.description')}
            >
              <span className="font-medium">
                {t('legal.cookies.modal.actions.open-modal.name')}
              </span>
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
