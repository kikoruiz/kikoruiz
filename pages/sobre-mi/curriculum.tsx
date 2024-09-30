import type {FunctionComponent, SVGProps} from 'react'
import Head from 'next/head'
import {cx, cva, type VariantProps} from 'class-variance-authority'
import Article from 'components/article'
import Logo from 'assets/brand/logo.svg'
import Signature from 'assets/brand/signature.svg'
import {getContent} from 'lib/content'
import {fromLocalesToAlternates} from 'lib/mappers'
import IconAtSymbol from 'assets/icons/at-symbol.svg'
import IconPhone from 'assets/icons/phone.svg'
import IconCursorArrowRays from 'assets/icons/cursor-arrow-rays.svg'
import LogoGithub from 'assets/logos/social/github.svg'
import {Alternate, StaticContent} from 'types'

type SVGIcon = FunctionComponent<SVGProps<SVGSVGElement>>

const RESUME_HEADING = {
  mailto: {
    icon: IconAtSymbol as SVGIcon,
    value: 'hola@kikoruiz.es'
  },
  tel: {
    icon: IconPhone as SVGIcon,
    value: '+34619602535'
  },
  website: {
    icon: IconCursorArrowRays as SVGIcon,
    value: 'www.kikoruiz.es'
  },
  github: {
    icon: LogoGithub as SVGIcon,
    value: 'github.com/kikoruiz'
  }
}
type ResumeHeadingType = (typeof RESUME_HEADING)[keyof typeof RESUME_HEADING]

export interface ResumePageProps {
  content: StaticContent
  alternates: Alternate[]
}

const resumeHeadingStyles = cva(
  'flex gap-3 text-neutral-900/60 font-light text-sm',
  {
    variants: {
      position: {
        center: 'items-center flex-wrap flex-row justify-center lg:gap-9',
        right:
          'absolute flex-col right-6 sm:right-12 top-28 lg:top-24 lg:right-24'
      }
    }
  }
)

type ResumeHeadingProps = VariantProps<typeof resumeHeadingStyles>

function ResumeHeading({position = 'center'}: ResumeHeadingProps) {
  return (
    <div className={resumeHeadingStyles({position})}>
      {Object.keys(RESUME_HEADING).map(key => {
        const {icon: Icon, value}: ResumeHeadingType = RESUME_HEADING[key]
        const isWebsite = key === 'website' || key === 'github'

        return (
          <a
            key={key}
            href={`${isWebsite ? 'https://' : `${key}:`}${value}`}
            target={isWebsite ? '_blank' : ''}
            className="flex items-center justify-end gap-1.5 hover:text-neutral-900"
          >
            <Icon className="size-3 fill-orange-700" />

            {value}
          </a>
        )
      })}
    </div>
  )
}

