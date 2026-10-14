import {useEffect, useState} from 'react'
import useTranslation from 'next-translate/useTranslation'
import {PERSONAL_INFO, SITE_NAME} from 'config'

interface Holder {
  name: string
  nif: string
  address: string
}

// Fetched on the client rather than rendered with the page, so the tax ID and
// the address are not part of the HTML that a crawler or a scraper downloads.
export default function LegalHolder() {
  const {t} = useTranslation()
  const [holder, setHolder] = useState<Holder | null>(null)
  const [hasFailed, setHasFailed] = useState(false)

  useEffect(() => {
    async function getHolder() {
      try {
        const response = await fetch('/api/legal-holder')

        if (!response.ok) return setHasFailed(true)

        setHolder(await response.json())
      } catch {
        setHasFailed(true)
      }
    }

    getHolder()
  }, [])

  const rows = [
    {key: 'name', value: holder?.name ?? (hasFailed ? SITE_NAME : null)},
    ...(hasFailed
      ? []
      : [
          {key: 'nif', value: holder?.nif ?? null},
          {key: 'address', value: holder?.address ?? null}
        ]),
    {key: 'email', value: PERSONAL_INFO.email}
  ]

  // The address is written over two lines, so its placeholder takes two as
  // well, or the card would jump in height when the data arrives. Each bar sits
  // in a line as tall as a line of text for the same reason.
  const placeholderLines: Record<string, string[]> = {
    address: ['w-44', 'w-32']
  }

  return (
    <dl
      aria-busy={!holder && !hasFailed}
      className="mx-auto mt-12 grid max-w-2xl gap-y-3 rounded-lg bg-gradient-to-tl from-neutral-800/60 p-6 text-sm sm:grid-cols-[max-content_1fr] sm:gap-x-6"
    >
      {rows.map(({key, value}) => (
        <div key={key} className="contents">
          <dt className="font-light text-neutral-300/30">
            {t(`legal.holder.${key}`)}
          </dt>

          <dd
            className={`font-medium text-neutral-300/90${
              key === 'address' ? ' whitespace-pre-line' : ''
            }`}
          >
            {value === null ? (
              (placeholderLines[key] ?? ['w-36']).map((width, line) => (
                <span key={line} className="flex h-5 items-center">
                  <span
                    className={`h-3 ${width} animate-pulse rounded bg-neutral-700/40`}
                  />
                </span>
              ))
            ) : key === 'email' ? (
              <a href={`mailto:${value}`} className="hover:text-orange-200">
                {value}
              </a>
            ) : (
              value
            )}
          </dd>
        </div>
      ))}

      {hasFailed && (
        <p className="text-xs font-light text-neutral-300/60 sm:col-span-2">
          {t('legal.holder.unavailable')}
        </p>
      )}
    </dl>
  )
}

LegalHolder.displayName = 'LegalHolder'
