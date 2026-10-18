import {useEffect, useState} from 'react'
import useTranslation from 'next-translate/useTranslation'
import {TutorialStep} from 'lib/blog/steps'

// How far down the viewport a heading has to get before its step is the one
// being read, as a fraction of the viewport height.
const ACTIVATION_LINE = 0.35

function useActiveStep(ids: string[]) {
  const [activeIndex, setActiveIndex] = useState(-1)
  const key = ids.join()

  useEffect(() => {
    const headings = key
      .split(',')
      .map(id => document.getElementById(id))
      .filter(Boolean)

    if (headings.length === 0) return

    function update() {
      const line = window.innerHeight * ACTIVATION_LINE
      let next = -1

      headings.forEach((heading, index) => {
        if (heading.getBoundingClientRect().top <= line) next = index
      })
      setActiveIndex(next)
    }

    update()

    // A heading crossing the activation line is the only moment the active
    // step can change, so there is no need to listen to every scroll event.
    const observer = new IntersectionObserver(update, {
      rootMargin: `0px 0px -${(1 - ACTIVATION_LINE) * 100}% 0px`,
      threshold: [0, 1]
    })

    headings.forEach(heading => observer.observe(heading))
    window.addEventListener('resize', update)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [key])

  return activeIndex
}

export default function TutorialSteps({
  steps,
  className = ''
}: TutorialStepsProps) {
  const {t} = useTranslation('blog')
  const activeIndex = useActiveStep(steps.map(({id}) => id))

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const heading = document.getElementById(id)

    if (!heading) return

    event.preventDefault()
    heading.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth'
    })
    window.history.replaceState(null, '', `#${id}`)
  }

  return (
    <nav
      aria-label={t('post.steps')}
      className={`rounded-md bg-neutral-800/60 p-6 min-[1400px]:rounded-none min-[1400px]:bg-transparent min-[1400px]:p-0 ${className}`}
    >
      <p className="mb-3 text-xs font-black uppercase tracking-widest text-neutral-500">
        {t('post.steps')}
      </p>

      <ol>
        {steps.map(({id, title}, index) => {
          const isDone = index < activeIndex
          const isActive = index === activeIndex
          const isLast = index === steps.length - 1

          return (
            <li
              key={id}
              className="relative pb-3 last:pb-0 motion-safe:animate-fade-in motion-safe:[animation-fill-mode:backwards]"
              style={{animationDelay: `${index * 90}ms`}}
            >
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 left-[17px] top-9 w-0.5 overflow-hidden bg-orange-200/20"
                >
                  <span
                    className={`block size-full origin-top bg-gradient-to-b from-orange-500 to-orange-200 transition-transform duration-300 motion-reduce:transition-none ${isDone ? 'scale-y-100' : 'scale-y-0'}`}
                  />
                </span>
              )}

              <a
                href={`#${id}`}
                aria-current={isActive ? 'step' : undefined}
                onClick={event => handleClick(event, id)}
                className="group relative flex gap-3"
              >
                <span
                  aria-hidden="true"
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black transition-all duration-200 motion-reduce:transition-none ${
                    isDone
                      ? 'border-orange-300 bg-orange-300 text-neutral-900'
                      : isActive
                        ? 'scale-110 border-orange-500 bg-neutral-900 text-orange-300 shadow-[0_0_0_6px_rgba(249,115,22,0.15)]'
                        : 'border-orange-200/30 text-neutral-500 group-hover:border-orange-300 group-hover:text-orange-300'
                  }`}
                >
                  {index + 1}
                </span>

                <span
                  className={`pt-1.5 text-sm leading-snug transition-colors duration-150 motion-reduce:transition-none ${
                    isActive
                      ? 'font-bold text-orange-300'
                      : isDone
                        ? 'font-light text-neutral-300'
                        : 'font-light text-neutral-500 group-hover:text-neutral-300'
                  }`}
                >
                  {title}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

TutorialSteps.displayName = 'TutorialSteps'

interface TutorialStepsProps {
  steps: TutorialStep[]
  className?: string
}
