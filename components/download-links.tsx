import {useEffect, useState} from 'react'
import useTranslation from 'next-translate/useTranslation'
import IconDocumentArrowDown from 'assets/icons/document-arrow-down.svg'

interface DownloadLink {
  id: string
  name: string
  tier: string
  url: string
}

export default function DownloadLinks({sessionId}: {sessionId: string}) {
  const {t} = useTranslation('store')
  const [links, setLinks] = useState<DownloadLink[]>([])
  const [hasFailed, setHasFailed] = useState(false)

  useEffect(() => {
    async function getLinks() {
      const response = await fetch(
        `/api/store/downloads?session_id=${sessionId}`
      )

      if (!response.ok) return setHasFailed(true)

      const {downloads} = await response.json()
      setLinks(downloads)
    }

    getLinks()
  }, [sessionId])

  if (hasFailed) {
    return (
      <p className="mx-6 mb-9 text-sm font-light text-neutral-300/60">
        {t('downloads.delivery.error')}
      </p>
    )
  }

  if (links.length === 0) return null

  return (
    <section className="mx-6 mb-12 rounded-md bg-neutral-800 p-6">
      <header className="mb-3 text-2xl font-thin">
        {t('downloads.delivery.title')}
      </header>

      <ul className="divide-y divide-neutral-700">
        {links.map(({id, name, tier, url}) => (
          <li key={id} className="flex items-center justify-between gap-6 py-3">
            <span className="text-sm font-light text-neutral-300/90">
              {name}
              <span className="block text-xs text-neutral-300/30">
                {t(`downloads.tiers.${tier}`)}
              </span>
            </span>

            <a
              href={url}
              title={t('downloads.delivery.download')}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-b from-orange-200 to-orange-400 px-3 py-1.5 text-xs font-light text-orange-800 drop-shadow-md transition-shadow hover:ring-2 hover:ring-orange-200"
            >
              <IconDocumentArrowDown className="h-4 w-4" />
              {t('downloads.delivery.download')}
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-xs font-light text-neutral-300/30">
        {t('downloads.delivery.notice')}
      </p>
    </section>
  )
}

DownloadLinks.displayName = 'DownloadLinks'
