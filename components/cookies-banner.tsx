import {useEffect, useState, memo} from 'react'
import useTranslation from 'next-translate/useTranslation'
import {useCookieConsentContext} from '@use-cookie-consent/react'
import CookiesModal from './cookies-modal'
import Button from './button'
import Article from './article'
import {COOKIES_BY_TYPE} from 'config'
import {camelCase} from 'change-case'

function CookiesBanner() {
  const {t} = useTranslation()
  const {consent, acceptAllCookies, declineAllCookies, cookies} =
    useCookieConsentContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  // Deliberately starts false and is only ever set from the effect below.
  // `consent` comes from a cookie, so the server, which has none, always falls
  // back to the library's `{necessary: true}` default and would render the
  // banner, while a returning visitor's browser reads their real choice and
  // would not. Deriving this during render therefore breaks hydration for
  // everyone who has already answered. Waiting for the effect means both sides
  // render nothing on the first pass and only the client fills it in.
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
    // Intentional: see the note on the state declaration. Deriving this during
    // render instead is what caused a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
            <Button
              onClick={acceptAllCookies}
              title={t('legal.cookies.modal.actions.accept-all.description')}
            >
              {t('legal.cookies.modal.actions.accept-all.name')}
            </Button>

            <Button
              onClick={declineAllCookies}
              title={t('legal.cookies.modal.actions.reject-all.description')}
            >
              {t('legal.cookies.modal.actions.reject-all.name')}
            </Button>

            <Button
              intent="light"
              onClick={openModal}
              title={t('legal.cookies.modal.actions.open-modal.description')}
            >
              <span className="font-medium">
                {t('legal.cookies.modal.actions.open-modal.name')}
              </span>
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

export default memo(CookiesBanner)

CookiesBanner.displayName = 'CookiesBanner'
