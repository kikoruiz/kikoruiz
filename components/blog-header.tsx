import Link from 'next/link'
import {useRouter} from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import {getSlug} from 'lib/utils'
import BlogTags from './blog-tags'
import Tooltip from './tooltip'
import IconInformationCircle from 'assets/icons/information-circle.svg'
import IconArrowLeft from 'assets/icons/arrow-left.svg'
import IconExclamationTriangle from 'assets/icons/exclamation-triangle.svg'
import {Tag} from 'types'
import {BLOG} from 'config'

export default function BlogHeader({
  tag,
  tags,
  isTagsIndex = false,
  hasNoContent = false
}: BlogHeaderProps) {
  const {locale} = useRouter()
  const {t} = useTranslation('blog')
  const title = isTagsIndex ? t('common:tags') : t('common:sections.blog.name')
  const titleClassName = tag
    ? 'inline-block text-5xl sm:text-6xl'
    : 'truncate text-6xl sm:text-8xl'
  const currentTag = tag && t(`common:blog.tags.${tag}`)
  const sectionSlug = getSlug(t('common:sections.blog.name'))
  const backButtonHref = tag
    ? `/${sectionSlug}/${getSlug(t('common:tags'))}`
    : `/${sectionSlug}`
  const backButtonTitle = tag ? t('list.back-to-tags') : t('list.back-to-all')
  const isBlogIndex = Boolean(tags) && !isTagsIndex

  return (
    <header
      className={`my-9 px-6 text-center ${tag ? 'sm:-mt-1' : 'sm:-mt-3'}`}
    >
      <div className="flex flex-wrap items-center justify-center gap-y-3 sm:flex-row">
        <h1
          className={`bg-gradient-to-t from-orange-300 to-neutral-900 bg-clip-text font-black leading-tight text-transparent drop-shadow sm:leading-tight ${titleClassName}`}
          title={title}
        >
          {title}
        </h1>
        {currentTag && (
          <span className="relative ml-3 inline-flex rounded-l-[2.4rem] rounded-r-md bg-gradient-to-t from-neutral-600/30 to-neutral-600/60 p-3 pl-11 text-3xl font-medium leading-tight text-neutral-900 before:absolute before:left-4 before:top-1/2 before:mt-[-8px] before:h-[16px] before:w-[16px] before:rounded-full before:bg-neutral-900 sm:rounded-l-[4.8rem] sm:rounded-r-lg sm:pl-20 sm:pr-6 sm:text-6xl sm:leading-tight sm:before:left-7 sm:before:mt-[-15px] sm:before:h-[30px] sm:before:w-[30px]">
            {currentTag}
          </span>
        )}

        {!BLOG.AVAILABLE_LOCALES.includes(locale) && (
          <Tooltip
            message={t('common:blog.available-locales.warning')}
            icon={IconInformationCircle}
            className="ml-3"
            direction="bottom"
          />
        )}
      </div>
      {(currentTag || isTagsIndex) && (
        <div
          className={`relative mt-6 pt-3 after:absolute after:left-0 after:top-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent ${
            isBlogIndex ? 'after:via-orange-300/60' : 'after:via-neutral-600'
          }`}
        >
          <Link
            href={backButtonHref}
            title={backButtonTitle}
            className="inline-flex items-center text-xs font-light text-neutral-300/30 hover:text-neutral-300/90 sm:text-sm"
          >
            <IconArrowLeft className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            {backButtonTitle}
          </Link>
        </div>
      )}
      {!currentTag && !isTagsIndex && (
        <>
          <p className="relative mt-3 pb-6 font-light text-neutral-300/60 after:absolute after:bottom-[-1px] after:left-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:via-orange-300/60">
            {t('common:sections.blog.description')}
          </p>

          {!hasNoContent ? (
            <BlogTags tags={tags} />
          ) : (
            <h2 className="mt-12 flex flex-col items-center justify-center text-xl font-bold sm:flex-row">
              <IconExclamationTriangle className="h-12 w-12 sm:mr-3" />
              {t('no-content')}
            </h2>
          )}
        </>
      )}
    </header>
  )
}

interface BlogHeaderProps {
  tag?: string
  tags?: Tag[]
  isTagsIndex?: boolean
  hasNoContent?: boolean
}
