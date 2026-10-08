import {useState} from 'react'
import useTranslation from 'next-translate/useTranslation'
import {Alternate} from 'types'
import {fromLocalesToAlternates} from 'lib/mappers'
import {getDownloads} from 'lib/store/downloads'
import {Download} from 'types/store'
import StorePage from 'components/store-page'
import DownloadCard from 'components/download-card'
import {getAbsoluteUrl, getSocialImageUrl} from 'lib/utils'
import {DEFAULT_DOWNLOAD_TIER, DOWNLOAD_VARIANTS} from 'config/store'

interface DownloadsPageProps {
  alternates: Alternate[]
  downloads: Download[]
  image: string
}

export default function DownloadsPage({
  alternates,
  downloads,
  image
}: DownloadsPageProps) {
  const {t} = useTranslation()
  const [tier, setTier] = useState(DEFAULT_DOWNLOAD_TIER)

  return (
    <StorePage
      title={t('store.categories.downloads.name')}
      description={t('store:downloads.description')}
      alternates={alternates}
      image={image}
    >
      <section className="px-6">
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3 sm:justify-end mb-6">
          <label
            htmlFor="filter-tier"
            className="mx-2 text-xs text-neutral-500"
          >
            {t('store:downloads.tier')}:
          </label>

          <select
            id="filter-tier"
            className="block appearance-none rounded-md border border-neutral-700 bg-neutral-800 bg-select bg-[length:0.75rem] bg-[right_0.5rem_center] bg-no-repeat py-1.5 pl-3 pr-7 text-xs shadow-sm focus:border-orange-300/60 focus:outline-none focus:ring-orange-300/60"
            onChange={event => {
              setTier(event.target.value)
            }}
            defaultValue={DEFAULT_DOWNLOAD_TIER}
          >
            {DOWNLOAD_VARIANTS.map(({tier: option}) => (
              <option key={option} value={option}>
                {t(`store:downloads.tiers.${option}`)}
              </option>
            ))}
          </select>
        </div>

        <p className="mb-9 text-sm font-light text-neutral-300/60">
          {t('store:downloads.notice')}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-9">
          {downloads.map(download => (
            <DownloadCard
              key={`${download.id}-${tier}`}
              {...download}
              variant={download.variants.find(variant => variant.tier === tier)}
            />
          ))}
        </div>
      </section>
    </StorePage>
  )
}

export async function getStaticProps({locale, locales, defaultLocale}) {
  const section = 'store'
  const subSection = 'downloads'
  const alternates = await Promise.all(
    locales.map(
      await fromLocalesToAlternates({
        defaultLocale,
        section,
        subSection
      })
    )
  )
  const downloads = await getDownloads({locale})
  const image = getAbsoluteUrl(getSocialImageUrl(downloads[0].image.src))

  return {
    props: {section, subSection, alternates, downloads, image}
  }
}
