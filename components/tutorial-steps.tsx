import {useEffect, useLayoutEffect, useRef, useState} from 'react'
import useTranslation from 'next-translate/useTranslation'
import {TutorialStep} from 'lib/blog/steps'

// How far down the viewport a heading has to get before its step is the one
// being read, as a fraction of the viewport height.
const ACTIVATION_LINE = 0.35

const SWEEP_BASE_DURATION = 200
const SWEEP_STEP_DURATION = 100
const SWEEP_MAX_DURATION = 900
// Once the line has arrived, the circles stop waiting for it.
const SWEEP_SETTLE_TIME = 300

interface ActiveStep {
  activeIndex: number
  previousIndex: number
}

function getSweepDuration(from: number, to: number) {
  return Math.min(
    SWEEP_BASE_DURATION + SWEEP_STEP_DURATION * Math.abs(to - from),
    SWEEP_MAX_DURATION
  )
}

function useActiveStep(ids: string[]) {
  const [state, setState] = useState<ActiveStep>({
    activeIndex: -1,
    previousIndex: -1
  })
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
      setState(current =>
        next === current.activeIndex
          ? current
          : {activeIndex: next, previousIndex: current.activeIndex}
      )
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

  useEffect(() => {
    if (state.previousIndex === state.activeIndex) return

    const timer = setTimeout(
      () =>
        setState(current => ({...current, previousIndex: current.activeIndex})),
      getSweepDuration(state.previousIndex, state.activeIndex) +
        SWEEP_SETTLE_TIME
    )

    return () => clearTimeout(timer)
  }, [state])

  return state
}

// Where the middle of each circle sits inside the list. The line is drawn from
// these, since a title that wraps makes a step taller than the next one.
function useCircleCenters(count: number) {
  const listRef = useRef<HTMLOListElement>(null)
  const circleRefs = useRef<HTMLSpanElement[]>([])
  const [centers, setCenters] = useState<number[]>([])

  useLayoutEffect(() => {
    const list = listRef.current

    function measure() {
      const next = circleRefs.current
        .slice(0, count)
        .map(
          circle =>
            (circle.offsetParent as HTMLElement).offsetTop +
            circle.offsetTop +
            circle.offsetHeight / 2
        )

      setCenters(current =>
        current.length === next.length &&
        current.every((center, index) => center === next[index])
          ? current
          : next
      )
    }

    measure()

    // Titles wrap differently when the rail changes width, and again once the
    // web font replaces the fallback one.
    const observer = new ResizeObserver(measure)

    observer.observe(list)

    return () => observer.disconnect()
  }, [count])

  return {listRef, circleRefs, centers}
}

export default function TutorialSteps({
  steps,
  className = ''
}: TutorialStepsProps) {
  const {t} = useTranslation('blog')
  const {activeIndex, previousIndex} = useActiveStep(steps.map(({id}) => id))
  const {listRef, circleRefs, centers} = useCircleCenters(steps.length)
  const hasCenters = centers.length === steps.length
  const duration = getSweepDuration(previousIndex, activeIndex)
  const sweepOrigin = centers[Math.max(previousIndex, 0)]
  const sweepLength = Math.abs(centers[Math.max(activeIndex, 0)] - sweepOrigin)
  const firstCenter = centers[0]
  const fillLength =
    hasCenters && activeIndex > 0 ? centers[activeIndex] - firstCenter : 0
  const gradientLength =
    hasCenters && activeIndex > 0
      ? centers[activeIndex] - centers[activeIndex - 1]
      : 0

  // The circles light up, or go out, as the line passes through them.
  function getDelay(index: number) {
    if (!hasCenters || previousIndex === activeIndex || sweepLength === 0) {
      return undefined
    }

    const [first, last] = [previousIndex, activeIndex].sort((a, b) => a - b)

    if (index < Math.max(first, 0) || index > last) return undefined

    const progress = Math.abs(centers[index] - sweepOrigin) / sweepLength

    return `${Math.round(Math.min(progress, 1) * duration)}ms`
  }

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

      <ol ref={listRef} className="relative">
        {hasCenters && steps.length > 1 && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-[17px] w-0.5 bg-orange-200/20"
            style={{
              top: firstCenter,
              height: centers[steps.length - 1] - firstCenter
            }}
          >
            <span
              className="absolute inset-x-0 top-0 overflow-hidden bg-orange-300 transition-[height] ease-linear motion-reduce:transition-none"
              style={{height: fillLength, transitionDuration: `${duration}ms`}}
            >
              {/* The stretch that leads into the step being read is the only
                  one with the gradient, riding the tip of the line. */}
              <span
                className="absolute inset-x-0 bottom-0 bg-gradient-to-b from-orange-200 to-orange-500"
                style={{height: gradientLength}}
              />
            </span>
          </span>
        )}

        {steps.map(({id, title}, index) => {
          const isDone = index < activeIndex
          const isActive = index === activeIndex
          const isLast = index === steps.length - 1
          const delay = getDelay(index)

          return (
            <li
              key={id}
              className="relative motion-safe:animate-fade-in motion-safe:[animation-fill-mode:backwards]"
              style={{animationDelay: `${index * 90}ms`}}
            >
              <a
                href={`#${id}`}
                aria-current={isActive ? 'step' : undefined}
                onClick={event => handleClick(event, id)}
                className="group flex gap-3"
              >
                <span
                  ref={element => {
                    circleRefs.current[index] = element
                  }}
                  aria-hidden="true"
                  className={`relative z-[1] flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-black leading-none transition-all duration-200 motion-reduce:transition-none ${
                    isDone
                      ? 'border-orange-300 bg-orange-300 text-neutral-900'
                      : isActive
                        ? 'scale-110 border-orange-500 bg-neutral-900 text-orange-300 shadow-[0_0_0_6px_rgba(249,115,22,0.15)]'
                        : 'border-orange-200/30 bg-neutral-900 text-neutral-500 group-hover:border-orange-300 group-hover:text-orange-300'
                  }`}
                  style={{transitionDelay: delay}}
                >
                  {index + 1}
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
                    style={{transitionDelay: delay}}
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