export default function ResumePage({content, alternates}: ResumePageProps) {
  return (
    <>
      <Head>
        <title>{`Kiko Ruiz / ${content.title}`}</title>
        <meta name="description" content={content.title} />
        {alternates.map(({locale, href}) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
      </Head>

      <section className="relative sm:mx-6 lg:mx-0 mb-3 sm:mb-0 pt-12 px-6 sm:px-9 pb-6 lg:px-24 lg:pt-24 lg:pb-12 bg-gradient-to-bl from-neutral-300 to-white drop-shadow-md hover:drop-shadow-xl before:absolute before:z-10 before:content-[''] before:top-0 before:right-0 before:border-solid before:border-b-[3em] before:border-r-[3em] before:border-y-neutral-100/90 before:border-x-neutral-900 before:transition-[border-width] before:duration-300 hover:before:border-y-neutral-50/90 hover:before:border-x-neutral-900 hover:before:border-b-[4.5em] hover:before:border-r-[4.5em]">
        <ResumeHeading position="right" />

        <header className="flex flex-col lg:flex-row lg:items-end mb-12 lg:mb-32">
          <Logo className="w-60 lg:w-fit fill-orange-300/30" />

          <h1 className="text-neutral-900/75 font-black text-6xl mt-9 lg:mt-0 lg:-ml-36 lg:-mb-20 drop-shadow-sm">
            <span className="block font-thin uppercase text-3xl">
              {content.title}
            </span>{' '}
            Kiko Ruiz Lloret
            <span className="block mt-3 font-bold text-transparent text-3xl bg-gradient-to-tl from-orange-400 to-orange-700 bg-clip-text opacity-75">
              {content.jobTitle}
            </span>
          </h1>
        </header>

        <Article
          content={content.body}
          className={cx([
            // Article wrapper
            'relative',
            'mx-auto',
            // Paragraphs
            '[&>p]:lg:ml-40',
            // Section header
            '[&>h2]:lg:ml-28',
            '[&>h2]:mt-12',
            '[&>h2]:lg:mt-32',
            '[&>h2:has(+h3)]:mb-0',
            '[&>h2]:pt-12',
            '[&>h2]:lg:pt-28',
            '[&>h2]:font-thin',
            '[&>h2]:text-neutral-600/60',
            '[&>h2]:text-5xl',
            '[&>h2]:relative',
            '[&>h2]:border-t',
            '[&>h2]:border-neutral-600/30',
            // Company header
            '[&>h3]:relative',
            '[&>h3]:ml-12',
            '[&>h3]:lg:ml-40',
            '[&>h3]:-mt-2',
            '[&>h3]:mb-0',
            '[&>h3]:pt-20',
            '[&>h3]:pb-3',
            '[&>h3]:text-4xl',
            '[&>h3]:font-extrabold',
            '[&>h3]:before:absolute',
            '[&>h3]:before:-left-12',
            '[&>h3]:before:top-0',
            '[&>h3]:before:transform',
            '[&>h3]:before:translate-x-1/2',
            '[&>h3]:before:ml-1',
            '[&>h3]:before:h-full',
            '[&>h3]:before:w-0.5',
            '[&>h3]:before:bg-orange-200',
            '[&>h2+h3]:before:bg-transparent',
            '[&>h4:has(+h2)]:before:bg-transparent',
            // Job title
            '[&>h4]:relative',
            '[&>h4]:ml-12',
            '[&>h4]:lg:ml-40',
            '[&>h4]:my-0',
            '[&>h4]:text-xl',
            '[&>h4]:font-medium',
            '[&>h4]:before:absolute',
            '[&>h4]:before:-left-12',
            '[&>h4]:before:top-0',
            '[&>h4]:before:transform',
            '[&>h4]:before:translate-x-1/2',
            '[&>h4]:before:ml-1',
            '[&>h4]:before:h-full',
            '[&>h4]:before:w-0.5',
            '[&>h4]:before:bg-orange-200',
            '[&>h4:first-of-type]:before:bg-orange-500',
            // Date
            '[&>p:has(+h4)]:relative',
            '[&>p:has(+h4)]:my-0',
            '[&>p:has(+h4)]:ml-12',
            '[&>p:has(+h4)]:lg:ml-40',
            '[&>p:has(+h4)]:font-extralight',
            '[&>p:has(+h4)]:text-orange-600/60',
            '[&>p:has(+h4:first-of-type)]:text-orange-500',
            '[&>p:has(+h4)]:uppercase',
            '[&>p:has(+h4)]:before:absolute',
            '[&>p:has(+h4)]:before:-left-12',
            '[&>p:has(+h4)]:before:top-1/2',
            '[&>p:has(+h4)]:before:transform',
            '[&>p:has(+h4)]:before:-translate-y-1/2',
            '[&>p:has(+h4)]:before:size-3',
            '[&>p:has(+h4)]:before:rounded-full',
            '[&>p:has(+h4)]:before:border-4',
            '[&>p:has(+h4)]:before:border-orange-300',
            '[&>p:has(+h4:first-of-type)]:before:border-orange-500',
            // Lists
            '[&>ul]:relative',
            '[&>ul]:ml-12',
            '[&>ul]:lg:ml-40',
            '[&>ul]:my-0',
            '[&>ul]:pt-6',
            '[&>ul:has(+p)]:pb-9',
            '[&>ul]:before:absolute',
            '[&>ul]:before:-left-12',
            '[&>ul]:before:top-0',
            '[&>ul]:before:transform',
            '[&>ul]:before:translate-x-1/2',
            '[&>ul]:before:ml-1',
            '[&>ul]:before:h-full',
            '[&>ul]:before:w-0.5',
            '[&>ul]:before:bg-orange-200',
            '[&>ul:first-of-type]:before:bg-gradient-to-b',
            '[&>ul:first-of-type]:before:from-orange-500',
            '[&>ul:first-of-type]:before:to-orange-200',
            '[&>ul>li]:leading-relaxed',
            // List (skills)
            '[&>ul:has(+h2:last-of-type)]:list-none',
            '[&>ul:has(+h2:last-of-type)]:m-0',
            '[&>ul:has(+h2:last-of-type)]:p-0',
            '[&>ul:has(+h2:last-of-type)]:lg:pl-28',
            '[&>ul:has(+h2:last-of-type)]:overflow-hidden',
            '[&>ul:has(+h2:last-of-type)]:flex',
            '[&>ul:has(+h2:last-of-type)]:flex-wrap',
            '[&>ul:has(+h2:last-of-type)]:gap-4',
            '[&>ul:has(+h2:last-of-type)>li]:shrink-0',
            '[&>ul:has(+h2:last-of-type)>li]:m-0',
            '[&>ul:has(+h2:last-of-type)>li]:px-3',
            '[&>ul:has(+h2:last-of-type)>li]:py-1.5',
            '[&>ul:has(+h2:last-of-type)>li]:rounded-xl',
            '[&>ul:has(+h2:last-of-type)>li]:bg-gradient-to-br',
            '[&>ul:has(+h2:last-of-type)>li]:from-orange-300/60',
            '[&>ul:has(+h2:last-of-type)>li]:to-orange-200/30',
            '[&>ul:has(+h2:last-of-type)>li]:font-medium',
            // List (languages)
            '[&>ul:last-of-type]:list-none',
            '[&>ul:last-of-type]:m-0',
            '[&>ul:last-of-type]:p-0',
            '[&>ul:last-of-type]:lg:pl-28',
            '[&>ul:last-of-type]:overflow-hidden',
            '[&>ul:last-of-type]:flex',
            '[&>ul:last-of-type]:flex-wrap',
            '[&>ul:last-of-type]:gap-4',
            '[&>ul:last-of-type>li]:shrink-0',
            '[&>ul:last-of-type>li]:m-0',
            '[&>ul:last-of-type>li]:px-3',
            '[&>ul:last-of-type>li]:py-1.5',
            '[&>ul:last-of-type>li]:rounded-xl',
            '[&>ul:last-of-type>li]:bg-gradient-to-br',
            '[&>ul:last-of-type>li]:from-neutral-300/60',
            '[&>ul:last-of-type>li]:to-neutral-200/30',
            '[&>ul:last-of-type>li]:font-medium'
          ])}
          intent="light"
        />

        <Signature className="w-fit fill-neutral-600/75 mt-48 mb-12 mx-auto" />

        <ResumeHeading />
      </section>
    </>
  )
}

export async function getStaticProps({locales, locale, defaultLocale}) {
  const category = 'about-me'
  const page = 'resume'
  const content = await getContent({
    locale,
    page,
    category,
    isSubSection: true
  })
  const alternates = await Promise.all(
    locales.map(
      await fromLocalesToAlternates({
        defaultLocale,
        locale,
        page,
        section: category,
        category
      })
    )
  )

  return {
    props: {content, section: category, subSection: page, alternates}
  }
}
