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
      className={`rounded-md bg-neutral-800/60 p-6 min-[1500px]:rounded-none min-[1500px]:bg-transparent min-[1500px]:p-0 ${className}`}
    >
      <p className="mb-3 text-xs font-black uppercase tracking-widest text-neutral-500">
        {t('post.steps')}
      </p>

      <ol>
        {steps.map(({id, title}, index) => {
          const isDone = index < activeIndex
          const isActive = index === activeIndex
          const isLast = index === steps.length - 1
          // Only the stretch of line that leads into the step being read has
          // the gradient; the ones behind it are plain orange.
          const leadsToActive = index === activeIndex - 1

          return (
            <li
              key={id}
              className="motion-safe:animate-fade-in motion-safe:[animation-fill-mode:backwards]"
              style={{animationDelay: `${index * 90}ms`}}
            >
              <a
                href={`#${id}`}
                aria-current={isActive ? 'step' : undefined}
                onClick={event => handleClick(event, id)}
                className="group flex gap-3"
              >
                <span
                  aria-hidden="true"
                  className="flex w-9 shrink-0 flex-col items-center"
                >
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-black leading-none transition-all duration-200 motion-reduce:transition-none ${
                      isDone
                        ? 'border-orange-300 bg-orange-300 text-neutral-900'
                        : isActive
                          ? 'scale-110 border-orange-500 bg-neutral-900 text-orange-300 shadow-[0_0_0_6px_rgba(249,115,22,0.15)]'
                          : 'border-orange-200/30 text-neutral-500 group-hover:border-orange-300 group-hover:text-orange-300'
                    }`}
                  >
                    {index + 1}
                  </span>

                  {!isLast && (
                    <span className="w-0.5 flex-1 overflow-hidden bg-orange-200/20">
                      <span
                        className={`block size-full origin-top transition-transform duration-300 motion-reduce:transition-none ${
                          leadsToActive
                            ? 'bg-gradient-to-b from-orange-200 to-orange-500'
                            : 'bg-orange-300'
                        } ${isDone ? 'scale-y-100' : 'scale-y-0'}`}
                      />
                    </span>
                  )}
                </span>

                <span className={isLast ? '' : 'pb-6'}>
                  <span
                    className={`flex min-h-9 items-center text-balance text-sm leading-[18px] transition-colors duration-150 motion-reduce:transition-none ${
                      isActive
                        ? 'font-bold text-orange-300'
                        : isDone
                          ? 'font-light text-neutral-300'
                          : 'font-light text-neutral-500 group-hover:text-neutral-300'
                    }`}
                  >
                    {title}
                  </span>
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
